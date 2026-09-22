import * as React from 'react';
import { cn } from '@/lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
    ({ className, ...props }, ref) => (
        <textarea className={cn('admin-textarea min-h-20', className)} ref={ref} {...props} />
    ),
);
Textarea.displayName = 'Textarea';

export { Textarea };
