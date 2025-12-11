import { test } from '@playwright/test';

import dotenv from 'dotenv';

import { CATEGORIES_PRODUCTS } from '../../data/homepage/categories_products';
import { POManager } from '../../page-objects/POManager';

dotenv.config();

test.describe('@feature_homepage Category Product Validation', () => {
  test.use({ storageState: 'playwright/.auth/user.json' });
  let poManager: POManager;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
  });

  for (const categoryProduct of CATEGORIES_PRODUCTS) {
    test(`@QAAGENT-49 Verify that Product is displayed correctly according to Category ${categoryProduct.categoryName}`, async () => {
      const homePage = poManager.getHomepage();

      await test.step('I navigate to Homepage', async () => {
        await homePage.navigateToHomepage();
      });

      await test.step(`I select Categories ${categoryProduct.categoryName}`, async () => {
        await homePage.clickCategory(categoryProduct.categoryName);
      });

      await test.step(`Verify ${categoryProduct.productName} product is displayed in the product list`, async () => {
        await homePage.verifyProductIsDisplayed(categoryProduct.productName);
      });
    });
  }
});