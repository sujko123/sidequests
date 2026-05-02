'use client';

import { useState } from 'react';
import { createClient } from '@/app/lib/supabase/client';

export default function Signout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignout = async () => {
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    window.location.href = '/auth/login';
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleSignout}
        disabled={loading}
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Signing out...' : 'Sign out'}
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
