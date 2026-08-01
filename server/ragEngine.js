import { vectorStore } from './vectorStore.js';

/**
 * Conversational Memory Store mapping sessionId -> Chat History Array
 */
const sessionMemories = new Map();

export class RAGEngine {
  /**
   * Retrieves or initializes conversational memory for a session
   */
  static getSessionHistory(sessionId) {
    if (!sessionMemories.has(sessionId)) {
      sessionMemories.set(sessionId, [
        {
          role: 'system',
          content: 'You are AcademiX AI, a helpful, context-aware academic assistant that answers queries using retrieved university documents, syllabus records, and official guidelines. Always cite source documents and maintain strict accuracy without hallucination.',
          timestamp: new Date().toISOString()
        }
      ]);
    }
    return sessionMemories.get(sessionId);
  }

  /**
   * Clears memory for a given session
   */
  static clearSessionHistory(sessionId) {
    sessionMemories.delete(sessionId);
    return { success: true, message: `Session memory for ${sessionId} cleared.` };
  }

  /**
   * Generates a context-aware RAG response using vector search and session memory
   */
  static generateResponse({ sessionId, query, topK = 5 }) {
    const startTime = Date.now();
    const history = this.getSessionHistory(sessionId);

    // 1. Vector Search Retrieval
    const searchResults = vectorStore.search(query, topK);
    const topResult = searchResults[0];

    // Check if relevant context was found (Hallucination Blocker Threshold)
    const isGroundingSufficient = topResult && topResult.similarity >= 0.22;

    // 2. Extract recent user history context (up to last 6 messages)
    const recentHistory = history
      .filter(msg => msg.role !== 'system')
      .slice(-6)
      .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join('\n');

    let responseText = '';
    let citations = [];

    if (!isGroundingSufficient) {
      // Friendly message when no relevant document exists (Requirement 7)
      responseText = "No relevant study material found.";
      citations = [];
    } else {
      // Build response with citations
      const matchedChunks = searchResults.filter(r => r.similarity >= 0.22);
      
      citations = matchedChunks.map(c => ({
        id: c.id,
        docTitle: c.docTitle,
        category: c.category,
        pageNumber: c.chunkIndex || 1,
        matchPercentage: c.matchPercentage,
        similarity: c.similarity,
        snippet: c.content.length > 180 ? c.content.substring(0, 180) + '...' : c.content
      }));

      // Synthesize answer based on query & retrieved context
      responseText = this.synthesizeAnswer(query, matchedChunks, recentHistory);
    }

    const latencyMs = Date.now() - startTime;

    // 3. Append to Session Memory
    history.push({ role: 'user', content: query, timestamp: new Date().toISOString() });
    history.push({
      role: 'assistant',
      content: responseText,
      citations: citations,
      timestamp: new Date().toISOString()
    });

    return {
      sessionId,
      query,
      answer: responseText,
      citations: citations,
      isGrounded: isGroundingSufficient,
      retrievedChunksCount: searchResults.length,
      latencyMs: Math.max(12, latencyMs),
      retrievedChunks: searchResults
    };
  }

  /**
   * Synthesizes an intelligent, context-grounded response text with document name & page/chunk citations
   */
  static synthesizeAnswer(query, matchedChunks, historyText) {
    if (!matchedChunks || matchedChunks.length === 0) {
      return "No relevant study material found.";
    }

    let answerBody = `Based on the official study materials, here is the relevant information for your query:\n\n`;
    
    // Add context strictly from top retrieved chunks
    matchedChunks.slice(0, 3).forEach((chunk) => {
      answerBody += `> "${chunk.content.trim()}"\n\n`;
    });

    // Add explicit citations section
    answerBody += `### Source Documents:\n`;
    const uniqueDocs = new Set();
    matchedChunks.forEach(chunk => {
      const citationId = `📄 **${chunk.docTitle}** (Page #${chunk.chunkIndex || 1})`;
      if (!uniqueDocs.has(citationId)) {
        uniqueDocs.add(citationId);
        answerBody += `- ${citationId} - ${chunk.matchPercentage}% match\n`;
      }
    });

    return answerBody;
  }
}
