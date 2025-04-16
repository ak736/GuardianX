import PageLayout from '@/components/ui/PageLayout';
import UserProfile from '@/components/wallet/UserProfile';

export default function ProfilePage() {
  return (
    <PageLayout>
      <div className="pb-5 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Your Profile</h3>
        <p className="mt-2 max-w-4xl text-sm text-gray-500">
          Manage your account, virtual sensors, and token rewards.
        </p>
      </div>
      
      <div className="mt-6">
        <UserProfile />
      </div>
    </PageLayout>
  );
}