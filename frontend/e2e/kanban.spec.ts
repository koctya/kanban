import { test, expect } from '@playwright/test'

const baseUrl = 'http://localhost:3000'

test('loads the board and performs drag, add, delete, and rename actions', async ({ page }) => {
  await page.goto(baseUrl)
  await expect(page.getByRole('heading', { name: 'Kanban Board' })).toBeVisible()

  const todoColumn = page.getByRole('heading', { name: 'To do' })
  await expect(todoColumn).toBeVisible()

  const backlogCard = page.getByText('Launch plan')
  const reviewColumn = page.getByRole('heading', { name: 'Review' })
  const reviewDropZone = reviewColumn.locator('..')

  await backlogCard.dragTo(reviewDropZone)
  await expect(page.getByText('Launch plan')).toBeVisible()

  await page.getByRole('button', { name: 'Rename' }).first().click()
  const renameInput = page.getByRole('textbox').first()
  await renameInput.fill('Planning')
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByRole('heading', { name: 'Planning' })).toBeVisible()

  const addCardInput = page.getByPlaceholder('Title')
  await addCardInput.fill('New task')
  await page.getByPlaceholder('Details').fill('Complete the MVP.')
  await page.getByRole('button', { name: 'Add card' }).click()
  await expect(page.getByText('New task')).toBeVisible()

  await page.getByRole('button', { name: 'Delete' }).last().click()
  await expect(page.getByText('New task')).toBeHidden()
})
