import { test, expect } from '@playwright/test';

import { CATEGORIES_PRODUCTS } from '../../data/homepage/categories_products';
import { POManager } from '../../page-objects/POManager';

test.describe('Category Product Validation', () => {
  let poManager: POManager;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
  });

  for (const testData of CATEGORIES_PRODUCTS) {
    test(`@QAAGENT-49 Verify that Product is displayed correctly according to Category ${testData.categoryName}`, async ({ page }) => {
      await test.step('I navigate to Homepage', async () => {
        await poManager.getHomepage().navigateToHomepage();
      });

      await test.step(`I select Categories ${testData.categoryName}`, async () => {
        await poManager.getHomepage().clickCategory(testData.categoryName);
      });

      await test.step(`Verify ${testData.productName} product is displayed in the product list`, async () => {
        await poManager.getHomepage().verifyProductIsDisplayed(testData.productName);
      });
    });
  }
});