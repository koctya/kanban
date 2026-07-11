'use client'

import { Card } from '@/types/kanban'

type Props = {
  card: Card
  onDelete: (cardId: string) => void
}

export default function KanbanCard({ card, onDelete }: Props) {
  return (
    <article data-testid="kanban-card" className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-navy">{card.title}</p>
          <p className="mt-2 text-sm leading-6 text-graytext">{card.details}</p>
        </div>
        <button
          type="button"
          className="text-sm font-medium text-primary hover:text-secondary"
          onClick={() => onDelete(card.id)}
        >
          Delete
        </button>
      </div>
    </article>
  )
}
