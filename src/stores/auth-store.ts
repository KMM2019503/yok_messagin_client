import { createStore } from "zustand/vanilla";

export type AuthState = {
  isAuthenticated: boolean;
  user: {
    id: string;
    userName: string;
    email: string;
    userUniqueID: string;
    profilePictureUrl?: string | null;
  } | null;
};

export type AuthAction = {
  login: (user: { id: string; userName: string; email: string, userUniqueID: string, profilePictureUrl: string | null }) => void;
  logout: () => void;
};

export type AuthStore = AuthState & AuthAction;

export const initAuthStore = (): AuthState => {
  return {
    isAuthenticated: false,
    user: null,
  };
};

export const defaultInitState: AuthState = {
  isAuthenticated: false,
  user: null,
};

export const createAuthStore = (initState: AuthState = defaultInitState) => {
  return createStore<AuthStore>()((set) => ({
    ...initState,
    login: (user) =>
      set((state) => ({
        ...state,
        isAuthenticated: true,
        user: {
          id: user.id,
          userName: user.userName,
          email: user.email,
          userUniqueID: user.userUniqueID,
          profilePictureUrl: user.profilePictureUrl || null,
        },
      })),
    logout: () =>
      set((state) => ({
        ...state,
        isAuthenticated: false,
        user: null,
      })),
  }));
};
