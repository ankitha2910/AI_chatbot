-- ============================================================================
-- EduAssist RAG Chatbot - Supabase Database & pgvector Schema
-- ============================================================================
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard)
-- to initialize vector extension, tables, and vector similarity search RPC.
-- ============================================================================

-- 1. Enable pgvector extension for high-performance vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Documents Table
CREATE TABLE IF NOT EXISTS public.documents (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT DEFAULT 'General Reference',
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. FAQs Table
CREATE TABLE IF NOT EXISTS public.faqs (
    id TEXT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT DEFAULT 'General FAQ',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Vector Chunks Table (384-dimensional dense semantic vectors)
CREATE TABLE IF NOT EXISTS public.vector_chunks (
    id TEXT PRIMARY KEY,
    doc_id TEXT REFERENCES public.documents(id) ON DELETE CASCADE,
    doc_title TEXT NOT NULL,
    category TEXT DEFAULT 'General Reference',
    type TEXT NOT NULL DEFAULT 'document',
    content TEXT NOT NULL,
    chunk_index INT,
    total_chunks INT,
    embedding vector(384),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast cosine similarity vector search
CREATE INDEX IF NOT EXISTS vector_chunks_embedding_idx 
ON public.vector_chunks 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- 5. Stored Procedure for Cosine Similarity Vector Search
CREATE OR REPLACE FUNCTION public.match_vector_chunks(
    query_embedding vector(384),
    match_threshold FLOAT DEFAULT 0.20,
    match_count INT DEFAULT 4
)
RETURNS TABLE (
    id TEXT,
    doc_id TEXT,
    doc_title TEXT,
    category TEXT,
    type TEXT,
    content TEXT,
    chunk_index INT,
    total_chunks INT,
    similarity FLOAT
)
LANGUAGE sql STABLE
AS $$
    SELECT
        vc.id,
        vc.doc_id,
        vc.doc_title,
        vc.category,
        vc.type,
        vc.content,
        vc.chunk_index,
        vc.total_chunks,
        (1 - (vc.embedding <=> query_embedding))::FLOAT AS similarity
    FROM public.vector_chunks vc
    WHERE (1 - (vc.embedding <=> query_embedding)) >= match_threshold
    ORDER BY vc.embedding <=> query_embedding ASC
    LIMIT match_count;
$$;

-- Enable Row Level Security (RLS) policies for public access (or configure as needed)
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vector_chunks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to documents" ON public.documents FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update/delete on documents" ON public.documents FOR ALL USING (true);

CREATE POLICY "Allow public read access to faqs" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update/delete on faqs" ON public.faqs FOR ALL USING (true);

CREATE POLICY "Allow public read access to vector_chunks" ON public.vector_chunks FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update/delete on vector_chunks" ON public.vector_chunks FOR ALL USING (true);
