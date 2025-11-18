'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export const navLinks = [
  { href: '/dashboard', label: 'Home' },
  { href: '/report', label: 'New Report' },
  { href: '/diagnosis', label: 'AI Diagnosis' },
  { href: '/records', label: 'Records' },
  { href: '/doctor-assignment', label: 'Assign Doctor' },
  { href: '/hospitals', label: 'Hospitals' },
  { href: '/info', label: 'Info' },
  { href: '/contact', label: 'Contact' },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-4 text-sm font-medium">
      {navLinks.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname === href ? 'text-foreground' : 'text-foreground/60'
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
