"use client";

import { useEffect, useState } from 'react';
import TestCard from '@/components/TestCard';
import { Plus, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function Dashboard() {
  const [tests, setTests] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState('');
  const [scraping, setScraping] = useState(false);
  const [error, setError] = useState('');

  const fetchTests = async () => {
    try {
      const res = await axios.get('/api/tests');
      setTests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
    const storedHistory = localStorage.getItem('ielts_history');
    if (storedHistory) {
      try {
        setHistory(JSON.parse(storedHistory).history || []);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleAddTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setScraping(true);
    setError('');
    
    try {
      await axios.post('/api/scrape', { url });
      setUrl('');
      await fetchTests(); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add test');
    } finally {
      setScraping(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            IELTS Reading Pro
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Master your reading skills with authentic practice tests.
          </p>
        </header>

        {/* Add New Test Section */}
        <section className="mb-12 rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">Add a New Practice Test</h2>
          <form onSubmit={handleAddTest} className="flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              required
              placeholder="Paste IELTS reading test URL here (e.g., practicepteonline.com)"
              className="flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={scraping}
            />
            <button
              type="submit"
              disabled={scraping || !url}
              className="flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {scraping ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Scraping...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-5 w-5" />
                  Add Test
                </>
              )}
            </button>
          </form>
          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
        </section>

        {/* Tests Grid */}
        <section>
          <h2 className="mb-6 text-2xl font-bold text-slate-800">Available Tests</h2>
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : tests.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-slate-200 p-12 text-center">
              <p className="text-slate-500">No tests available. Add one above to get started!</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tests.map((test) => {
                const testHistory = history.find((h) => h.testId === test.id);
                return (
                  <TestCard 
                    key={test.id} 
                    id={test.id} 
                    title={test.title} 
                    sourceUrl={test.sourceUrl}
                    history={testHistory}
                  />
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
