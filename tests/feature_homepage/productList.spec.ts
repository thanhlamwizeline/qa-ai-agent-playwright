import { test, expect } from '@playwright/test';
import { POManager } from '../../page-objects/POManager';

test.describe('Product List Display Validation', () => {
  let poManager: POManager;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
  });

  test('@QAAGENT-48 Verify that products are properly displayed on the home page', async ({ page }) => {
    // Step 1: Navigate to the home page (/)
    await poManager.getHomepage().navigateToHomePage();

    // Step 2: Verify the product container element is visible (products table body)
    await expect(poManager.getHomepage()['productsTableBody']).toBeVisible();

    // Step 3: Verify "Samsung galaxy s6" product is displayed in the product list
    await poManager.getHomepage().verifyProductIsDisplayed('Samsung galaxy s6');
  });
});