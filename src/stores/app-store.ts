import { create } from 'zustand'

export type AppStateProps = {
}

export type AppStoreState = AppStateProps & {
    isAppLoading: boolean,
    setAppLoading: (isLoading: boolean) => void,

    userDialogOpen: boolean,
    setUserDialogOpen: (isOpen: boolean) => void,

    isDialogLoading: boolean,
    setDialogLoading: (isLoading: boolean) => void,
}

export const useAppStore = create<AppStoreState>((set) => ({
  isAppLoading: false,
  setAppLoading: (isLoading: boolean) => set({ isAppLoading: isLoading }),

  userDialogOpen: false,
  setUserDialogOpen: (isOpen: boolean) => set({ userDialogOpen: isOpen, isDialogLoading: false }),

  isDialogLoading: false,
  setDialogLoading: (isLoading: boolean) => set({ isDialogLoading: isLoading }),
}))
