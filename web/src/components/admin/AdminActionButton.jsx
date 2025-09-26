import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * AdminActionButton
 * Lightweight wrapper around the shared <Button /> with opinionated defaults
 * for small inline action buttons inside admin tables.
 */
export function AdminActionButton({
  children,
  variant = 'outline',
  size = 'sm',
  className,
  ...props
}) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn('h-7 text-xs px-2 py-1 cursor-pointer', className)}
      {...props}
    >
      {children}
    </Button>
  );
}

export default AdminActionButton;
