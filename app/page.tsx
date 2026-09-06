"use client";

import Link from 'next/link';

export default function Dashboard() {
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

        {/* Tests Grid */}
        <section>
          <h2 className="mb-6 text-2xl font-bold text-slate-800">Available Tests</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/test/18.1/reading" className="block rounded-2xl bg-white p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Reading 18.1</h3>
              <p className="text-sm text-slate-500">Practice your reading skills with this complete test.</p>
              <div className="mt-4 flex items-center text-blue-600 font-semibold text-sm">
                Start Test <span className="ml-2">→</span>
              </div>
            </Link>
            <Link href="/test/230/reading" className="block rounded-2xl bg-white p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-slate-900 mb-2">IELTS Reading Test 17.1</h3>
              <p className="text-sm text-slate-500">Practice your reading skills with this complete test.</p>
              <div className="mt-4 flex items-center text-blue-600 font-semibold text-sm">
                Start Test <span className="ml-2">→</span>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
