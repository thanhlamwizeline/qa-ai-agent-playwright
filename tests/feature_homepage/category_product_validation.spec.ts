import { test, expect } from '@playwright/test';
import { POManager } from '../../page-objects/POManager';
import { TESTCONFIG } from '../../data/config/testconfig';

test.describe('Category Product Validation', () => {
  let poManager: POManager;

  const testData = [
    { categoryName: 'Phones', productName: 'Samsung galaxy s6' },
    { categoryName: 'Laptops', productName: 'Sony vaio i5' },
    { categoryName: 'Monitors', productName: 'Apple monitor 24' }
  ];

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
    await page.goto(`${process.env.BASE_URL_E2E}/${TESTCONFIG.FE_URL.URL_HOMEPAGE}`);
  });

  for (const data of testData) {
    test(`@QAAGENT-49 Verify that Product is displayed correctly according to Category ${data.categoryName}`, async ({ page }) => {
      await test.step('Navigate to Homepage', async () => {
        await page.goto(`${process.env.BASE_URL_E2E}/${TESTCONFIG.FE_URL.URL_HOMEPAGE}`);
      });

      await test.step(`Select Categories ${data.categoryName}`, async () => {
        await poManager.getHomepage().clickCategory(data.categoryName);
      });

      await test.step(`Verify ${data.productName} product is displayed in the product list`, async () => {
        await poManager.getHomepage().verifyProductIsDisplayed(data.productName);
      });
    });
  }
});