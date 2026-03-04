import type { SupabaseClient } from '@supabase/supabase-js';

export type SubscriptionTier = 'free' | 'premium';

interface Profile {
  subscription_tier: SubscriptionTier;
  subscription_expires_at: string | null;
  active_tracks: string[];
}

export async function getProfile(supabase: SupabaseClient, userId: string): Promise<Profile | null> {
  const { data } = await supabase
    .from('profiles')
    .select('subscription_tier, subscription_expires_at, active_tracks')
    .eq('id', userId)
    .single();
  return data;
}

export async function isSubscribed(supabase: SupabaseClient, userId: string): Promise<boolean> {
  const profile = await getProfile(supabase, userId);
  if (!profile) return false;
  if (profile.subscription_tier !== 'premium') return false;
  if (profile.subscription_expires_at) {
    return new Date(profile.subscription_expires_at) > new Date();
  }
  return true;
}

export async function getSubscriptionTier(supabase: SupabaseClient, userId: string): Promise<SubscriptionTier> {
  const subscribed = await isSubscribed(supabase, userId);
  return subscribed ? 'premium' : 'free';
}

export async function ensureProfile(supabase: SupabaseClient, userId: string): Promise<void> {
  const { data } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .single();

  if (!data) {
    await supabase.from('profiles').insert({ id: userId });
  }
}
