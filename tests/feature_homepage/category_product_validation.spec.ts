import { test, expect } from '@playwright/test';

import { CATEGORIES_PRODUCTS } from '../../data/homepage/categories_products';
import { POManager } from '../../page-objects/POManager';

test.describe('Category Product Validation', () => {
  let poManager: POManager;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
  });

  for (const scenario of CATEGORIES_PRODUCTS) {
    test(`@QAAGENT-57 Verify that Product is displayed correctly according to Category ${scenario.categoryName}`, async ({ page }) => {
      await test.step('I navigate to Homepage', async () => {
        await poManager.getHomepage().navigateToHomepage();
      });

      await test.step(`I select Categories ${scenario.categoryName}`, async () => {
        await poManager.getHomepage().clickCategory(scenario.categoryName);
      });

      await test.step(`Verify ${scenario.productName} product is displayed in the product list`, async () => {
        await poManager.getHomepage().verifyProductIsDisplayed(scenario.productName);
      });
    });
  }
});