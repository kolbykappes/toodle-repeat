'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function OAuthCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authorization...');

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      setStatus('error');
      setMessage(`Authorization failed: ${error}`);
      return;
    }

    if (!code) {
      setStatus('error');
      setMessage('No authorization code received');
      return;
    }

    // Exchange code for tokens
    exchangeCodeForTokens(code);
  }, [searchParams]);

  const exchangeCodeForTokens = async (code: string) => {
    try {
      const res = await fetch('/api/oauth/exchange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to exchange token');
      }

      setStatus('success');
      setMessage('Successfully connected to Toodledo! Redirecting...');

      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  return (
    <div style={{
      padding: '40px',
      maxWidth: '600px',
      margin: '100px auto',
      textAlign: 'center',
      fontFamily: 'monospace'
    }}>
      {status === 'loading' && (
        <div>
          <h1>Connecting to Toodledo...</h1>
          <p>{message}</p>
          <div style={{ fontSize: '40px', marginTop: '20px' }}>⏳</div>
        </div>
      )}

      {status === 'success' && (
        <div>
          <h1 style={{ color: '#28a745' }}>Success!</h1>
          <p>{message}</p>
          <div style={{ fontSize: '40px', marginTop: '20px' }}>✓</div>
        </div>
      )}

      {status === 'error' && (
        <div>
          <h1 style={{ color: '#dc3545' }}>Error</h1>
          <p>{message}</p>
          <div style={{ fontSize: '40px', marginTop: '20px' }}>✗</div>
          <button
            onClick={() => router.push('/')}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Back to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}
