import { test } from '@playwright/test';

import dotenv from 'dotenv';

import { CATEGORIES_PRODUCTS } from '../../data/homepage/categories_products';
import { TESTCONFIG } from '../../data/config/testconfig';
import { POManager } from '../../page-objects/POManager';

dotenv.config();

test.describe('@feature_homepage', () => {
  let poManager: POManager;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
  });

  for (const categoryProduct of CATEGORIES_PRODUCTS) {
    test(`@QAAGENT-49 Verify that ${categoryProduct.productName} product is displayed correctly according to Category ${categoryProduct.categoryName}`, async () => {
      const homePage = poManager.getHomepage();

      // Step 1: Navigate to Homepage
      await homePage.navigateToHomepage();

      // Step 2: Select Categories {categoryName}
      await homePage.clickCategory(categoryProduct.categoryName);

      // Step 3: Verify {productName} product is displayed in the product list
      await homePage.verifyProductIsDisplayed(categoryProduct.productName);
    });
  }
});