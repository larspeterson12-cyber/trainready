'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/shared/logo';

export default function RegisterPage() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password.length < 6) {
      setError('Wachtwoord moet minimaal 6 tekens zijn.');
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
      },
    });

    if (error) {
      console.error('Supabase error:', error);
      setError(`Registratie mislukt: ${error.message}`);
      setLoading(false);
      return;
    }

    router.push('/onboarding');
    router.refresh();
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex">
            <Logo size={64} />
          </div>
          <h1 className="text-2xl font-bold">
            Account aanmaken
          </h1>
          <p className="mt-1 text-sm text-[--color-text-secondary]">
            Train hard, recover smart.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Naam"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            className="rounded-xl border border-[--color-border] bg-[--color-surface] px-4 py-3 text-sm text-[--color-text] placeholder:text-[--color-text-muted] focus:border-[--color-accent] focus:outline-none"
          />
          <input
            type="email"
            placeholder="E-mailadres"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-xl border border-[--color-border] bg-[--color-surface] px-4 py-3 text-sm text-[--color-text] placeholder:text-[--color-text-muted] focus:border-[--color-accent] focus:outline-none"
          />
          <input
            type="password"
            placeholder="Wachtwoord (min. 6 tekens)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="rounded-xl border border-[--color-border] bg-[--color-surface] px-4 py-3 text-sm text-[--color-text] placeholder:text-[--color-text-muted] focus:border-[--color-accent] focus:outline-none"
          />

          {error && <p className="text-xs text-[--color-red]">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-[--color-accent] px-4 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Registreer
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-[--color-text-secondary]">
          Al een account?{' '}
          <Link href="/login" className="font-medium text-[--color-accent] hover:underline">
            Inloggen
          </Link>
        </p>
      </div>
    </div>
  );
}
