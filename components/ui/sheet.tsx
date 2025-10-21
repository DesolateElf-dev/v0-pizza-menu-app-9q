"use client"

import { useState } from 'react'

export function Sheet({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

export function SheetTrigger({ asChild, children, onClick }: { asChild?: boolean; children: React.ReactElement; onClick?: () => void }) {
  return (
    <div onClick={onClick} className="inline-block">
      {children}
    </div>
  )
}

export function SheetContent({ children, side = 'right', open, onClose }: { children: React.ReactNode; side?: 'left' | 'right'; open?: boolean; onClose?: () => void }) {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <aside
        className={`fixed top-0 ${side === 'right' ? 'right-0' : 'left-0'} h-full w-80 max-w-[85%] bg-white text-amber-900 shadow-xl transform transition-transform ${
          open ? 'translate-x-0' : side === 'right' ? 'translate-x-full' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </aside>
    </>
  )
}

export function useSheetState(defaultOpen = false) {
  const [open, setOpen] = useState(defaultOpen)
  const onOpenChange = (v: boolean) => setOpen(v)
  return { open, onOpenChange }
}
