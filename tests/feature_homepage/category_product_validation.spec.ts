import { test, expect } from '@playwright/test';
import { POManager } from '../../page-objects/POManager';

test.describe('Category Product Validation', () => {
  let poManager: POManager;

  const testData = [
    { categoryName: 'Phones', productName: 'Samsung galaxy s6' },
    { categoryName: 'Laptops', productName: 'Sony vaio i5' },
    { categoryName: 'Monitors', productName: 'Apple monitor 24' }
  ];

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
  });

  for (const data of testData) {
    test(`@QAAGENT-49 Verify that Product is displayed correctly according to Category ${data.categoryName}`, async ({ page }) => {
      await poManager.getHomepage().navigateToHomepage();
      await poManager.getHomepage().clickCategory(data.categoryName);
      await poManager.getHomepage().verifyProductIsDisplayed(data.productName);
    });
  }
});