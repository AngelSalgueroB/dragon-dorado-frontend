import { create } from 'zustand';
import { AuthUser } from '../auth/auth.interfaces';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: AuthUser | null;
}

interface AuthActions {
  setUser: (user: AuthUser) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,

      setUser: (user: AuthUser) => set({ user }),

      logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({ user: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    },
  ),
);

export default useAuthStore;
