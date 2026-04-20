import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export type UserRole = 'subscriber' | 'client' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    let profileSubscription: any;

    async function fetchProfile() {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          setProfile(null);
          setLoading(false);
          return;
        }

        // Fetch initial profile with retries to handle race conditions (Auth vs Profile creation)
        let currentData = null;
        let attempts = 0;
        const maxAttempts = 3;

        while (attempts < maxAttempts) {
          const { data, error: fetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          if (data) {
            currentData = data;
            break;
          }

          attempts++;
          if (attempts < maxAttempts) {
            // Wait 500ms before next attempt
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }

        if (!currentData) {
          throw new Error("Access Denied: Suspiro Node not initialized. Please try refreshing or contact support.");
        }

        setProfile(currentData);

        // ALWAYS CHAIN .on() BEFORE .subscribe()
        // Ensure fetchProfile is finished before this line
        const channel = supabase
          .channel(`profile-updates-${session.user.id}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'profiles',
              filter: `id=eq.${session.user.id}`,
            },
            (payload) => {
              console.log('Realtime profile update received:', payload.new);
              setProfile(payload.new as UserProfile);
            }
          );
        
        profileSubscription = channel.subscribe((status) => {
          console.log(`Subscription status for ${session.user.id}:`, status);
        });

      } catch (err) {
        console.error('Error in useProfile:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();

    // Listen to session changes
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          setProfile(null);
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          fetchProfile();
        }
      }
    );

    return () => {
      authSubscription.unsubscribe();
      if (profileSubscription) {
        supabase.removeChannel(profileSubscription);
      }
    };
  }, []);

  return { profile, loading, error, role: profile?.role || 'subscriber' };
}
