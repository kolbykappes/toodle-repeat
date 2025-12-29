'use client';

import { useState, useEffect } from 'react';
import { Config } from '@/types';

export default function Dashboard() {
  const [config, setConfig] = useState<Config>({ tasks: [] });
  const [configText, setConfigText] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const res = await fetch('/api/config');
      const data = await res.json();
      setConfig(data);
      setConfigText(JSON.stringify(data, null, 2));
    } catch (error) {
      setMessage('Error loading config: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const saveConfig = async () => {
    try {
      setLoading(true);
      const parsed = JSON.parse(configText);
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      });
      const data = await res.json();
      setMessage(data.message || 'Config saved!');
      await loadConfig();
    } catch (error) {
      setMessage('Error saving config: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const triggerTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/trigger', { method: 'POST' });
      const data = await res.json();
      setMessage(JSON.stringify(data, null, 2));
    } catch (error) {
      setMessage('Error triggering tasks: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'monospace' }}>
      <h1>Toodledo Recurring Tasks</h1>

      <div style={{ marginBottom: '30px' }}>
        <h2>Current Config</h2>
        <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
          {JSON.stringify(config, null, 2)}
        </pre>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>Edit Config</h2>
        <textarea
          value={configText}
          onChange={(e) => setConfigText(e.target.value)}
          style={{
            width: '100%',
            height: '300px',
            fontFamily: 'monospace',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
        <button
          onClick={saveConfig}
          disabled={loading}
          style={{
            marginTop: '10px',
            padding: '10px 20px',
            background: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Saving...' : 'Save Config'}
        </button>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>Test</h2>
        <button
          onClick={triggerTasks}
          disabled={loading}
          style={{
            padding: '10px 20px',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Running...' : 'Trigger Tasks Now'}
        </button>
      </div>

      {message && (
        <div style={{ marginTop: '20px' }}>
          <h2>Result</h2>
          <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
            {message}
          </pre>
        </div>
      )}
    </div>
  );
}
