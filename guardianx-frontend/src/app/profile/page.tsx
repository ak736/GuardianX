import UserProfile from '@/components/wallet/UserProfile';

export default function ProfilePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="pb-5 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Your Profile</h3>
        <p className="mt-2 max-w-4xl text-sm text-gray-500">
          Manage your account, virtual sensors, and token rewards.
        </p>
      </div>
      
      <div className="mt-6">
        <UserProfile />
      </div>
    </div>
  );
}