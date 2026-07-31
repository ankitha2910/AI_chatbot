const API_BASE = '/api';

export async function sendChatMessage(query, sessionId = 'default-session', topK = 3) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, sessionId, topK })
  });
  if (!res.ok) throw new Error(`RAG Server Error: ${res.statusText}`);
  return await res.json();
}

export async function clearChatSession(sessionId) {
  const res = await fetch(`${API_BASE}/chat/history/${sessionId}`, {
    method: 'DELETE'
  });
  return await res.json();
}

export async function fetchDocuments() {
  const res = await fetch(`${API_BASE}/documents`);
  if (!res.ok) throw new Error('Failed to load documents');
  return await res.json();
}

export async function uploadDocument(title, category, textContent, file = null) {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('category', category);
  formData.append('textContent', textContent);
  if (file) {
    formData.append('file', file);
  }

  const res = await fetch(`${API_BASE}/documents/upload`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) throw new Error('Document ingestion failed');
  return await res.json();
}

export async function deleteDocument(id) {
  const res = await fetch(`${API_BASE}/documents/${id}`, {
    method: 'DELETE'
  });
  return await res.json();
}

export async function fetchFaqs() {
  const res = await fetch(`${API_BASE}/faqs`);
  return await res.json();
}

export async function addFaq(question, answer, category) {
  const res = await fetch(`${API_BASE}/faqs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, answer, category })
  });
  return await res.json();
}

export async function deleteFaq(id) {
  const res = await fetch(`${API_BASE}/faqs/${id}`, {
    method: 'DELETE'
  });
  return await res.json();
}

export async function testVectorSearch(query, topK = 4) {
  const res = await fetch(`${API_BASE}/vector/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, topK })
  });
  return await res.json();
}

export async function fetchStats() {
  const res = await fetch(`${API_BASE}/stats`);
  return await res.json();
}
