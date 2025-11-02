import { create } from 'zustand'
import { Toast, ToastType } from '../components/primitives/Toast'

interface ToastState {
  toasts: Toast[]
  addToast: (type: ToastType, message: string, duration?: number) => void
  removeToast: (id: string) => void
  clearAll: () => void
}

export const useToastStore = create<ToastState>(set => ({
  toasts: [],
  addToast: (type, message, duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9)
    set(state => ({
      toasts: [...state.toasts, { id, type, message, duration }]
    }))
  },
  removeToast: id =>
    set(state => ({
      toasts: state.toasts.filter(toast => toast.id !== id)
    })),
  clearAll: () => set({ toasts: [] })
}))
