import { test } from '@playwright/test';

import dotenv from 'dotenv';

import { TESTCONFIG } from '../../data/config/testconfig';
import { POManager } from '../../page-objects/POManager';

dotenv.config();

test.describe('@feature_homepage Product List Validation', () => {
  let poManager: POManager;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
  });

  test('@QAAGENT-44 Verify that products are properly displayed on the home page', async ({ page }) => {
    const homePage = poManager.getHomepage();
    
    // Navigate to the home page (/)
    await homePage.goToHomePage();
    
    // Verify the product container element is visible (products table body)
    await homePage.verifyProductList();
    
    // Verify "Samsung galaxy s6" product is displayed in the product list
    await homePage.verifyProductIsDisplayed('Samsung galaxy s6');
  });
});