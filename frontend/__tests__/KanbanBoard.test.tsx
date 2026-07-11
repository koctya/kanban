import { render, screen, within, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import KanbanBoard from '@/components/KanbanBoard'

describe('KanbanBoard', () => {
  it('renders initial columns and card count', () => {
    render(<KanbanBoard />)
    expect(screen.getByText('Kanban Board')).toBeInTheDocument()
    expect(screen.getByText('Backlog')).toBeInTheDocument()
    expect(screen.getByText('To do')).toBeInTheDocument()
    expect(screen.getByText('In progress')).toBeInTheDocument()
    expect(screen.getByText('Review')).toBeInTheDocument()
    expect(screen.getByText('Done')).toBeInTheDocument()
  })

  it('adds and deletes a card', async () => {
    const user = userEvent.setup()
    render(<KanbanBoard />)

    const addButtons = screen.getAllByRole('button', { name: 'Add card' })
    expect(addButtons.length).toBe(5)

    const titleInput = screen.getAllByPlaceholderText('Title')[0]
    const detailsInput = screen.getAllByPlaceholderText('Details')[0]

    await user.type(titleInput, 'Test task')
    await user.type(detailsInput, 'Test details')
    await user.click(addButtons[0])

    expect(await screen.findByText('Test task')).toBeInTheDocument()
    expect(screen.getByText('Test details')).toBeInTheDocument()

    const cardContainers = screen.getAllByTestId('kanban-card')
    const cardContainer = cardContainers.find((container) => container.textContent?.includes('Test task'))
    expect(cardContainer).not.toBeNull()
    if (cardContainer) {
      const deleteButton = cardContainer.querySelector('button')
      expect(deleteButton).toBeInTheDocument()
      await user.click(deleteButton as HTMLElement)
    }

    await waitFor(() => expect(screen.queryByText('Test task')).not.toBeInTheDocument())
  })
})
