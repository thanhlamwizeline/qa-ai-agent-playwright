import { test, expect } from '@playwright/test';
import { POManager } from '../../page-objects/POManager';
import { TESTCONFIG } from '../../data/config/testconfig';

test.describe('Product List Display Verification', () => {
  let poManager: POManager;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
  });

  test('@QAAGENT-51 Verify that products are properly displayed on the home page', async ({ page }) => {
    // Navigate to the home page
    await poManager.getHomepage().navigateToHomePage();
    
    // Verify the product container element is visible (products table body)
    await poManager.getHomepage().verifyProductList();
    
    // Verify "Samsung galaxy s6" product is displayed in the product list
    await poManager.getHomepage().verifyProductIsDisplayed('Samsung galaxy s6');
  });
});