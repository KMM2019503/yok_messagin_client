import { UserType } from "@/type/user.type";
import { createStore } from "zustand/vanilla";

export type AuthState = {
  isAuthenticated: boolean;
  user: UserType | null;
};

export type AuthAction = {
  login: (user: UserType) => void;
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
    login: (user: UserType) =>
      set((state) => ({
        ...state,
        isAuthenticated: true,
        user: user,
      })),
    logout: () =>
      set((state) => ({
        ...state,
        isAuthenticated: false,
        user: null,
      })),
  }));
};
