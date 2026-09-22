import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
    arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { router } from '@inertiajs/react';
import * as React from 'react';

interface Props<T extends { id: number }> {
    items: T[];
    reorderUrl: string;
    renderItem: (item: T, dragHandle: React.ReactNode) => React.ReactNode;
}

/**
 * Generic drag-to-reorder list. Reordering is optimistic (updates local
 * state immediately) then persists the new order to the server; on failure
 * Inertia's own error flash surfaces and a page refresh restores truth.
 */
export default function SortableList<T extends { id: number }>({ items, reorderUrl, renderItem }: Props<T>) {
    const [order, setOrder] = React.useState(items);

    React.useEffect(() => setOrder(items), [items]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = order.findIndex((i) => i.id === active.id);
        const newIndex = order.findIndex((i) => i.id === over.id);
        const next = arrayMove(order, oldIndex, newIndex);
        setOrder(next);

        router.post(
            reorderUrl,
            { order: next.map((i) => i.id) },
            { preserveScroll: true, preserveState: true },
        );
    }

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={order.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                    {order.map((item) => (
                        <SortableItem key={item.id} id={item.id}>
                            {(handle) => renderItem(item, handle)}
                        </SortableItem>
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}

function SortableItem({ id, children }: { id: number; children: (handle: React.ReactNode) => React.ReactNode }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handle = (
        <button
            type="button"
            className="admin-drag-handle"
            aria-label="Seret untuk mengubah urutan"
            {...attributes}
            {...listeners}
        >
            <GripVertical className="h-4 w-4" />
        </button>
    );

    return (
        <div ref={setNodeRef} style={style} className={`admin-drag-row${isDragging ? ' dragging' : ''}`}>
            {children(handle)}
        </div>
    );
}
