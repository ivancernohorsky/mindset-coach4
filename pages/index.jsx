import { useState } from 'react';
import Head from 'next/head';

const topics = [
  { key: 'emocni_inteligence', label: 'Emoční inteligence' },
  { key: 'komunikace', label: 'Komunikace a naslouchání' },
  { key: 'uvod_do_koucinku', label: 'Základy koučinku' },
  { key: 'sebevedomi', label: 'Sebevědomí a mindset' },
  { key: 'praxe_a_reflexe', label: 'Praxe a reflexe' }
];

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [topic, setTopic] = useState(topics[0].key);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input) return;
    setLoading(true);
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, topic }),
      });

      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      console.error("Chyba při načítání:", err);
      setMessages([...newMessages, { role: 'assistant', content: 'Promiň, odpověď se nepodařilo načíst.' }]);
    }

    setInput('');
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Mindset Coach GPT</title>
      </Head>
      <main style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'sans-serif' }}>
        <h1>Mindset Coach GPT</h1>
        <select value={topic} onChange={e => setTopic(e.target.value)} style={{ marginBottom: '1rem' }}>
          {topics.map(t => (
            <option key={t.key} value={t.key}>{t.label}</option>
          ))}
        </select>
        <div style={{ marginBottom: '1rem' }}>
          {messages.map((m, i) => (
            <div key={i} style={{ textAlign: m.role === 'user' ? 'right' : 'left', margin: '0.5rem 0' }}>
              <span style={{ display: 'inline-block', padding: '0.5rem', background: '#f0f0f0', borderRadius: 4 }}>{m.content}</span>
            </div>
          ))}
        </div>
        <textarea value={input} onChange={e => setInput(e.target.value)} rows={3} style={{ width: '100%' }} />
        <button onClick={handleSubmit} disabled={loading} style={{ marginTop: '1rem' }}>
          {loading ? 'Odpovídám...' : 'Odeslat'}
        </button>
      </main>
    </>
  );
}
