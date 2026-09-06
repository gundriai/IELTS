import Link from 'next/link';
import { CheckCircle2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TestCardProps {
  id: string;
  title: string;
  sourceUrl?: string;
  history?: {
    date: string;
    score: number;
    total: number;
  };
}

export default function TestCard({ id, title, sourceUrl, history }: TestCardProps) {
  return (
    <Link href={`/test/${id}`}>
      <div className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md border border-slate-100 h-full",
        history ? "border-green-100 bg-green-50/30" : ""
      )}>
        <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-slate-50 opacity-50 transition-transform group-hover:scale-110" />
        
        <div className="relative z-10">
          <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
          {sourceUrl && (
            <p className="text-sm text-slate-500 line-clamp-1 mb-4">{sourceUrl}</p>
          )}
        </div>

        <div className="relative z-10 mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
          {history ? (
            <>
              <div className="flex items-center text-green-600">
                <CheckCircle2 className="mr-1.5 h-4 w-4" />
                <span className="text-sm font-medium">Completed</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-700">Score: {history.score}/{history.total}</p>
                <p className="text-xs text-slate-400">{new Date(history.date).toLocaleDateString()}</p>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center text-slate-400">
                <Clock className="mr-1.5 h-4 w-4" />
                <span className="text-sm font-medium">60 mins</span>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 transition-colors group-hover:bg-blue-100">
                Start Test
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
