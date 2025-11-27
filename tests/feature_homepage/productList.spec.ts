import { test } from '@playwright/test';

import dotenv from 'dotenv';

import { TESTCONFIG } from '../../data/config/testconfig';
import { POManager } from '../../page-objects/POManager';

dotenv.config();

test.describe('@feature_homepage Product List Verification', () => {
  let poManager: POManager;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
  });

  test('@QAAGENT-44 Verify products are properly displayed on the home page', async () => {
    const homePage = poManager.getHomepage();
    
    // Step 1: Navigate to the home page (/)
    await homePage.navigateToHomePage();
    
    // Step 2: Verify the product container element is visible (products table body)
    await homePage.verifyProductList();
    
    // Step 3: Verify "Samsung galaxy s6" product is displayed in the product list
    await homePage.verifyProductIsDisplayed('Samsung galaxy s6');
  });
});