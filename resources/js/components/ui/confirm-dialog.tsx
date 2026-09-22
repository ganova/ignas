import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';

interface Props {
    trigger: React.ReactNode;
    title: string;
    description: string;
    confirmLabel?: string;
    onConfirm: () => void;
}

/**
 * Focus is trapped inside the dialog by Radix, and Escape closes it —
 * required for the destructive delete confirmations across admin CRUD.
 */
export default function ConfirmDialog({ trigger, title, description, confirmLabel = 'Hapus', onConfirm }: Props) {
    const [open, setOpen] = React.useState(false);

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-[#0d0d14]/30 backdrop-blur-sm" />
                <Dialog.Content className="admin-card fixed top-1/2 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 p-6 focus:outline-none">
                    <Dialog.Title className="text-base font-bold text-[var(--color-ink)]">{title}</Dialog.Title>
                    <Dialog.Description className="mt-2 text-sm text-[var(--color-ink-2)]">
                        {description}
                    </Dialog.Description>
                    <div className="mt-6 flex justify-end gap-2">
                        <Dialog.Close asChild>
                            <Button variant="outline">Batal</Button>
                        </Dialog.Close>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                onConfirm();
                                setOpen(false);
                            }}
                        >
                            {confirmLabel}
                        </Button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
