import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { createClient } from '@/lib/supabase/server';
import { isSubscribed, ensureProfile } from '@/lib/subscription';
import MyFortuneDashboard from './client';

export const metadata: Metadata = {
  title: '나의 맞춤 운세',
  description: '매일 나만을 위한 맞춤 운세를 확인하세요.',
  robots: { index: false, follow: false },
};

export default async function MyFortunePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/my-fortune');
  }

  await ensureProfile(supabase, user.id);

  const subscribed = await isSubscribed(supabase, user.id);
  if (!subscribed) {
    redirect('/premium');
  }

  // Check if user has active tracks
  const { data: profile } = await supabase
    .from('profiles')
    .select('active_tracks')
    .eq('id', user.id)
    .single();

  const activeTracks: string[] = profile?.active_tracks || [];

  // Check for existing charts
  const { data: charts } = await supabase
    .from('user_charts')
    .select('track')
    .eq('user_id', user.id);

  const availableTracks = (charts || []).map((c) => c.track as string);

  // Check if onboarding is complete
  const { count: contextCount } = await supabase
    .from('user_context')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('context_type', 'onboarding');

  const hasOnboarded = (contextCount || 0) > 0;

  return (
    <div className="min-h-dvh flex flex-col star-field">
      <Header />
      <main className="flex-1 pt-14 pb-8 px-4">
        <MyFortuneDashboard
          userId={user.id}
          activeTracks={activeTracks}
          availableTracks={availableTracks}
          hasOnboarded={hasOnboarded}
        />
      </main>
      <Footer />
    </div>
  );
}
