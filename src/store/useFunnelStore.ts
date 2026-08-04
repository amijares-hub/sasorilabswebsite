import { create } from 'zustand';

interface FunnelState {
  isOpen: boolean;
  openFunnel: () => void;
  closeFunnel: () => void;
}

export const useFunnelStore = create<FunnelState>((set) => ({
  isOpen: false,
  openFunnel: () => set({ isOpen: true }),
  closeFunnel: () => set({ isOpen: false }),
}));
