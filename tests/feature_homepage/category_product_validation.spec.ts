import { test } from '@playwright/test';

import dotenv from 'dotenv';

import { TESTCONFIG } from '../../data/config/testconfig';
import { CATEGORIES_PRODUCTS } from '../../data/homepage/categories_products';
import { POManager } from '../../page-objects/POManager';

dotenv.config();

test.describe('@feature_homepage Category Product Validation', () => {
  test.use({ storageState: 'playwright/.auth/user.json' });
  let poManager: POManager;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
  });

  for (const testData of CATEGORIES_PRODUCTS) {
    test(`@QAAGENT-57 Verify that Product is displayed correctly according to Category ${testData.categoryName}`, async () => {
      const homePage = poManager.getHomepage();

      await test.step('I navigate to Homepage', async () => {
        await homePage.navigateToHomepage();
      });

      await test.step(`I select Categories ${testData.categoryName}`, async () => {
        await homePage.clickCategory(testData.categoryName);
      });

      await test.step(`Verify ${testData.productName} product is displayed in the product list`, async () => {
        await homePage.verifyProductIsDisplayed(testData.productName);
      });
    });
  }
});