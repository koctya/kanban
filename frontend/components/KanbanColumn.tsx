'use client'

import { useState } from 'react'
import { Column, Card } from '@/types/kanban'
import AddCardForm from './AddCardForm'
import KanbanCard from './KanbanCard'

type Props = {
  column: Column
  onAddCard: (columnId: string, title: string, details: string) => void
  onDeleteCard: (columnId: string, cardId: string) => void
  onRenameColumn: (columnId: string, title: string) => void
  onDragStart: (cardId: string, columnId: string) => void
  onDragEnd: (cardId: string, columnId: string) => void
}

export default function KanbanColumn({
  column,
  onAddCard,
  onDeleteCard,
  onRenameColumn,
  onDragStart,
  onDragEnd
}: Props) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(column.title)

  return (
    <div className="rounded-[32px] border border-slate-200 bg-white/95 p-5 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        {editing ? (
          <form
            onSubmit={(event) => {
              event.preventDefault()
              onRenameColumn(column.id, title.trim() || column.title)
              setEditing(false)
            }}
            className="flex w-full items-center gap-3"
          >
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button type="submit" className="text-sm font-semibold text-primary">
              Save
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-navy">{column.title}</h2>
            <button
              type="button"
              className="text-sm text-graytext hover:text-navy"
              onClick={() => setEditing(true)}
            >
              Rename
            </button>
          </div>
        )}
      </div>

      <div className="mt-5 space-y-4">
        {column.cards.map((card) => (
          <div
            key={card.id}
            draggable
            onDragStart={() => onDragStart(card.id, column.id)}
            onDragEnd={() => onDragEnd(card.id, column.id)}
            className="cursor-grab"
          >
            <KanbanCard card={card} onDelete={(cardId) => onDeleteCard(column.id, cardId)} />
          </div>
        ))}
      </div>

      <AddCardForm onAdd={(title, details) => onAddCard(column.id, title, details)} />
    </div>
  )
}
