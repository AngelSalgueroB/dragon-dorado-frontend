import { create } from 'zustand';
import { AuthUser } from '../auth/auth.interfaces';

interface AuthState {
  user: AuthUser | null;
}

interface AuthActions {
  setUser: (user: AuthUser) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState & AuthActions>()((set) => ({
  user: null,
  setUser: (user: AuthUser) => set({ user }),
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ user: null });
  },
}));

export default useAuthStore;
