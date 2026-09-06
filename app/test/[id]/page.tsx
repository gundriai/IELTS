"use client";

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import PassageViewer from '@/components/PassageViewer';
import QuestionPanel from '@/components/QuestionPanel';
import { Timer, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

export default function TestInterface({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [test, setTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes
  
  // Answers State
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  
  // Results State
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // Tab State
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await axios.get('/api/tests');
        const foundTest = res.data.find((t: any) => t.id === id);
        if (foundTest) {
          setTest(foundTest);
        } else {
          router.push('/');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [id, router]);

  // Timer Countdown
  useEffect(() => {
    if (loading || showResults || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [loading, showResults, timeLeft]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = () => {
    if (!test) return;

    let calculatedScore = 0;
    test.questions.forEach((q: any) => {
      const userAnswer = (userAnswers[q.id] || '').trim().toLowerCase();
      const correctAnswer = (q.answer || '').trim().toLowerCase();
      if (userAnswer === correctAnswer) {
        calculatedScore += 1;
      }
    });

    setScore(calculatedScore);
    setShowResults(true);

    // Save to localStorage
    const storedHistory = localStorage.getItem('ielts_history');
    const historyObj = storedHistory ? JSON.parse(storedHistory) : { history: [] };
    
    const newEntry = {
      testId: id,
      date: new Date().toISOString(),
      score: calculatedScore,
      total: test.questions.length
    };

    // Replace if exists, else push
    const existingIndex = historyObj.history.findIndex((h: any) => h.testId === id);
    if (existingIndex > -1) {
      historyObj.history[existingIndex] = newEntry;
    } else {
      historyObj.history.push(newEntry);
    }
    
    localStorage.setItem('ielts_history', JSON.stringify(historyObj));
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-lg text-slate-500 animate-pulse">Loading Test...</p>
      </div>
    );
  }

  if (!test) return null;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-100">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
        <div className="flex items-center">
          <Link href="/" className="mr-4 flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </Link>
          <h1 className="text-xl font-bold text-slate-800">{test.title}</h1>
        </div>
        
        <div className={`flex items-center rounded-full px-4 py-1.5 font-bold tracking-wider ${timeLeft < 300 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-700'}`}>
          <Timer className="mr-2 h-5 w-5" />
          {formatTime(timeLeft)}
        </div>
      </header>

      {/* Split Screen Layout */}
      <main className="flex flex-1 overflow-hidden">
        {/* Left Pane: Passages */}
        <section className="w-1/2 border-r border-slate-200 shadow-sm relative z-10">
          <PassageViewer 
            passages={test.passages} 
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </section>
        
        {/* Right Pane: Questions */}
        <section className="w-1/2 relative z-0">
          <QuestionPanel 
            questions={test.questions}
            userAnswers={userAnswers}
            onAnswerChange={handleAnswerChange}
            onSubmit={handleSubmit}
            activePassageId={test.passages[activeTab]?.id}
          />
        </section>
      </main>

      {/* Results Modal */}
      {showResults && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-blue-600 p-8 text-center text-white">
              <h2 className="text-3xl font-extrabold mb-2">Test Completed!</h2>
              <div className="text-6xl font-black tracking-tighter mt-6">
                {score} <span className="text-3xl text-blue-200 font-bold">/ {test.questions.length}</span>
              </div>
            </div>
            
            <div className="overflow-y-auto p-8 bg-slate-50 flex-1">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Answer Review</h3>
              <div className="space-y-4">
                {test.questions.map((q: any, idx: number) => {
                  const uAnswer = (userAnswers[q.id] || '').trim();
                  const cAnswer = (q.answer || '').trim();
                  const isCorrect = uAnswer.toLowerCase() === cAnswer.toLowerCase();
                  
                  return (
                    <div key={q.id} className={`rounded-xl p-4 border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                      <p className="font-medium text-slate-800 mb-2">{idx + 1}. {q.text}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm">
                        <div className="flex items-center">
                          <span className="text-slate-500 w-24">Your Answer:</span>
                          {isCorrect ? (
                            <span className="flex items-center text-green-700 font-semibold"><CheckCircle2 className="w-4 h-4 mr-1"/> {uAnswer || '(blank)'}</span>
                          ) : (
                            <span className="flex items-center text-red-700 font-semibold"><XCircle className="w-4 h-4 mr-1"/> {uAnswer || '(blank)'}</span>
                          )}
                        </div>
                        {!isCorrect && (
                          <div className="flex items-center">
                            <span className="text-slate-500 w-24">Correct Answer:</span>
                            <span className="text-green-700 font-semibold">{cAnswer}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-6 bg-white border-t border-slate-100 text-center">
              <Link href="/">
                <button className="w-full sm:w-auto rounded-xl bg-slate-900 px-8 py-3 font-bold text-white transition-all hover:bg-slate-800 hover:shadow-lg">
                  Return to Dashboard
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
