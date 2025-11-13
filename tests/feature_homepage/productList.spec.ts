import { test, expect } from '@playwright/test';

import { POManager } from '../../page-objects/POManager';
import { TESTCONFIG } from '../../data/config/testconfig';

test.describe('Product List Display Verification', () => {
  let poManager: POManager;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
  });

  test('@QAAGENT-51 Verify that products are properly displayed on the home page', async ({ page }) => {
    await poManager.getHomepage().navigateToHomePage();
    await poManager.getHomepage().verifyProductList();
    await poManager.getHomepage().verifyProductIsDisplayed('Samsung galaxy s6');
  });
});