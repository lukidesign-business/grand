import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

/**
 * The hover sheen is an ::after pseudo-element rather than a child <span>.
 * Radix Slot requires exactly one child when `asChild` is set, so an extra
 * element would break every button that wraps a <Link>.
 */
const buttonVariants = cva(
  [
    'relative inline-flex items-center justify-center gap-2.5 overflow-hidden whitespace-nowrap uppercase',
    'transition-all duration-500 ease-luxe hover:-translate-y-0.5 active:translate-y-0',
    'disabled:pointer-events-none disabled:opacity-60 [&_svg]:size-4 [&_svg]:shrink-0',
    "after:pointer-events-none after:absolute after:inset-0 after:content-[''] after:-translate-x-[120%]",
    'after:bg-[linear-gradient(120deg,transparent_20%,rgba(255,255,255,.22),transparent_80%)]',
    'after:transition-transform after:duration-700 after:ease-luxe hover:after:translate-x-[120%]'
  ],
  {
    variants: {
      variant: {
        gold: 'border border-transparent bg-[linear-gradient(135deg,#d8b26d,#b98f45_55%,#cfa561)] font-medium text-ink shadow-[0_10px_34px_-18px_rgba(201,162,90,.4)] hover:shadow-[0_16px_40px_-16px_rgba(201,162,90,.45)]',
        ghost: 'border border-white/20 text-cream backdrop-blur-sm hover:border-gold hover:text-gold-bright',
        outline: 'border border-line-strong text-cream hover:border-gold hover:bg-gold/5 hover:text-gold-bright'
      },
      size: {
        default: 'px-9 py-4 text-[0.74rem] tracking-luxer',
        sm: 'px-6 py-3 text-[0.68rem] tracking-luxer',
        block: 'w-full px-9 py-4 text-[0.74rem] tracking-luxer'
      }
    },
    defaultVariants: {
      variant: 'gold',
      size: 'default'
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
