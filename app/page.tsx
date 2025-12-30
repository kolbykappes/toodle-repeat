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

  const loadExampleConfig = () => {
    const exampleConfig = {
      tasks: [
        {
          title: "Daily standup prep",
          priority: 2,
          context: "Work",
          recurrence: "daily"
        },
        {
          title: "Check email",
          priority: 1,
          context: "Work",
          recurrence: "daily"
        },
        {
          title: "Weekly review",
          priority: 3,
          context: "Personal",
          recurrence: "weekly",
          dayOfWeek: 1
        },
        {
          title: "Plan next week",
          priority: 3,
          context: "Personal",
          recurrence: "weekly",
          dayOfWeek: 0
        }
      ]
    };
    setConfigText(JSON.stringify(exampleConfig, null, 2));
    setMessage('Example config loaded! Edit as needed and click Save Config.');
  };

  const connectToToodledo = () => {
    // Construct OAuth URL
    const clientId = prompt('Enter your Toodledo Client ID:');
    if (!clientId) return;

    const redirectUri = `${window.location.origin}/oauth/callback`;
    const authUrl = `https://api.toodledo.com/3/account/authorize.php?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=basic%20tasks&state=oauth`;

    // Redirect to Toodledo OAuth page
    window.location.href = authUrl;
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'monospace' }}>
      <h1>Toodledo Recurring Tasks</h1>

      <div style={{ marginBottom: '30px', padding: '20px', background: '#e7f3ff', borderRadius: '8px', border: '2px solid #0070f3' }}>
        <h2 style={{ marginTop: 0 }}>Setup</h2>
        <p style={{ margin: '10px 0', fontSize: '14px' }}>
          First time? Click below to connect your Toodledo account. You'll need your Client ID from Toodledo.
        </p>
        <button
          onClick={connectToToodledo}
          style={{
            padding: '12px 24px',
            background: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          Connect to Toodledo
        </button>
        <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#666' }}>
          Make sure TOODLEDO_CLIENT_ID and TOODLEDO_CLIENT_SECRET are set in your environment variables first!
        </p>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>Current Config</h2>
        <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
          {JSON.stringify(config, null, 2)}
        </pre>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2>Edit Config</h2>
        <div style={{ marginBottom: '10px' }}>
          <button
            onClick={loadExampleConfig}
            style={{
              padding: '8px 16px',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Load Example Config
          </button>
          <span style={{ marginLeft: '10px', fontSize: '12px', color: '#666' }}>
            Priority: 0=negative, 1=low, 2=medium, 3=high, 4=top | DayOfWeek: 0=Sun, 1=Mon, ..., 6=Sat
          </span>
        </div>
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
