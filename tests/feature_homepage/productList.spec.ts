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

  test('@QAAGENT-44 Navigate to the home page', async () => {
    const homePage = poManager.getHomepage();
    await homePage.navigateToHomePage();
  });

  test('@QAAGENT-44 Verify the product container element is visible', async () => {
    const homePage = poManager.getHomepage();
    await homePage.navigateToHomePage();
    await homePage.verifyProductList();
  });

  test('@QAAGENT-44 Verify Samsung galaxy s6 product is displayed in the product list', async () => {
    const homePage = poManager.getHomepage();
    await homePage.navigateToHomePage();
    await homePage.verifyProductIsDisplayed('Samsung galaxy s6');
  });
});