import { test } from '@playwright/test';

import dotenv from 'dotenv';

import { TESTCONFIG } from '../../data/config/testconfig';
import { POManager } from '../../page-objects/POManager';

dotenv.config();

test.describe('Product List Validation', () => {
  let poManager: POManager;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
  });

  test('@QAAGENT-44 Navigate to home page and verify product container and Samsung galaxy s6 are displayed', async ({ page }) => {
    const homepage = poManager.getHomepage();
    
    // Navigate to the home page (/)
    await homepage.navigateToHomepage();
    
    // Verify the product container element is visible (products table body)
    await homepage.verifyProductList();
    
    // Verify "Samsung galaxy s6" product is displayed in the product list
    await homepage.verifyProductIsDisplayed('Samsung galaxy s6');
  });
});