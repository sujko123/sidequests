'use client';

import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import { createClient } from '@/app/lib/supabase/client';

async function updatePassword(newPassword: string) {
  const supabase = createClient();

  return supabase.auth.updateUser({
    password: newPassword,
  });
}

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [canUpdatePassword, setCanUpdatePassword] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data }) => {
      setCanUpdatePassword(Boolean(data.session));
      setCheckingSession(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) {
        setCanUpdatePassword(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess(false);

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    const { error } = await updatePassword(password);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setPassword('');
      setConfirmPassword('');
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-violet-100 flex items-center justify-center p-4">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-slate-900 text-white shadow-md">
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-950">Choose a new password</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Enter a new password for your account.
          </p>
        </div>

        {!checkingSession && !canUpdatePassword && (
          <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Open this page from the password reset email link to update your password.
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-slate-700">
              New password
            </label>
            <div className="relative mt-2">
              <input
                id="new-password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 pl-11 text-slate-950 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                placeholder="Enter new password"
              />
              <svg className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.567 3-3.5S13.657 4 12 4 9 5.567 9 7.5 10.343 11 12 11zm-7 9a7 7 0 0114 0" />
              </svg>
            </div>
          </div>

          <div>
            <label htmlFor="confirm-new-password" className="block text-sm font-medium text-slate-700">
              Confirm new password
            </label>
            <div className="relative mt-2">
              <input
                id="confirm-new-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 pl-11 text-slate-950 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                placeholder="Confirm new password"
              />
              <svg className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5 2a8 8 0 11-16 0 8 8 0 0116 0z" />
              </svg>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              Password updated successfully. You can now sign in with your new password.
            </div>
          )}

          <button
            type="submit"
            disabled={loading || checkingSession || !canUpdatePassword}
            className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Updating password...' : 'Update password'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-600">
          Back to{' '}
          <Link href="/auth/login" className="font-medium text-sky-700 hover:text-sky-600">
            login
          </Link>
        </p>
      </section>
    </main>
  );
}
