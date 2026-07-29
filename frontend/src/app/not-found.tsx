import Link from 'next/link';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[70vh] px-4 text-center">
      <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
        <FileQuestion className="w-10 h-10" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
      <p className="text-gray-500 max-w-md mx-auto mb-8 text-base">
        We couldn't find the page or meeting you were looking for. It might have been deleted, or the link could be incorrect.
      </p>
      <Link 
        href="/"
        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Library
      </Link>
    </div>
  );
}
