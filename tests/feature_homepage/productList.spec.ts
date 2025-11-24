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

  test('@QAAGENT-44 Verify products are properly displayed on the home page', async ({ page }) => {
    const homePage = poManager.getHomepage();
    
    await homePage.navigateToHomepage();
    await homePage.verifyProductsTableBodyVisible();
    await homePage.verifyProductIsDisplayed('Samsung galaxy s6');
  });
});