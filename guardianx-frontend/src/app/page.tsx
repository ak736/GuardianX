import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center sm:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              <span className="block">Protect Critical Infrastructure</span>
              <span className="block mt-2">with GuardianX</span>
            </h1>
            <p className="mt-6 max-w-lg mx-auto sm:mx-0 text-xl sm:max-w-3xl">
              A decentralized platform revolutionizing critical infrastructure protection through AI, blockchain technology, and community participation.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
              <Link 
                href="/map" 
                className="rounded-md shadow px-8 py-3 bg-white text-blue-700 font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white"
              >
                Explore Map
              </Link>
              <Link 
                href="/dashboard" 
                className="rounded-md px-8 py-3 bg-blue-900 text-white font-medium hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            How GuardianX Works
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
            A community-powered approach to protecting the infrastructure we all depend on.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="w-12 h-12 rounded-md bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
                1
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">The Map</h3>
              <p className="mt-2 text-base text-gray-500">
                When you open the website, you see a map showing important infrastructure near you with color-coded status indicators.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="w-12 h-12 rounded-md bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
                2
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Virtual Sensors</h3>
              <p className="mt-2 text-base text-gray-500">
                Place virtual sensors on the map near infrastructure you want to help protect. Our AI system uses these to detect anomalies.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="w-12 h-12 rounded-md bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
                3
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Rewards</h3>
              <p className="mt-2 text-base text-gray-500">
                Earn GUARD tokens as rewards for helping protect infrastructure. The more your sensors help, the more tokens you earn.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Why It Matters Section */}
      <div className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Why It Matters
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
              GuardianX creates a more resilient and secure infrastructure for everyone.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900">Prevents Outages</h3>
                <p className="mt-2 text-base text-gray-500">
                  Catches problems before they cause power outages, water main breaks, or internet failures.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900">Community Powered</h3>
                <p className="mt-2 text-base text-gray-500">
                  Instead of relying on just a few monitoring points, we can have thousands of eyes watching our important systems.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900">Creates Incentives</h3>
                <p className="mt-2 text-base text-gray-500">
                  People earn rewards for helping protect infrastructure everyone depends on.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900">Saves Money</h3>
                <p className="mt-2 text-base text-gray-500">
                  Fixing small problems is much cheaper than fixing big failures. Early detection saves millions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Ready to help protect critical infrastructure?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-blue-100">
            Join the GuardianX community today and start earning rewards.
          </p>
          <div className="mt-8">
            <Link 
              href="/map" 
              className="inline-block rounded-md border border-transparent px-8 py-3 bg-white text-blue-700 font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}