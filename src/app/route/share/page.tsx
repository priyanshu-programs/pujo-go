'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import Link from 'next/link';

function RouteShareContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || searchParams.get('routeId');
  const routeName = searchParams.get('name');

  const appSchemeUrl = id
    ? `pujoapp://route/share?id=${encodeURIComponent(id)}&name=${encodeURIComponent(routeName || '')}`
    : 'pujoapp://';

  // Automatically try to open the app (if they have it installed)
  // or redirect to Play Store fallback if they don't.
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = 'https://play.google.com/store/apps/details?id=app.asur.slayers';
    }, 2500);

    if (id) {
      window.location.href = appSchemeUrl;
    }

    return () => clearTimeout(timer);
  }, [id, appSchemeUrl]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl p-8 text-center space-y-6">
        <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-full mx-auto flex items-center justify-center">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A2 2 0 013 15.488V5.132a2 2 0 011.553-1.954l6-1.5a2 2 0 01.894 0l6 1.5A2 2 0 0119 5.132v10.356a2 2 0 01-1.106 1.788L13 20m-4 0V9m4 11V9m-4 0l4-2m0 0l4 2" />
          </svg>
        </div>

        <div>
          <span className="inline-block px-3 py-1 bg-red-600/20 text-red-400 text-xs font-semibold uppercase tracking-wider rounded-full mb-3">
            Durga Puja Route
          </span>
          <h1 className="text-2xl font-bold mb-2">Explore Itinerary</h1>
          {routeName ? (
            <p className="text-gray-300 text-base">
              You've been invited to explore <span className="font-semibold text-white">"{routeName}"</span> on PujoGo.
            </p>
          ) : (
            <p className="text-gray-400 text-base">
              You've been invited to explore a curated Durga Puja route on PujoGo.
            </p>
          )}
        </div>

        <div className="pt-2 space-y-3">
          <p className="text-sm text-gray-500">Redirecting to the PujoGo app...</p>

          <a
            href={appSchemeUrl}
            className="block w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-semibold rounded-xl transition-all shadow-lg shadow-red-600/30"
          >
            Open in PujoGo App
          </a>

          <a
            href="https://play.google.com/store/apps/details?id=app.asur.slayers"
            className="block w-full py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-medium rounded-xl transition-colors border border-zinc-700"
          >
            Get on Google Play Store
          </a>
        </div>

        <div className="pt-2">
          <Link href="/" className="text-xs text-gray-500 hover:text-gray-400 transition-colors">
            Learn more at pujogo.in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RouteSharePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black text-gray-500">Loading...</div>}>
      <RouteShareContent />
    </Suspense>
  );
}
