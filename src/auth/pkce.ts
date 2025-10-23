// src/auth/pkce.ts
// Utilitários para PKCE (Proof Key for Code Exchange)

export function base64url(ab: ArrayBuffer | string): string {
  if (typeof ab === 'string') {
    return btoa(ab)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
  return btoa(String.fromCharCode(...new Uint8Array(ab)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function genCodeVerifier(len = 64): string {
  const arr = new Uint8Array(len);
  
  // Verifica se crypto está disponível
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(arr);
  } else {
    // Fallback para ambientes sem crypto
    for (let i = 0; i < len; i++) {
      arr[i] = Math.floor(Math.random() * 256);
    }
  }
  
  return base64url(arr.buffer);
}

// Implementação simples de SHA-256 para ambientes sem crypto.subtle
// ATENÇÃO: Isso é para desenvolvimento apenas! Em produção, use HTTPS!
async function sha256Fallback(str: string): Promise<string> {
  console.warn('⚠️ Usando SHA-256 fallback - NÃO USE EM PRODUÇÃO!');
  
  // Para desenvolvimento, usamos plain (sem hash)
  // O IAM deve aceitar code_challenge_method=plain em dev
  return str;
}

export async function genCodeChallenge(verifier: string): Promise<string> {
  // Tenta usar crypto.subtle se disponível (HTTPS ou localhost)
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const data = new TextEncoder().encode(verifier);
      const digest = await crypto.subtle.digest('SHA-256', data);
      return base64url(digest);
    } catch (err) {
      console.warn('crypto.subtle.digest falhou, usando fallback:', err);
    }
  }

  // Fallback: usa o próprio verifier como challenge (plain method)
  // ⚠️ APENAS PARA DESENVOLVIMENTO
  console.warn('⚠️ PKCE usando método "plain" - certifique-se de que o IAM aceita isso em dev');
  return base64url(verifier);
}

