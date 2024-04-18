import { create } from 'zustand'

export const USER_DIALOG = 'USER_DIALOG'
export const SHARE_DIALOG = 'SHARE_DIALOG'

type AppStoreState = {
    dialogs:{dialogId: string, isOpen}[],
    dialogOpen: (dialogId: string) => boolean,
    setDialogOpen: (dialogId: string, isOpen: boolean) => void,

    isAppLoading: boolean,
    setAppLoading: (isLoading: boolean) => void,

    isDialogLoading: boolean,
    setDialogLoading: (isLoading: boolean) => void,
}

export const useAppStore = create<AppStoreState>((set, get) => ({
  dialogs: [
    { dialogId: USER_DIALOG, isOpen: false },
    { dialogId: SHARE_DIALOG, isOpen: false }
  ],

  setDialogOpen:(dialogId: string, isOpen: boolean) => set(s => {
    const newDialogs = [...s.dialogs]
    const index = newDialogs.findIndex(d => d.dialogId === dialogId)
    newDialogs[index].isOpen = isOpen
    return { dialogs: newDialogs, isDialogLoading: false }
  }),

  dialogOpen:(dialogId: string) => get().dialogs.find(d => d.dialogId === dialogId)!.isOpen!,

  isAppLoading: false,
  setAppLoading: (isLoading: boolean) => set({ isAppLoading: isLoading }),

  isDialogLoading: false,
  setDialogLoading: (isLoading: boolean) => set({ isDialogLoading: isLoading }),
}))
