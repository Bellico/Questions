import { create } from 'zustand'

export type AppStateProps = {
}

export type AppStoreState = AppStateProps & {
    isAppLoading: boolean,
    setLoader: (isLoading: boolean) => void,
}

export const useAppStore = create<AppStoreState>((set) => ({
  isAppLoading: false,
  setLoader: (isLoading: boolean) => set({ isAppLoading: isLoading }),
}))
