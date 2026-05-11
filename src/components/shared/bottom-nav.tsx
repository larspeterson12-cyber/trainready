'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Dumbbell, Activity, User, ClipboardList } from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/workout/new', icon: Dumbbell, label: 'Workout' },
  { href: '/workout/history', icon: ClipboardList, label: 'Logboek' },
  { href: '/recovery', icon: Activity, label: 'Herstel' },
  { href: '/profile', icon: User, label: 'Profiel' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[--color-border] bg-[--color-surface] safe-bottom">
      <div className="mx-auto flex max-w-lg">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || (href !== '/workout/new' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 pt-3 text-[10px] transition-colors ${
                isActive
                  ? 'text-[--color-accent]'
                  : 'text-[--color-text-muted] hover:text-[--color-text-secondary]'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className={isActive ? 'font-semibold' : 'font-normal'}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
