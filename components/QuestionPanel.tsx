"use client";

interface Question {
  id: string;
  passageId: string;
  type: string;
  text: string;
  options?: string[];
}

interface QuestionPanelProps {
  questions: Question[];
  userAnswers: Record<string, string>;
  onAnswerChange: (questionId: string, answer: string) => void;
  onSubmit: () => void;
  activePassageId?: string;
}

export default function QuestionPanel({ questions, userAnswers, onAnswerChange, onSubmit, activePassageId }: QuestionPanelProps) {
  if (!questions || questions.length === 0) return <div>No questions found.</div>;

  const filteredQuestions = activePassageId 
    ? questions.filter(q => q.passageId === activePassageId)
    : questions;

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <div className="flex-1 overflow-y-auto p-8">
        <h2 className="mb-6 text-2xl font-bold text-slate-800">Questions</h2>
        <div className="space-y-8">
          {filteredQuestions.map((q, idx) => (
            <div key={q.id} className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
              <div className="mb-4 flex items-start">
                <span className="mr-3 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                  {idx + 1}
                </span>
                <h3 className="text-lg font-medium text-slate-800">{q.text}</h3>
              </div>

              <div className="ml-10">
                {q.type === 'multiple-choice' && q.options ? (
                  <div className="space-y-3">
                    {q.options.map((opt, i) => (
                      <label key={i} className="flex cursor-pointer items-center space-x-3 rounded-lg border border-slate-100 p-3 hover:bg-slate-50 transition-colors">
                        <input
                          type="radio"
                          name={q.id}
                          value={opt}
                          checked={userAnswers[q.id] === opt}
                          onChange={(e) => onAnswerChange(q.id, e.target.value)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                        />
                        <span className="text-slate-700">{opt}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder="Type your answer here..."
                    value={userAnswers[q.id] || ''}
                    onChange={(e) => onAnswerChange(q.id, e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer / Submit Button */}
      <div className="border-t border-slate-200 bg-white p-6 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)]">
        <button
          onClick={onSubmit}
          className="w-full rounded-xl bg-blue-600 py-4 text-lg font-bold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md active:scale-[0.98]"
        >
          Submit Test
        </button>
      </div>
    </div>
  );
}
