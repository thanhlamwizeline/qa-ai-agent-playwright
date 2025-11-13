import { test, expect } from '@playwright/test';
import { POManager } from '../../page-objects/POManager';

test.describe('@QAAGENT-44 Product List Verification', () => {
  test('Verify that products are properly displayed on the home page', async ({ page }) => {
    const poManager = new POManager(page);
    const homepage = poManager.getHomepage();

    // Step 1: Navigate to the home page (/)
    await homepage.navigateToHomePage();

    // Step 2: Verify the product container element is visible (products table body)
    await homepage.verifyProductList();

    // Step 3: Verify "Samsung galaxy s6" product is displayed in the product list
    await homepage.verifyProductIsDisplayed('Samsung galaxy s6');
  });
});