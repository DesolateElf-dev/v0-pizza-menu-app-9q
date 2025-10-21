export function DropdownMenu({ children }: { children: React.ReactNode }) {
  return <div className="relative inline-block text-left">{children}</div>
}

export function DropdownMenuTrigger({ asChild, children }: { asChild?: boolean; children: React.ReactElement }) {
  return children
}

export function DropdownMenuContent({ children, align = 'end', className = '' }: { children: React.ReactNode; align?: 'start' | 'end'; className?: string }) {
  return (
    <div className={`absolute z-50 mt-2 w-56 origin-top-right rounded-xl bg-white text-amber-900 shadow-lg ring-1 ring-black/5 focus:outline-none ${align === 'end' ? 'right-0' : 'left-0'} ${className}`}>
      {children}
    </div>
  )
}

export function DropdownMenuItem({ children, onClick, asChild }: { children: React.ReactNode; onClick?: () => void; asChild?: boolean }) {
  const className = 'block w-full px-4 py-2 text-sm hover:bg-amber-50 rounded-lg'
  if (asChild) {
    return <div className={className}>{children}</div>
  }
  return (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  )
}
