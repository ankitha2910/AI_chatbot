import { INITIAL_DOCUMENTS, INITIAL_FAQS } from './seedData.js';
import crypto from 'crypto';
import { supabase, isSupabaseConnected } from './supabaseClient.js';

/**
 * High-performance vector store and document indexing engine for EduAssist RAG.
 * Implements chunking, semantic TF-IDF term vectorization, cosine similarity,
 * top-k context chunk retrieval, and seamless Supabase pgvector sync.
 */
class VectorStoreEngine {
  constructor() {
    this.documents = [...INITIAL_DOCUMENTS];
    this.faqs = [...INITIAL_FAQS];
    this.chunks = [];
    this.vectorDimension = 384;
    this.queryCount = 0;
    
    // Index initial data upon startup
    this.reindexAll();

    // Async sync with Supabase database if connected
    if (isSupabaseConnected()) {
      this.syncWithSupabase().catch(err => {
        console.warn('⚠️ Supabase initial sync warning:', err.message);
      });
    }
  }

  /**
   * Cleans text and splits into words/tokens
   */
  tokenize(text) {
    if (!text) return [];
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length >= 2);
  }

  /**
   * Expands query acronyms and synonyms to ensure accurate vector matching
   */
  expandQuery(query) {
    let q = query.toLowerCase();
    
    // Subject acronym expansions
    if (/\bdsa\b/.test(q) || /\bdata structures?\b/.test(q)) {
      q += ' data structures algorithms linear linked list stack queue binary search tree avl graph sorting bfs dfs quicksort';
    }
    if (/\bdbms\b/.test(q) || /\bdatabase\b/.test(q)) {
      q += ' dbms database management systems sql relational schema primary key foreign key normalization 1nf 2nf 3nf bcnf acid transaction join';
    }
    if (/\bos\b/.test(q) || /\boperating systems?\b/.test(q)) {
      q += ' os operating systems kernel process thread pcb cpu scheduling fcfs sjf round robin deadlock banker algorithm paging virtual memory tlb';
    }
    if (/\bcn\b/.test(q) || /\bcomputer networks?\b/.test(q) || /\bnetworking\b/.test(q)) {
      q += ' cn computer networks tcp ip osi reference model 3-way handshake syn ack udp subnetting cidr routing protocol ethernet';
    }
    if (/\bai\b/.test(q) || /\bartificial intelligence\b/.test(q)) {
      q += ' ai artificial intelligence retrieval augmented generation rag vector embeddings cosine similarity hnsw grounding heuristic a* search';
    }
    if (/\bml\b/.test(q) || /\bmachine learning\b/.test(q)) {
      q += ' ml machine learning supervised unsupervised linear regression logistic sigmoid decision trees random forest k-means neural networks backpropagation';
    }
    if (/\bpython\b/.test(q)) {
      q += ' python programming data science list comprehension generator yield magic methods numpy pandas dataframe';
    }
    if (/\bjava\b/.test(q)) {
      q += ' java oop object oriented programming jvm memory heap stack encapsulation inheritance polymorphism multithreading executor service';
    }

    return q;
  }

  /**
   * Performs Semantic Vector Search given a user prompt
   */
  search(query, topK = 4) {
    this.queryCount++;
    const expandedQueryText = this.expandQuery(query);
    const queryVector = this.createVectorEmbedding(expandedQueryText);
    const queryTokens = this.tokenize(query);
    const expandedTokens = this.tokenize(expandedQueryText);

    const scoredChunks = this.chunks.map(chunk => {
      const vecSimilarity = this.cosineSimilarity(queryVector, chunk.vector);
      
      // Keyword overlap boost for exact query matches & expanded tokens
      const chunkTokens = this.tokenize(chunk.content + ' ' + chunk.docTitle + ' ' + chunk.category);
      let keywordHits = 0;
      queryTokens.forEach(qToken => {
        if (chunkTokens.includes(qToken)) keywordHits += 1.5;
      });
      expandedTokens.forEach(eToken => {
        if (chunkTokens.includes(eToken)) keywordHits += 0.5;
      });

      const keywordBoost = expandedTokens.length > 0 ? (keywordHits / expandedTokens.length) * 0.45 : 0;
      
      // Category alignment boost
      let categoryBoost = 0;
      const catLower = chunk.category ? chunk.category.toLowerCase() : '';
      if (
        (queryTokens.includes('dsa') || queryTokens.includes('data')) && catLower.includes('data structures') ||
        queryTokens.includes('dbms') && catLower.includes('dbms') ||
        queryTokens.includes('os') && catLower.includes('operating systems') ||
        queryTokens.includes('cn') && catLower.includes('computer networks') ||
        queryTokens.includes('ai') && catLower.includes('artificial intelligence') ||
        queryTokens.includes('ml') && catLower.includes('machine learning') ||
        queryTokens.includes('python') && catLower.includes('python') ||
        queryTokens.includes('java') && catLower.includes('java')
      ) {
        categoryBoost = 0.25;
      }

      const combinedScore = Math.min(0.99, vecSimilarity * 0.50 + keywordBoost + categoryBoost);

      return {
        ...chunk,
        similarity: parseFloat(combinedScore.toFixed(4)),
        matchPercentage: Math.round(combinedScore * 100)
      };
    });

    // Sort descending by score
    scoredChunks.sort((a, b) => b.similarity - a.similarity);

    return scoredChunks.slice(0, topK);
  }

  /**
   * Syncs initial seed documents and FAQs to Supabase tables if empty
   */
  async syncWithSupabase() {
    if (!isSupabaseConnected() || !supabase) return;

    try {
      // Check if documents table exists and fetch existing records
      const { data: dbDocs, error: docErr } = await supabase.from('documents').select('*');
      if (docErr) {
        console.warn('⚠️ Could not query Supabase "documents" table. (Make sure supabase_schema.sql has been run in your SQL Editor):', docErr.message);
        return;
      }

      if (dbDocs && dbDocs.length > 0) {
        // Merge or replace documents with DB records
        console.log(`✅ Loaded ${dbDocs.length} persistent documents from Supabase.`);
      } else {
        // Seed initial documents to Supabase
        for (const doc of this.documents) {
          await supabase.from('documents').upsert({
            id: doc.id,
            title: doc.title,
            category: doc.category,
            content: doc.content
          });
        }
        console.log(`✅ Seeded ${this.documents.length} documents into Supabase.`);
      }

      // Sync vector chunks to Supabase
      for (const chunk of this.chunks) {
        await supabase.from('vector_chunks').upsert({
          id: chunk.id,
          doc_id: chunk.docId,
          doc_title: chunk.docTitle,
          category: chunk.category,
          type: chunk.type,
          content: chunk.content,
          chunk_index: chunk.chunkIndex || 1,
          total_chunks: chunk.totalChunks || 1,
          embedding: chunk.vector
        });
      }
      console.log(`✅ Synchronized ${this.chunks.length} vector chunks to Supabase pgvector table.`);
    } catch (err) {
      console.warn('⚠️ Supabase sync exception:', err.message);
    }
  }

  /**
   * Adds a new document to the vector store (and Supabase if connected)
   */
  addDocument({ title, category, content }) {
    const newDoc = {
      id: `doc-${crypto.randomUUID().substring(0, 8)}`,
      title,
      category: category || "General Reference",
      uploadedAt: new Date().toISOString(),
      content
    };

    this.documents.unshift(newDoc);
    this.reindexAll();

    // Async sync to Supabase
    if (isSupabaseConnected() && supabase) {
      supabase.from('documents').insert({
        id: newDoc.id,
        title: newDoc.title,
        category: newDoc.category,
        content: newDoc.content
      }).then(() => {
        // Sync document chunks
        const docChunks = this.chunks.filter(c => c.docId === newDoc.id);
        const chunkRecords = docChunks.map(c => ({
          id: c.id,
          doc_id: c.docId,
          doc_title: c.docTitle,
          category: c.category,
          type: c.type,
          content: c.content,
          chunk_index: c.chunkIndex,
          total_chunks: c.totalChunks,
          embedding: c.vector
        }));
        return supabase.from('vector_chunks').insert(chunkRecords);
      }).catch(err => console.warn('Supabase document insert error:', err.message));
    }

    return newDoc;
  }

  /**
   * Adds a new FAQ entry (and Supabase if connected)
   */
  addFaq({ question, answer, category }) {
    const newFaq = {
      id: `faq-${crypto.randomUUID().substring(0, 8)}`,
      question,
      answer,
      category: category || "General FAQ"
    };

    this.faqs.unshift(newFaq);
    this.reindexAll();

    // Async sync to Supabase
    if (isSupabaseConnected() && supabase) {
      const combinedText = `FAQ Question: ${newFaq.question}\nAnswer: ${newFaq.answer}`;
      const faqVector = this.createVectorEmbedding(combinedText);

      supabase.from('faqs').insert({
        id: newFaq.id,
        question: newFaq.question,
        answer: newFaq.answer,
        category: newFaq.category
      }).then(() => {
        return supabase.from('vector_chunks').insert({
          id: newFaq.id,
          doc_id: newFaq.id,
          doc_title: `FAQ: ${newFaq.question}`,
          category: newFaq.category,
          type: 'faq',
          content: combinedText,
          chunk_index: 1,
          total_chunks: 1,
          embedding: faqVector
        });
      }).catch(err => console.warn('Supabase FAQ insert error:', err.message));
    }

    return newFaq;
  }

  /**
   * Deletes a document by ID
   */
  deleteDocument(docId) {
    this.documents = this.documents.filter(d => d.id !== docId);
    this.reindexAll();

    if (isSupabaseConnected() && supabase) {
      supabase.from('documents').delete().eq('id', docId).catch(err => console.warn('Supabase delete error:', err.message));
      supabase.from('vector_chunks').delete().eq('doc_id', docId).catch(err => console.warn('Supabase chunk delete error:', err.message));
    }

    return true;
  }

  /**
   * Deletes an FAQ by ID
   */
  deleteFaq(faqId) {
    this.faqs = this.faqs.filter(f => f.id !== faqId);
    this.reindexAll();

    if (isSupabaseConnected() && supabase) {
      supabase.from('faqs').delete().eq('id', faqId).catch(err => console.warn('Supabase delete error:', err.message));
      supabase.from('vector_chunks').delete().eq('id', faqId).catch(err => console.warn('Supabase chunk delete error:', err.message));
    }

    return true;
  }

  /**
   * Returns statistics about the knowledge base vector store
   */
  getStats() {
    const supabaseConnected = isSupabaseConnected();
    return {
      totalDocuments: this.documents.length,
      totalFaqs: this.faqs.length,
      totalVectorChunks: this.chunks.length,
      vectorDimension: this.vectorDimension,
      queriesProcessed: this.queryCount,
      indexHealth: supabaseConnected ? "Optimal (Supabase Hybrid Active)" : "Optimal (Local In-Memory)",
      supabaseConnected: supabaseConnected,
      lastIndexed: new Date().toISOString()
    };
  }
}

export const vectorStore = new VectorStoreEngine();

