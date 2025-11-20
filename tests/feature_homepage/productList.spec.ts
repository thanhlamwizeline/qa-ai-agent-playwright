import { test, expect } from '@playwright/test';

import { POManager } from '../../page-objects/POManager';

test.describe('Product List Verification on Homepage', () => {
  let poManager: POManager;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
  });

  test('@QAAGENT-44 Verify that products are properly displayed on the home page', async ({ page }) => {
    await poManager.getHomepage().navigateToHomePage();
    await poManager.getHomepage().verifyProductList();
    await poManager.getHomepage().verifyProductIsDisplayed('Samsung galaxy s6');
  });
});