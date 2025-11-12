import { test } from '@playwright/test';
import { POManager } from '../../page-objects/POManager';

test.describe('Product List Verification', () => {
  let poManager: POManager;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
  });

  test('@QAAGENT-48 Verify that products are properly displayed on the home page', async ({ page }) => {
    const homepage = poManager.getHomepage();
    
    await homepage.goToHomePage();
    await homepage.verifyProductList();
    await homepage.verifyProductIsDisplayed('Samsung galaxy s6');
  });
});