import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  title?: string;
  message: string;
  type: ToastType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // Auto remove toast after duration
    if (toast.duration !== 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, toast.duration || 5000);
    }
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),

  clearAll: () => set({ toasts: [] }),
}));

// Helper functions for easier usage
export const toast = {
  success: (
    message: string,
    options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>
  ) =>
    useToastStore.getState().addToast({ message, type: 'success', ...options }),

  error: (
    message: string,
    options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>
  ) =>
    useToastStore.getState().addToast({ message, type: 'error', ...options }),

  warning: (
    message: string,
    options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>
  ) =>
    useToastStore.getState().addToast({ message, type: 'warning', ...options }),

  info: (
    message: string,
    options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>
  ) => useToastStore.getState().addToast({ message, type: 'info', ...options }),
};
