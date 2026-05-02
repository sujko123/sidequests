'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/app/lib/supabase/client';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess(false);

    if (!isValidEmail(email)) {
      setError('Enter a valid email address.');
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-violet-100 flex items-center justify-center p-4">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-slate-900 text-white shadow-md">
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-18 8h18a2 2 0 002-2V8a2 2 0 00-2-2H3a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-950">Reset your password</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Enter your email and we will send you a secure reset link.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="reset-email" className="block text-sm font-medium text-slate-700">
              Email address
            </label>
            <div className="relative mt-2">
              <input
                id="reset-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 pl-11 text-slate-950 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                placeholder="you@example.com"
              />
              <svg className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206A8.959 8.959 0 0112 21" />
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
              Check your inbox for the password reset link.
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Sending reset link...' : 'Send reset link'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-600">
          Remember your password?{' '}
          <Link href="/auth/login" className="font-medium text-sky-700 hover:text-sky-600">
            Back to login
          </Link>
        </p>
      </section>
    </main>
  );
}
