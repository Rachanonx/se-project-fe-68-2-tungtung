import { APIRequestContext, expect, Locator, Page, test } from '@playwright/test';

const backendURL =
  process.env.PLAYWRIGHT_BACKEND_URL ??
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  'http://127.0.0.1:5000';

const uniqueId = Date.now();

function buildTelephone(seed: number) {
  const digits = String(seed).slice(-7);
  return `081-${digits.slice(0, 3)}-${digits.slice(3).padEnd(4, '0')}`;
}

const userAccount = {
  name: 'Playwright User',
  email: `playwright-user-${uniqueId}@example.com`,
  telephone: buildTelephone(uniqueId),
  password: 'Playwright123!',
  role: 'user',
};

const adminAccount = {
  name: 'Playwright Admin',
  email: `playwright-admin-${uniqueId}@example.com`,
  telephone: buildTelephone(uniqueId + 1),
  password: 'Playwright123!',
  role: 'admin',
};

async function ensureAccount(request: APIRequestContext, account: typeof userAccount) {
  const response = await request.post(`${backendURL}/api/v1/auth/register`, {
    data: account,
  });

  // 409 / 400 mean the account already exists from a previous run — that's fine.
  if (!response.ok() && response.status() !== 400 && response.status() !== 409) {
    expect(response, await response.text()).toBeOK();
  }
}

async function signIn(page: Page, email: string, password: string) {
  await page.goto('/signin');
  await page.getByLabel('Email address').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL((url) => !url.pathname.endsWith('/signin'), { timeout: 30000 });
  await expect(page.getByText('Invalid email or password.')).toHaveCount(0);
}

async function openUserChat(page: Page) {
  await expect(page.getByTestId('chat-open-button')).toBeVisible();
  await page.getByTestId('chat-open-button').click();
  await expect(page.getByTestId('chat-window')).toBeVisible();
}

test.describe.configure({ mode: 'serial' });

test.beforeAll(async ({ request }) => {
  await ensureAccount(request, userAccount);
  await ensureAccount(request, adminAccount);
});

test('user and admin can exchange chat messages', async ({ browser, page }) => {
  const adminContext = await browser.newContext();
  const adminPage = await adminContext.newPage();
  const userMessage = `hello from user ${uniqueId}`;
  const adminMessage = `hello from admin ${uniqueId}`;

  await signIn(page, userAccount.email, userAccount.password);
  await openUserChat(page);
  await page.getByTestId('chat-input').fill(userMessage);
  await page.getByTestId('chat-send-button').click();
  await expect(page.getByText(userMessage)).toBeVisible();

  await signIn(adminPage, adminAccount.email, adminAccount.password);
  await expect(adminPage.getByRole('link', { name: 'Manage Chats' })).toBeVisible();
  await adminPage.getByRole('link', { name: 'Manage Chats' }).click();
  await expect(adminPage).toHaveURL(/\/admin\/chat$/);
  await expect(adminPage.getByRole('heading', { name: 'User Conversations' })).toBeVisible();

  const userRoom = adminPage
    .locator('[data-testid^="chat-room-"]')
    .filter({ hasText: 'Playwright User' })
    .first();
  await expect(userRoom).toBeVisible({ timeout: 30000 });
  await userRoom.click();
  await expect(adminPage.getByText(userMessage)).toBeVisible();

  await adminPage.getByTestId('admin-chat-input').fill(adminMessage);
  await adminPage.getByTestId('admin-chat-send-button').click();
  await expect(adminPage.getByText(adminMessage)).toBeVisible();

  await expect(page.getByText(adminMessage)).toBeVisible({ timeout: 30000 });

  await adminContext.close();
});

test('user can edit and delete own message', async ({ page }) => {
  const originalMessage = `original message ${uniqueId}`;
  const editedMessage = `edited message ${uniqueId}`;

  await signIn(page, userAccount.email, userAccount.password);
  await openUserChat(page);

  await page.getByTestId('chat-input').fill(originalMessage);
  await page.getByTestId('chat-send-button').click();
  await expect(page.getByText(originalMessage)).toBeVisible();

  const findOwnBubble = (text: string): Locator =>
    page.getByTestId('message-bubble').filter({ hasText: text }).first();

  const ownMessage = findOwnBubble(originalMessage);
  await ownMessage.getByTestId('message-options-button').click();
  await ownMessage.getByTestId('message-edit-button').click();

  // Scope the edit textarea to the bubble currently in editing mode
  // (identified by containing the Save button).
  const editingBubble = page
    .getByTestId('message-bubble')
    .filter({ has: page.getByRole('button', { name: 'Save' }) })
    .first();
  const editInput = editingBubble.getByRole('textbox');
  await editInput.fill(editedMessage);
  await editingBubble.getByRole('button', { name: 'Save' }).click();

  await expect(page.getByText(editedMessage)).toBeVisible();
  await expect(page.getByText(originalMessage, { exact: true })).toHaveCount(0);

  // Re-locate the bubble using the new (edited) text before deleting.
  const editedBubble = findOwnBubble(editedMessage);
  page.once('dialog', (dialog) => dialog.accept());
  await editedBubble.getByTestId('message-options-button').click();
  await editedBubble.getByTestId('message-delete-button').click();

  await expect(page.getByText(editedMessage)).toHaveCount(0);
});
