import { test, expect } from '@playwright/test';
import { POManager } from '../../page-objects/POManager';

test.describe('Product List Display Verification', () => {
  let poManager: POManager;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
  });

  test('@QAAGENT-48 Verify products are properly displayed on the home page', async ({ page }) => {
    await poManager.getHomepage().navigateToHomePage();
    await poManager.getHomepage().verifyProductsTableBody();
    await poManager.getHomepage().verifyProductIsDisplayed('Samsung galaxy s6');
  });
});