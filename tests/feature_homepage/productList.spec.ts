import { test, expect } from '@playwright/test';
import { POManager } from '../../page-objects/POManager';

test.describe('Product List Verification', () => {
  test('@QAAGENT-44 Verify that products are properly displayed on the home page', async ({ page }) => {
    const poManager = new POManager(page);
    const homepage = poManager.getHomepage();

    await homepage.navigateToHomePage();
    await homepage.verifyProductList();
    await homepage.verifyProductIsDisplayed('Samsung galaxy s6');
  });
});