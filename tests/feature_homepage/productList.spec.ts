import { test } from '@playwright/test';

import dotenv from 'dotenv';

import { TESTCONFIG } from '../../data/config/testconfig';
import { POManager } from '../../page-objects/POManager';

dotenv.config();

test.describe('Product List Display Verification', () => {
  let poManager: POManager;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
    await poManager.getHomepage().navigateToHomepage();
  });

  test('@QAAGENT-44 Verify that products are properly displayed on the home page', async () => {
    const homepage = poManager.getHomepage();
    
    // Verify the product container element is visible (products table body)
    await homepage.verifyProductList();
    
    // Verify "Samsung galaxy s6" product is displayed in the product list
    await homepage.verifyProductIsDisplayed('Samsung galaxy s6');
  });
});