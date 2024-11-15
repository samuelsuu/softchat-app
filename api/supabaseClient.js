// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mxepdjifcsjnwsafghfl.supabase.co'; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14ZXBkamlmY3NqbndzYWZnaGZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg4MzI5NDAsImV4cCI6MjA0NDQwODk0MH0.KuDEk7JP5UfSlYRO8OEiKjGWoZuxKaYeycuDgtMjNnA'; // Replace with your Supabase Anon Key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
