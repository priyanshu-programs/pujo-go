'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import Link from 'next/link';

function JoinContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const teamName = searchParams.get('name');

  // Automatically try to open the app (if they somehow reached this page but have the app)
  // or redirect to Play Store if they don't.
  useEffect(() => {
    // A simple timer to fallback to Play Store if the app doesn't open.
    const timer = setTimeout(() => {
      window.location.href = 'https://play.google.com/store/apps/details?id=app.asur.slayers';
    }, 2500);

    // Try to open the app via custom scheme as a fallback
    if (code) {
      window.location.href = `pujoapp://team/join?code=${code}&name=${teamName || ''}`;
    }

    return () => clearTimeout(timer);
  }, [code, teamName]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900 p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
        <div className="w-20 h-20 bg-red-600 rounded-full mx-auto flex items-center justify-center">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        
        <div>
          <h1 className="text-2xl font-bold mb-2">You're Invited!</h1>
          {teamName ? (
            <p className="text-gray-600">
              You've been invited to join team <span className="font-semibold text-gray-900">"{teamName}"</span> on PujoGo.
            </p>
          ) : (
            <p className="text-gray-600">
              You've been invited to join a team on PujoGo.
            </p>
          )}
        </div>

        <div className="pt-4 space-y-4">
          <p className="text-sm text-gray-500">Redirecting you to the app...</p>
          
          <a
            href="https://play.google.com/store/apps/details?id=app.asur.slayers"
            className="block w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors"
          >
            Download PujoGo
          </a>
        </div>
      </div>
    </div>
  );
}

export default function JoinTeamPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Loading...</div>}>
      <JoinContent />
    </Suspense>
  );
}
