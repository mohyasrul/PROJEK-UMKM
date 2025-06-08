import { create } from 'zustand';

interface NavigationState {
  isSidebarOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;
  setIsMobile: (isMobile: boolean) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  isSidebarOpen: false,
  isMobile: false,
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  closeSidebar: () => set({ isSidebarOpen: false }),
  openSidebar: () => set({ isSidebarOpen: true }),
  setIsMobile: (isMobile: boolean) => set({ isMobile }),
}));
