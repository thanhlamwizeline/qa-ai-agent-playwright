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

  test('@QAAGENT-56 Verify that products are properly displayed on the home page', async ({ page }) => {
    const homePage = poManager.getHomepage();

    await test.step('Navigate to the home page', async () => {
      await homePage.navigateToHomePage();
    });

    await test.step('Verify the product container element is visible (products table body)', async () => {
      await homePage.verifyProductList();
    });

    await test.step('Verify "Samsung galaxy s6" product is displayed in the product list', async () => {
      await homePage.verifyProductIsDisplayed('Samsung galaxy s6');
    });
  });
});