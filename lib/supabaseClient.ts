// @ts-nocheck

// O Supabase é carregado por meio de uma tag de script no index.html, então estará disponível no objeto window.

// Esta verificação garante que o aplicativo não falhe com um erro enigmático se o script CDN do Supabase não carregar.
if (!window.supabase || typeof window.supabase.createClient !== 'function') {
    console.error('Cliente Supabase não encontrado. O aplicativo não pode iniciar.');
    const rootElement = document.getElementById('root');
    if (rootElement) {
        rootElement.innerHTML = `
            <div style="padding: 2rem; text-align: center; color: #ff1744;">
                <h1 style="font-size: 1.5rem; font-weight: bold;">Erro Crítico de Inicialização</h1>
                <p>Não foi possível carregar as dependências essenciais (Supabase).</p>
                <p>Por favor, verifique sua conexão com a internet e tente recarregar a página.</p>
            </div>
        `;
    }
    // Interrompe a execução do script
    throw new Error('O cliente Supabase não está disponível no objeto window.');
}


const { createClient } = window.supabase;

const supabaseUrl = 'https://avcpoeouasfeuqsbyuoy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2Y3BvZW91YXNmZXVxc2J5dW95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0OTkxMjIsImV4cCI6MjA3NzA3NTEyMn0.0eF-yCEBAuHl8B3ORN7VYfJnnEIY0m1bMj8R_FsntNM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
