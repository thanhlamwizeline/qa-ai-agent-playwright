import { test } from '@playwright/test';

import { POManager } from '../../page-objects/POManager';
import { categoryProductTestData, CategoryProductData } from '../../data/homepage/categoryProduct';

test.describe('Category Product Validation', () => {

  for (const testData of categoryProductTestData) {
    test(`@QAAGENT-50 Verify that Product is displayed correctly according to Category ${testData.categoryName}`, async ({ page }) => {
      const poManager = new POManager(page);
      const homepage = poManager.getHomepage();

      await test.step('Navigate to Homepage', async () => {
        await homepage.navigateToHomepage();
      });

      await test.step(`Select Categories ${testData.categoryName}`, async () => {
        await homepage.clickCategory(testData.categoryName);
      });

      await test.step(`Verify ${testData.productName} product is displayed in the product list`, async () => {
        await homepage.verifyProductIsDisplayed(testData.productName);
      });
    });
  }

});