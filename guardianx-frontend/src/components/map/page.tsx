// In src/app/map/page.tsx
import PageLayout from '@/components/ui/PageLayout';
import MapComponent from '@/components/map/MapComponent';

export default function MapPage() {
  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Infrastructure Map</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              View critical infrastructure and place virtual sensors to help protect it.
            </p>
          </div>
          
          <div className="border-t border-gray-200">
            <MapComponent />
          </div>
        </div>
        
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Virtual Sensors</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Help protect critical infrastructure by placing virtual sensors nearby.
            </p>
          </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-700">How It Works</h4>
                <p className="mt-2 text-sm text-gray-600">
                  Place virtual sensors near infrastructure to monitor and detect anomalies. The AI system analyzes data to spot unusual patterns that might indicate problems.
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-700">Earning Rewards</h4>
                <p className="mt-2 text-sm text-gray-600">
                  You&apos;ll earn GUARD tokens when your sensors help detect and prevent infrastructure failures. The more effective your sensor placement, the more tokens you earn.
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-700">Placement Tips</h4>
                <p className="mt-2 text-sm text-gray-600">
                  Place sensors at strategic locations that cover multiple infrastructure elements. Consider areas that might be more vulnerable to failures or have less coverage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}