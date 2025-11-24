import { test } from '@playwright/test';

import dotenv from 'dotenv';

import { CATEGORIES_PRODUCTS } from '../../data/homepage/categories_products';
import { POManager } from '../../page-objects/POManager';

dotenv.config();

test.describe('Category Product Validation', () => {
  let poManager: POManager;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
  });

  CATEGORIES_PRODUCTS.forEach((testData) => {
    test(`@QAAGENT-49 Verify that Product is displayed correctly according to Category ${testData.categoryName}`, async () => {
      const homePage = poManager.getHomepage();
      
      await homePage.navigateToHomepage();
      await homePage.clickCategory(testData.categoryName);
      await homePage.verifyProductIsDisplayed(testData.productName);
    });
  });
});