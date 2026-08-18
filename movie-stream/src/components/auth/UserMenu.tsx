'use client'

import { useState, useRef, useEffect } from 'react'
import { LogOut, User, ChevronDown, Bookmark, Settings } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/AuthContext'

export function UserMenu() {
  const { user, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  if (!user) return null

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all duration-fast',
          'hover:bg-surface-border-dark dark:hover:bg-surface-border-light',
          isOpen && 'bg-surface-border-dark dark:bg-surface-border-light'
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User menu"
      >
        <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-brand-contrast text-caption font-bold shadow-sm">
          {initials}
        </div>
        <ChevronDown className={cn('h-4 w-4 text-text-muted-dark dark:text-text-muted-light transition-transform duration-fast', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-xl bg-surface-card-dark border border-surface-border-dark shadow-shadow-xl dark:bg-surface-card-light dark:border-surface-border-light animate-in z-50 overflow-hidden"
          style={{ animationDuration: '150ms' }}
        >
          {/* User info */}
          <div className="px-4 py-3 border-b border-surface-border-dark dark:border-surface-border-light">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-brand-contrast text-body-sm font-bold shadow-sm shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-body-sm font-semibold truncate">{user.name}</p>
                <p className="text-caption text-text-muted-dark dark:text-text-muted-light truncate">{user.email}</p>
              </div>
            </div>
            <div className="mt-2">
              <span className={cn(
                'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium',
                user.provider === 'google' && 'bg-surface-border-dark text-text-secondary-dark',
                user.provider === 'apple' && 'bg-gray-500/10 text-gray-400'
              )}>
                {user.provider === 'google' ? '● Google' : '● Apple ID'}
              </span>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <Link
              href="/watchlist"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-body-sm text-text-secondary-dark hover:text-text-primary-dark hover:bg-surface-border-dark dark:text-text-secondary-light dark:hover:text-text-primary-light dark:hover:bg-surface-border-light transition-colors"
            >
              <Bookmark className="h-4 w-4" />
              My Watchlist
            </Link>
          </div>

          {/* Sign out */}
          <div className="border-t border-surface-border-dark dark:border-surface-border-light py-1">
            <button
              onClick={() => {
                signOut()
                setIsOpen(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-body-sm text-text-secondary-dark hover:text-text-primary-dark hover:bg-surface-border-dark transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
