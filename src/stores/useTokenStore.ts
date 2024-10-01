import { create } from 'zustand'

export interface ITokenStore {
    token: string | null;
    setToken: (token: string) => void;
};

export const useTokenStore = create<ITokenStore>((set) => ({
  token: null,
  setToken: (token: string) => set({ token }),
}))