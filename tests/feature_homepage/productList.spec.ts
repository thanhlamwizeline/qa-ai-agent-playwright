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

  test('@QAAGENT-44 Navigate to home page and verify product container visibility', async ({ page }) => {
    const homepage = poManager.getHomepage();
    
    await homepage.navigateToHomepage();
    await homepage.verifyProductList();
  });

  test('@QAAGENT-44 Verify product container element is visible', async ({ page }) => {
    const homepage = poManager.getHomepage();
    
    await homepage.navigateToHomepage();
    await homepage.verifyProductList();
  });

  test('@QAAGENT-44 Verify Samsung galaxy s6 product is displayed in the product list', async ({ page }) => {
    const homepage = poManager.getHomepage();
    
    await homepage.navigateToHomepage();
    await homepage.verifyProductList();
    await homepage.verifyProductIsDisplayed('Samsung galaxy s6');
  });
});