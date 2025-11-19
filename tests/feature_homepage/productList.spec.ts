import { test, expect } from '@playwright/test';
import { POManager } from '../../page-objects/POManager';

test.describe('Product Display Verification', () => {
  let poManager: POManager;

  test('@QAAGENT-44 Verify that products are properly displayed on the home page', async ({ page }) => {
    poManager = new POManager(page);

    // Step 1: Navigate to the home page (/)
    await poManager.getHomepage().goToHomePage();

    // Step 2: Verify the product container element is visible (products table body)
    await poManager.getHomepage().verifyProductList();

    // Step 3: Verify "Samsung galaxy s6" product is displayed in the product list
    await poManager.getHomepage().verifyProductIsDisplayed('Samsung galaxy s6');
  });
});