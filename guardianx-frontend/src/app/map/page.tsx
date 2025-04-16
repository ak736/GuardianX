import MapComponent from '@/components/map/MapComponent';

export default function MapPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-6">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Infrastructure Map
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              View critical infrastructure and place virtual sensors to help
              protect it.
            </p>
          </div>
          
          <div className="border-t border-gray-200">
            <MapComponent />
          </div>
        </div>
        
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Infrastructure Legend
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Color codes and symbols used on the map
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Place Virtual Sensor
            </button>
          </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex items-center">
                <div className="h-4 w-4 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm text-gray-600">Normal Operation</span>
              </div>
              <div className="flex items-center">
                <div className="h-4 w-4 rounded-full bg-yellow-500 mr-2"></div>
                <span className="text-sm text-gray-600">Minor Anomalies</span>
              </div>
              <div className="flex items-center">
                <div className="h-4 w-4 rounded-full bg-red-500 mr-2"></div>
                <span className="text-sm text-gray-600">Critical Issues</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}