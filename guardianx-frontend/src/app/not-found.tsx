import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="min-h-[60vh] flex flex-col justify-center items-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">404 - Not Found</h2>
        <p className="text-gray-600 mb-8">The resource you&apos;re looking for doesn&apos;t exist.</p>
        <Link
          href="/"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}