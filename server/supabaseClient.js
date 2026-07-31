import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

let supabaseUrl = process.env.SUPABASE_URL || '';
if (supabaseUrl && !supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
  supabaseUrl = `https://${supabaseUrl}.supabase.co`;
}

const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

// Check if valid credentials are provided
const isConfigured = 
  Boolean(supabaseUrl) && 
  Boolean(supabaseKey) && 
  !supabaseUrl.includes('your-project-id') && 
  !supabaseKey.includes('your-supabase');

export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

export const isSupabaseConnected = () => isConfigured;

export const getSupabaseStatus = () => {
  if (isConfigured) {
    return {
      connected: true,
      url: supabaseUrl,
      mode: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Service Role (Full Admin)' : 'Anon Client',
      message: 'Supabase Vector & Database integration active.'
    };
  }
  return {
    connected: false,
    mode: 'In-Memory Local Engine',
    message: 'Supabase URL/Key missing or placeholder. Running in local in-memory fallback mode.'
  };
};
