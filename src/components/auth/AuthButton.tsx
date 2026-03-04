'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser()
      .then(({ data: { user } }) => setUser(user))
      .catch((err) => console.error('AuthButton getUser failed:', err))
      .finally(() => setLoading(false));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return null;

  if (user) {
    return (
      <Link
        href="/my-fortune"
        className="text-sm text-cookie-gold hover:text-gold-sparkle transition-colors font-medium"
      >
        나의 운세
      </Link>
    );
  }

  return (
    <Link
      href="/login"
      className="text-sm text-text-secondary hover:text-cookie-gold transition-colors"
    >
      로그인
    </Link>
  );
}
