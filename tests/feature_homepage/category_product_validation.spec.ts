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
    test(`@QAAGENT-49 Verify that ${data.productName} is displayed correctly in ${data.categoryName} category`, async ({ page }) => {
      await poManager.getHomepage().clickCategory(data.categoryName);
      await poManager.getHomepage().verifyProductIsDisplayed(data.productName);
    });
  }
});