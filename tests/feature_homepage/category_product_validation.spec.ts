import { test, expect } from '@playwright/test';
import { POManager } from '../../page-objects/POManager';
import { categoryProductData, CategoryProductData } from '../../data/homepage/categoryProduct';

test.describe('Category Product Validation', () => {
  let poManager: POManager;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
  });

  categoryProductData.forEach((data: CategoryProductData) => {
    test(`@QAAGENT-50 Verify that Product is displayed correctly according to Category ${data.categoryName}`, async ({ page }) => {
      await poManager.getHomepage().navigateToHomepage();
      await poManager.getHomepage().clickCategory(data.categoryName);
      await poManager.getHomepage().verifyProductIsDisplayed(data.productName);
    });
  });
});