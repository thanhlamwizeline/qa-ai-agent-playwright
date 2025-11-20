import { test, expect } from '@playwright/test';

import { POManager } from '../../page-objects/POManager';

test.describe('Product List Verification', () => {
  let poManager: POManager;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
  });

  test('@QAAGENT-58 Verify that products are properly displayed on the home page', async ({ page }) => {
    await poManager.getHomepage().navigateToHomePage();
    await poManager.getHomepage().verifyProductContainerVisible();
    await poManager.getHomepage().verifyProductIsDisplayed('Samsung galaxy s6');
  });
});