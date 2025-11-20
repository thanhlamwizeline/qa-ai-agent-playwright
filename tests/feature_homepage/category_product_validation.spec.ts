import { test, expect } from '@playwright/test';

import { CATEGORIES_PRODUCTS } from '../../data/homepage/categories_products';
import { POManager } from '../../page-objects/POManager';

let poManager: POManager;

test.describe('Category Product Validation', () => {
  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
  });

  for (const data of CATEGORIES_PRODUCTS) {
    test(`@QAAGENT-57 Verify that Product is displayed correctly according to Category ${data.categoryName}`, async () => {
      await poManager.getHomepage().navigateToHomepage();
      await poManager.getHomepage().clickCategory(data.categoryName);
      await poManager.getHomepage().verifyProductIsDisplayed(data.productName);
    });
  }
});