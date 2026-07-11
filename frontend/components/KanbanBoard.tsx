'use client'

import { useMemo, useState } from 'react'
import { Column, Card } from '@/types/kanban'
import KanbanColumn from './KanbanColumn'

const initialColumns: Column[] = [
  {
    id: 'backlog',
    title: 'Backlog',
    cards: [
      { id: 'card-1', title: 'Launch plan', details: 'Define goals, scope, and milestones.' },
      { id: 'card-2', title: 'Design review', details: 'Finalize board layout and color system.' }
    ]
  },
  {
    id: 'todo',
    title: 'To do',
    cards: [
      { id: 'card-3', title: 'Build UI', details: 'Create the main board and columns.' }
    ]
  },
  {
    id: 'in-progress',
    title: 'In progress',
    cards: [
      { id: 'card-4', title: 'Implement drag/drop', details: 'Make cards movable between columns.' }
    ]
  },
  {
    id: 'review',
    title: 'Review',
    cards: [
      { id: 'card-5', title: 'UI polish', details: 'Refine spacing, shadows, and typography.' }
    ]
  },
  {
    id: 'done',
    title: 'Done',
    cards: [
      { id: 'card-6', title: 'Setup project', details: 'Create the initial repository structure.' }
    ]
  }
]

function createCard(title: string, details: string): Card {
  return { id: `card-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, title, details }
}

export default function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>(initialColumns)
  const [dragged, setDragged] = useState<{ cardId: string; columnId: string } | null>(null)

  const handleAddCard = (columnId: string, title: string, details: string) => {
    setColumns((current) =>
      current.map((column) =>
        column.id === columnId
          ? { ...column, cards: [...column.cards, createCard(title, details)] }
          : column
      )
    )
  }

  const handleDeleteCard = (columnId: string, cardId: string) => {
    setColumns((current) =>
      current.map((column) =>
        column.id === columnId
          ? { ...column, cards: column.cards.filter((card) => card.id !== cardId) }
          : column
      )
    )
  }

  const handleRenameColumn = (columnId: string, title: string) => {
    setColumns((current) =>
      current.map((column) => (column.id === columnId ? { ...column, title } : column))
    )
  }

  const handleDragStart = (cardId: string, columnId: string) => {
    setDragged({ cardId, columnId })
  }

  const handleDragEnd = (cardId: string, columnId: string) => {
    if (!dragged) return
    if (dragged.columnId === columnId) {
      setDragged(null)
      return
    }

    setColumns((current) => {
      const source = current.find((column) => column.id === dragged.columnId)
      const target = current.find((column) => column.id === columnId)
      if (!source || !target) return current

      const card = source.cards.find((item) => item.id === dragged.cardId)
      if (!card) return current

      return current.map((col) => {
        if (col.id === source.id) {
          return { ...col, cards: col.cards.filter((item) => item.id !== card.id) }
        }
        if (col.id === target.id) {
          return { ...col, cards: [...col.cards, card] }
        }
        return col
      })
    })

    setDragged(null)
  }

  const boardSummary = useMemo(
    () => `${columns.reduce((count, column) => count + column.cards.length, 0)} cards across ${columns.length} columns`,
    [columns]
  )

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1640px] flex-col gap-8 px-5 py-8 md:px-10">
      <header className="rounded-[32px] bg-white/95 p-8 shadow-soft">
        <p className="text-sm uppercase tracking-[0.25em] text-primary">Project manager</p>
        <h1 className="mt-4 text-4xl font-semibold text-navy">Kanban Board</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-graytext">Drag cards between columns, add new tasks, rename columns, and delete cards as needed.</p>
        <div className="mt-6 inline-flex rounded-3xl bg-slate-100 px-4 py-3 text-sm font-medium text-navy">
          {boardSummary}
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-5 lg:grid-cols-2">
        {columns.map((column) => (
          <div
            key={column.id}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => dragged && handleDragEnd(dragged.cardId, column.id)}
          >
            <KanbanColumn
              column={column}
              onAddCard={handleAddCard}
              onDeleteCard={handleDeleteCard}
              onRenameColumn={handleRenameColumn}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
