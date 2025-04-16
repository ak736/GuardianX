import Link from 'next/link';
import PageLayout from '@/components/ui/PageLayout';

export default function NotFound() {
  return (
    <PageLayout>
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
    </PageLayout>
  );
}