"use client";

import Link from 'next/link';
import { BookOpen, PenTool, Headphones, Mic, CheckCircle2 } from 'lucide-react';

const IELTS_DATA = [
  {
    id: 18,
    title: "Cambridge IELTS 18",
    pdfLink: "https://www.ketabane.org/file/attach/blog_uploads/2023/07/Cambridge-IELTS-18-Academic.pdf",
    tests: [
      {
        id: "18.1",
        name: "Test 1",
        sections: [
          { type: "Reading", path: "/test/18.1/reading", available: true, icon: BookOpen },
          { type: "Writing", path: "/test/18.1/writing", available: true, icon: PenTool },
          { type: "Listening", path: "/test/18.1/listening", available: false, icon: Headphones },
          { type: "Speaking", path: "/test/18.1/speaking", available: false, icon: Mic },
        ]
      },
      {
        id: "18.2",
        name: "Test 2",
        sections: [
          { type: "Reading", path: "/test/18.2/reading", available: true, icon: BookOpen },
          { type: "Writing", path: "/test/18.2/writing", available: true, icon: PenTool },
          { type: "Listening", path: "/test/18.2/listening", available: false, icon: Headphones },
          { type: "Speaking", path: "/test/18.2/speaking", available: false, icon: Mic },
        ]
      },
      {
        id: "18.3",
        name: "Test 3",
        sections: [
          { type: "Reading", path: "/test/18.3/reading", available: true, icon: BookOpen },
          { type: "Writing", path: "/test/18.3/writing", available: true, icon: PenTool },
          { type: "Listening", path: "/test/18.3/listening", available: false, icon: Headphones },
          { type: "Speaking", path: "/test/18.3/speaking", available: false, icon: Mic },
        ]
      },
      {
        id: "18.4",
        name: "Test 4",
        sections: [
          { type: "Reading", path: "/test/18.4/reading", available: true, icon: BookOpen },
          { type: "Writing", path: "/test/18.4/writing", available: true, icon: PenTool },
          { type: "Listening", path: "/test/18.4/listening", available: false, icon: Headphones },
          { type: "Speaking", path: "/test/18.4/speaking", available: false, icon: Mic },
        ]
      },
    ]
  },
  {
    id: 17,
    title: "Cambridge IELTS 17",
    pdfLink: "https://ia601501.us.archive.org/2/items/cambridge-17/Cambridge%2017_text.pdf",
    tests: [
      {
        id: "17.1",
        name: "Test 1",
        sections: [
          { type: "Reading", path: "/test/17.1/reading", available: true, icon: BookOpen },
          { type: "Writing", path: "/test/17.1/writing", available: true, icon: PenTool },
          { type: "Listening", path: "/test/17.1/listening", available: false, icon: Headphones },
          { type: "Speaking", path: "/test/17.1/speaking", available: false, icon: Mic },
        ]
      },
      {
        id: "17.2",
        name: "Test 2",
        sections: [
          { type: "Reading", path: "/test/17.2/reading", available: true, icon: BookOpen },
          { type: "Writing", path: "/test/17.2/writing", available: true, icon: PenTool },
          { type: "Listening", path: "/test/17.2/listening", available: false, icon: Headphones },
          { type: "Speaking", path: "/test/17.2/speaking", available: false, icon: Mic },
        ]
      },
      {
        id: "17.3",
        name: "Test 3",
        sections: [
          { type: "Reading", path: "/test/17.3/reading", available: false, icon: BookOpen },
          { type: "Writing", path: "/test/17.3/writing", available: true, icon: PenTool },
          { type: "Listening", path: "/test/17.3/listening", available: false, icon: Headphones },
          { type: "Speaking", path: "/test/17.3/speaking", available: false, icon: Mic },
        ]
      },
      {
        id: "17.4",
        name: "Test 4",
        sections: [
          { type: "Reading", path: "/test/17.4/reading", available: false, icon: BookOpen },
          { type: "Writing", path: "/test/17.4/writing", available: true, icon: PenTool },
          { type: "Listening", path: "/test/17.4/listening", available: false, icon: Headphones },
          { type: "Speaking", path: "/test/17.4/speaking", available: false, icon: Mic },
        ]
      },
    ]
  }
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            IELTS Practice Pro
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Master your skills with authentic Cambridge practice tests.
          </p>
        </header>

        <div className="space-y-16">
          {IELTS_DATA.map((book) => (
            <section key={book.id} className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-6 border-b border-slate-100">
                <div>
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight">{book.title}</h2>
                  <p className="text-slate-500 mt-2 font-medium">Complete practice tests from the official Cambridge book</p>
                </div>
                <a 
                  href={book.pdfLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="mt-4 sm:mt-0 inline-flex items-center gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold py-2.5 px-5 rounded-xl transition-colors"
                >
                  <BookOpen className="w-5 h-5" />
                  View Original PDF
                </a>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {book.tests.map((test) => (
                  <div key={test.id} className="bg-slate-50/50 rounded-2xl p-6 border border-slate-200/60 hover:border-slate-300 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-slate-800">
                        {test.name}
                        <span className="ml-2 text-sm font-semibold text-slate-400">({test.id})</span>
                      </h3>
                    </div>
                    
                    <div className="space-y-3">
                      {test.sections.map((section) => {
                        const Icon = section.icon;
                        if (section.available) {
                          return (
                            <Link 
                              key={section.type} 
                              href={section.path}
                              className="group flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-[0_4px_12px_rgb(59,130,246,0.1)] transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                  <Icon className="w-4 h-4" />
                                </div>
                                <span className="font-semibold text-slate-700 group-hover:text-blue-700 transition-colors">{section.type}</span>
                              </div>
                              <CheckCircle2 className="w-5 h-5 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                          );
                        } else {
                          return (
                            <div key={section.type} className="flex items-center justify-between bg-slate-100/50 p-3.5 rounded-xl border border-slate-200 border-dashed opacity-60 grayscale cursor-not-allowed">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-slate-200 text-slate-500">
                                  <Icon className="w-4 h-4" />
                                </div>
                                <span className="font-semibold text-slate-500">{section.type}</span>
                              </div>
                              <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 bg-slate-200 px-2 py-1 rounded-md">Coming Soon</span>
                            </div>
                          );
                        }
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
