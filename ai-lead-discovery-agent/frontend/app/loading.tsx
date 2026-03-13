import { Zap } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex-1 min-h-screen flex items-center justify-center bg-transparent">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-brand-500 blur-xl opacity-20 animate-pulse"></div>
          <Zap className="w-10 h-10 text-brand-500 animate-bounce" />
        </div>
        <p className="text-sm font-medium text-slate-400 animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}
