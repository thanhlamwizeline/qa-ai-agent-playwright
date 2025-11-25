import { test } from '@playwright/test';

import dotenv from 'dotenv';

import { TESTCONFIG } from '../../data/config/testconfig';
import { POManager } from '../../page-objects/POManager';

dotenv.config();

test.describe('Product List Display Verification', () => {
  let poManager: POManager;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
  });

  test('@QAAGENT-44 Verify that products are properly displayed on the home page', async () => {
    // Navigate to the home page
    await poManager.getHomepage().navigateToHomePage();
    
    // Verify the product container element is visible (products table body)
    await poManager.getHomepage().verifyProductTableBodyIsVisible();
    
    // Verify "Samsung galaxy s6" product is displayed in the product list
    await poManager.getHomepage().verifyProductIsDisplayed('Samsung galaxy s6');
  });
});