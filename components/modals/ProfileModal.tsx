"use client";
import { useEffect, useState } from "react";

const ProfileModal = ({ userId, onClose }: { userId: string | null; onClose: () => void }) => {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        try {
          const res = await fetch('/api/getUserById', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: userId }),
          });
          const data = await res.json();
          setProfile(data);
        } catch (err) {
          console.error("Failed to fetch user:", err);
        }
      }
    };

    fetchUser();
  }, [userId]);


  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors"
        >
          ✕
        </button>
        
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">User Profile</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">ID</p>
              <p className="text-lg text-gray-900 font-semibold">
                {userId || '-'}
              </p>
              <p className="text-xs font-medium text-gray-500 mb-1">Name</p>
              <p className="text-lg text-gray-900 font-semibold">
                {profile?.name || '-'}
              </p>
              <p className="text-xs font-medium text-gray-500 mb-1">Email</p>
              <p className="text-lg text-gray-900 font-semibold">
                {profile?.email || '-'}
              </p>
              <p className="text-xs font-medium text-gray-500 mb-1">Role</p>
              <p className="text-lg text-gray-900 font-semibold">
                {profile?.role || '-'}
              </p>
  
            </div>

            {/* Field lainnya dengan pola yang sama */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal