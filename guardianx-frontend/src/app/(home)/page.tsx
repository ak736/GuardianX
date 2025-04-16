import Link from 'next/link';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Protect Critical Infrastructure</span>
              <span className="block text-blue-600">with GuardianX</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              A decentralized platform revolutionizing critical infrastructure protection through AI, blockchain technology, and community participation.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link href="/map" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                  Explore Map
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link href="/dashboard" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10">
                  View Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 px-4 py-8 sm:px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">The Map</h3>
              <p className="mt-2 text-sm text-gray-500">
                When you open the website, you see a map showing important infrastructure near you with color-coded status indicators.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Virtual Sensors</h3>
              <p className="mt-2 text-sm text-gray-500">
                Place virtual sensors on the map near infrastructure you want to help protect.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900">Rewards</h3>
              <p className="mt-2 text-sm text-gray-500">
                People who help by placing virtual sensors earn digital tokens as a reward.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}