// @ts-nocheck

// Supabase é carregado via tag de script no index.html, então estará disponível no objeto window.
const { createClient } = window.supabase;

const supabaseUrl = 'https://avcpoeouasfeuqsbyuoy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2Y3BvZW91YXNmZXVxc2J5dW95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0OTkxMjIsImV4cCI6MjA3NzA3NTEyMn0.0eF-yCEBAuHl8B3ORN7VYfJnnEIY0m1bMj8R_FsntNM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);