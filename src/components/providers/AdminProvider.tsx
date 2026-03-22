import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

interface AdminContextType {
  isAdmin: boolean;
  openAIGenerator: (contextPrompt?: string) => void;
  isAIGeneratorOpen: boolean;
  closeAIGenerator: () => void;
  generatorContext: string;
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  openAIGenerator: () => {},
  isAIGeneratorOpen: false,
  closeAIGenerator: () => {},
  generatorContext: ''
});

// Any user that logs into the system (since it's only for the master dashboard) is considered an Admin for this specific website.
export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAIGeneratorOpen, setIsAIGeneratorOpen] = useState(false);
  const [generatorContext, setGeneratorContext] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      // In Sasorilabs, anyone who successfully logs into Supabase Auth via Dashboard is an admin
      if (session) setIsAdmin(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) setIsAdmin(true);
      else setIsAdmin(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const openAIGenerator = (promptContext = '') => {
    setGeneratorContext(promptContext);
    setIsAIGeneratorOpen(true);
  };

  const closeAIGenerator = () => setIsAIGeneratorOpen(false);

  return (
    <AdminContext.Provider value={{ isAdmin, openAIGenerator, closeAIGenerator, isAIGeneratorOpen, generatorContext }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
