import { test, expect } from '@playwright/test';

import { TESTCONFIG } from '../../data/config/testconfig';
import { CATEGORIES_PRODUCTS } from '../../data/homepage/categories_products';
import { POManager } from '../../page-objects/POManager';

let poManager: POManager;

test.describe('Category Product Validation', () => {
  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
    await page.goto(`${process.env.BASE_URL_E2E}/${TESTCONFIG.FE_URL.URL_HOMEPAGE}`);
  });

  CATEGORIES_PRODUCTS.forEach((testData) => {
    test(`@QAAGENT-57 Verify that Product is displayed correctly according to Category ${testData.categoryName}`, async ({ page }) => {
      await test.step('I navigate to Homepage', async () => {
        await expect(page).toHaveURL(new RegExp(`${TESTCONFIG.FE_URL.URL_HOMEPAGE}`));
      });

      await test.step(`I select Categories ${testData.categoryName}`, async () => {
        await poManager.getHomepage().clickCategory(testData.categoryName);
      });

      await test.step(`Verify ${testData.productName} product is displayed in the product list`, async () => {
        await poManager.getHomepage().verifyProductIsDisplayed(testData.productName);
      });
    });
  });
});