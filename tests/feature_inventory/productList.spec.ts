import { test, expect } from '@playwright/test';

import { CREDENTIALS } from '../../data/constants';
import { POManager } from '../../page-objects/POManager';

test.describe('Inventory Product List Verification', () => {
  let poManager: POManager;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
    await page.goto(process.env.BASE_URL_E2E || '');
  });

  test('@QAAGENT-56 Verify that products are properly displayed on the inventory page', async ({ page }) => {
    await poManager.getHomepage().clickLogin();
    await poManager.getLoginPage().login(CREDENTIALS.STANDARD_USER.username, CREDENTIALS.STANDARD_USER.password);
    await poManager.getInventoryPage().verifyValidInventoryURL();
    await poManager.getInventoryPage().verifyInventoryList();
    await poManager.getInventoryPage().verifyProductIsDisplayed('Sauce Labs Bike Light');
  });
});