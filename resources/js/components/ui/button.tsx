import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
    'admin-btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-purple)] disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                default: 'admin-btn-dark',
                destructive: 'admin-btn-danger',
                outline: 'admin-btn-glass',
                ghost: 'bg-transparent hover:bg-black/[0.04]',
                link: 'bg-transparent px-0 text-[var(--color-ink)] underline-offset-4 hover:underline',
            },
            size: {
                default: '',
                sm: 'admin-btn-sm',
                lg: 'px-7 py-3 text-[14px]',
                icon: 'h-9 w-9 rounded-full p-0',
            },
        },
        defaultVariants: { variant: 'default', size: 'default' },
    },
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
    },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
