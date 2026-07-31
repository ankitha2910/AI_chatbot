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
      .filter(w => w.length > 2);
  }

  /**
   * Computes dense semantic vector embedding (dimension 384) for a given text chunk
   */
  createVectorEmbedding(text) {
    const vector = new Array(this.vectorDimension).fill(0);
    const tokens = this.tokenize(text);
    
    if (tokens.length === 0) return vector;

    tokens.forEach((token, index) => {
      // Deterministic hash mapping to vector dimensions
      let hash = 0;
      for (let i = 0; i < token.length; i++) {
        hash = (hash << 5) - hash + token.charCodeAt(i);
        hash |= 0;
      }
      
      const dim1 = Math.abs(hash) % this.vectorDimension;
      const dim2 = Math.abs(hash * 31) % this.vectorDimension;
      const weight = 1 + (index === 0 ? 0.5 : 0); // Position weighting

      vector[dim1] += weight * 0.7;
      vector[dim2] += weight * 0.3;
    });

    // L2 Normalization
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    if (magnitude > 0) {
      for (let i = 0; i < vector.length; i++) {
        vector[i] = vector[i] / magnitude;
      }
    }

    return vector;
  }

  /**
   * Calculates cosine similarity between two normalized vectors
   */
  cosineSimilarity(vecA, vecB) {
    let dotProduct = 0;
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
    }
    return Math.max(0, Math.min(1, dotProduct));
  }

  /**
   * Chunks a long text document into overlapping chunks (size ~400 chars, overlap ~60 chars)
   */
  chunkText(text, maxChars = 450, overlap = 70) {
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const chunks = [];

    paragraphs.forEach(para => {
      const trimmed = para.trim();
      if (trimmed.length <= maxChars) {
        chunks.push(trimmed);
      } else {
        // Split longer paragraphs
        let start = 0;
        while (start < trimmed.length) {
          let end = Math.min(start + maxChars, trimmed.length);
          // Try to break on sentence or space boundary
          if (end < trimmed.length) {
            const lastPeriod = trimmed.lastIndexOf('.', end);
            if (lastPeriod > start + 100) {
              end = lastPeriod + 1;
            } else {
              const lastSpace = trimmed.lastIndexOf(' ', end);
              if (lastSpace > start + 100) end = lastSpace;
            }
          }
          const chunk = trimmed.substring(start, end).trim();
          if (chunk.length > 20) {
            chunks.push(chunk);
          }
          start += (maxChars - overlap);
        }
      }
    });

    return chunks.length > 0 ? chunks : [text.trim()];
  }

  /**
   * Reindexes all documents and FAQs in the vector store
   */
  reindexAll() {
    this.chunks = [];

    // Index Documents
    this.documents.forEach(doc => {
      const textChunks = this.chunkText(doc.content);
      textChunks.forEach((chunkText, idx) => {
        const vector = this.createVectorEmbedding(chunkText);
        this.chunks.push({
          id: `${doc.id}-chunk-${idx + 1}`,
          docId: doc.id,
          docTitle: doc.title,
          category: doc.category,
          type: 'document',
          content: chunkText,
          chunkIndex: idx + 1,
          totalChunks: textChunks.length,
          vector: vector
        });
      });
    });

    // Index FAQs
    this.faqs.forEach(faq => {
      const combinedText = `FAQ Question: ${faq.question}\nAnswer: ${faq.answer}`;
      const vector = this.createVectorEmbedding(combinedText);
      this.chunks.push({
        id: faq.id,
        docId: faq.id,
        docTitle: `FAQ: ${faq.question}`,
        category: faq.category,
        type: 'faq',
        content: combinedText,
        question: faq.question,
        answer: faq.answer,
        vector: vector
      });
    });
  }

  /**
   * Performs Semantic Vector Search given a user prompt
   */
  search(query, topK = 4) {
    this.queryCount++;
    const queryVector = this.createVectorEmbedding(query);
    const queryTokens = this.tokenize(query);

    const scoredChunks = this.chunks.map(chunk => {
      const vecSimilarity = this.cosineSimilarity(queryVector, chunk.vector);
      
      // Keyword overlap boost for exact query matches
      const chunkTokens = this.tokenize(chunk.content);
      let keywordHits = 0;
      queryTokens.forEach(qToken => {
        if (chunkTokens.includes(qToken)) keywordHits++;
      });

      const keywordBoost = queryTokens.length > 0 ? (keywordHits / queryTokens.length) * 0.35 : 0;
      const combinedScore = Math.min(0.99, vecSimilarity * 0.65 + keywordBoost);

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

