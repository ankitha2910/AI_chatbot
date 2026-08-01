import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { vectorStore } from './vectorStore.js';
import { RAGEngine } from './ragEngine.js';
import { supabase, isSupabaseConnected, getSupabaseStatus } from './supabaseClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure Multer for File Uploads (Uses /tmp in Vercel serverless environment)
const uploadDir = process.env.VERCEL ? '/tmp/uploads' : path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Health Check & Supabase Integration Status
app.get(['/api/health', '/health'], (req, res) => {
  res.json({
    status: 'ok',
    service: 'AcademiX RAG Engine',
    supabase: getSupabaseStatus(),
    timestamp: new Date().toISOString()
  });
});

app.get(['/api/supabase/status', '/supabase/status'], (req, res) => {
  res.json(getSupabaseStatus());
});

// Chat Query Endpoint (RAG + Conversational Memory)
app.post(['/api/chat', '/chat'], (req, res) => {
  try {
    const { query, sessionId = 'default-session', topK = 4 } = req.body;
    
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({ error: 'Query text is required.' });
    }

    const response = RAGEngine.generateResponse({
      sessionId,
      query: query.trim(),
      topK: parseInt(topK) || 4
    });

    res.json(response);
  } catch (error) {
    console.error('Chat RAG error:', error);
    res.status(500).json({ error: 'Internal RAG generation failure', details: error.message });
  }
});

// Reset Conversational Memory
app.delete(['/api/chat/history/:sessionId', '/chat/history/:sessionId'], (req, res) => {
  const { sessionId } = req.params;
  const result = RAGEngine.clearSessionHistory(sessionId);
  res.json(result);
});

// List All Documents
app.get(['/api/documents', '/documents'], (req, res) => {
  res.json({
    documents: vectorStore.documents,
    count: vectorStore.documents.length
  });
});

// Ingest / Upload Document (Text or PDF simulation)
app.post(['/api/documents/upload', '/documents/upload'], upload.single('file'), async (req, res) => {
  try {
    const { title, category, textContent } = req.body;
    let finalContent = textContent || '';
    let fileUrl = null;

    if (req.file) {
      const filePath = req.file.path;
      // Read text file contents if provided as file
      if (req.file.mimetype === 'text/plain' || req.file.originalname.endsWith('.txt') || req.file.originalname.endsWith('.md')) {
        finalContent = fs.readFileSync(filePath, 'utf-8');
      } else {
        // Simple fallback extracted text representation for uploaded documents
        finalContent = `Extracted Text content from uploaded file: ${req.file.originalname}.\nFile size: ${req.file.size} bytes.\n\n${textContent || 'Document uploaded to AcademiX Knowledge Store.'}`;
      }

      // Upload file to Supabase Storage if connected
      if (isSupabaseConnected() && supabase) {
        const fileData = fs.readFileSync(filePath);
        const fileName = `${Date.now()}_${req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('documents')
          .upload(fileName, fileData, {
            contentType: req.file.mimetype,
            upsert: false
          });

        if (uploadError) {
          console.error("Supabase Storage Upload Error:", uploadError.message);
        } else if (uploadData) {
          // Get public URL
          const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(fileName);
          fileUrl = publicUrl;
        }
      }
    }

    if (!title || !finalContent) {
      return res.status(400).json({ error: 'Document title and content are required.' });
    }

    const newDoc = vectorStore.addDocument({
      title: title.trim(),
      category: category || 'General Ingested',
      content: finalContent.trim(),
      fileUrl: fileUrl
    });

    res.status(201).json({
      message: 'Document successfully ingested and indexed into vector database.',
      document: newDoc,
      stats: vectorStore.getStats()
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Failed to ingest document', details: error.message });
  }
});

// Delete Document
app.delete(['/api/documents/:id', '/documents/:id'], (req, res) => {
  const { id } = req.params;
  vectorStore.deleteDocument(id);
  res.json({ message: `Document ${id} deleted and vector store reindexed.`, stats: vectorStore.getStats() });
});

// List FAQs
app.get(['/api/faqs', '/faqs'], (req, res) => {
  res.json({ faqs: vectorStore.faqs, count: vectorStore.faqs.length });
});

// Add FAQ
app.post(['/api/faqs', '/faqs'], (req, res) => {
  const { question, answer, category } = req.body;
  if (!question || !answer) {
    return res.status(400).json({ error: 'Both question and answer are required.' });
  }
  const newFaq = vectorStore.addFaq({ question, answer, category });
  res.status(201).json({ message: 'FAQ indexed into vector database.', faq: newFaq });
});

// Delete FAQ
app.delete(['/api/faqs/:id', '/faqs/:id'], (req, res) => {
  const { id } = req.params;
  vectorStore.deleteFaq(id);
  res.json({ message: `FAQ ${id} removed from vector store.`, stats: vectorStore.getStats() });
});

// Direct Vector Search Testbench API
app.post('/api/vector/search', (req, res) => {
  const { query, topK = 4 } = req.body;
  if (!query) return res.status(400).json({ error: 'Search query required.' });

  const results = vectorStore.search(query, parseInt(topK) || 4);
  res.json({
    query,
    totalChunksSearched: vectorStore.chunks.length,
    resultsCount: results.length,
    results: results.map(r => ({
      id: r.id,
      docTitle: r.docTitle,
      category: r.category,
      type: r.type,
      similarity: r.similarity,
      matchPercentage: r.matchPercentage,
      content: r.content
    }))
  });
});

// Knowledge Base Statistics
app.get('/api/stats', (req, res) => {
  res.json(vectorStore.getStats());
});

// Start Server (only when not running in Vercel serverless environment)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    const sbStatus = getSupabaseStatus();
    console.log(`🚀 AcademiX RAG Express Backend Server running on http://localhost:${PORT}`);
    console.log(`⚡ Supabase Integration: ${sbStatus.connected ? 'CONNECTED (' + sbStatus.mode + ')' : 'DISCONNECTED (' + sbStatus.message + ')'}`);
  });
}

export default app;
