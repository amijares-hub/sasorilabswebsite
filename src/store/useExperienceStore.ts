import { create } from 'zustand';
import { createClient, RealtimeChannel } from '@supabase/supabase-js';

/**
 * Interface for Automation Logs synced in Real-time from Supabase
 */
interface AutomationLog {
  id: string;
  created_at: string;
  action_performed: string;
  tokens_used: number;
  metadata: any;
  employee_id: string;
}

/**
 * Global Experience Store
 * Triggers UI and 3D orchestration based on loading state and real-time backend activity
 */
interface ExperienceState {
  // Loading & Asset States
  isModelsLoaded: boolean;
  loadingProgress: number;
  
  // Real-time backend activity metrics
  recentLogs: AutomationLog[];
  activityLevel: number; // Normalized 0-1 value for visual pulsing
  
  // Actions
  setModelsLoaded: (loaded: boolean) => void;
  setLoadingProgress: (progress: number) => void;
  addLog: (log: AutomationLog) => void;
  initRealtime: () => () => void;
}

// Supabase client initialization (requires environment variables)
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

export const useExperienceStore = create<ExperienceState>((set, get) => ({
  isModelsLoaded: false,
  loadingProgress: 0,
  recentLogs: [],
  activityLevel: 0,

  setModelsLoaded: (loaded) => set({ isModelsLoaded: loaded }),
  setLoadingProgress: (progress) => set({ loadingProgress: progress }),
  
  addLog: (log) => {
    set((state) => {
      const newLogs = [log, ...state.recentLogs].slice(0, 50); // Keep last 50 for performance
      return { 
        recentLogs: newLogs,
        // Activity spikes boost the visual pulse
        activityLevel: Math.min(1, newLogs.length / 10) 
      };
    });

    // Decay activity level after 2 seconds of inactivity
    setTimeout(() => {
      set((state) => ({ 
        activityLevel: Math.max(0, state.activityLevel - 0.1) 
      }));
    }, 2000);
  },

  /**
   * Listen to real-time changes in the automation_logs table
   */
  initRealtime: () => {
    const channel: RealtimeChannel = supabase
      .channel('public:automation_logs')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'automation_logs',
        },
        (payload) => {
          get().addLog(payload.new as AutomationLog);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
}));
