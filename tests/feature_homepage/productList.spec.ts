import { test, expect } from '@playwright/test';

import { POManager } from '../../page-objects/POManager';

let poManager: POManager;

test.describe('Product List Verification', () => {
  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
  });

  test('@QAAGENT-57 Navigate to the home page', async ({ page }) => {
    await poManager.getHomepage().navigateToHomePage();
  });

  test('@QAAGENT-57 Verify the product container element is visible', async ({ page }) => {
    await poManager.getHomepage().navigateToHomePage();
    await poManager.getHomepage().verifyProductList();
  });

  test('@QAAGENT-57 Verify Samsung galaxy s6 product is displayed in the product list', async ({ page }) => {
    await poManager.getHomepage().navigateToHomePage();
    await poManager.getHomepage().verifyProductList();
    await poManager.getHomepage().verifyProductIsDisplayed('Samsung galaxy s6');
  });
});