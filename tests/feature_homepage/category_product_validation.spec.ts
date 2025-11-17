import { test, expect } from '@playwright/test';
import { POManager } from '../../page-objects/POManager';

interface TestData {
  categoryName: string;
  productName: string;
}

const testData: TestData[] = [
  { categoryName: 'Phones', productName: 'Samsung galaxy s6' },
  { categoryName: 'Laptops', productName: 'Sony vaio i5' },
  { categoryName: 'Monitors', productName: 'Apple monitor 24' }
];

test.describe('Category Product Validation', () => {
  let poManager: POManager;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
  });

  for (const data of testData) {
    test(`@QAAGENT-49 Verify that ${data.productName} is displayed correctly in ${data.categoryName} category`, async ({ page }) => {
      await poManager.getHomepage().navigateToHomepage();
      await poManager.getHomepage().clickCategory(data.categoryName);
      await poManager.getHomepage().verifyProductIsDisplayed(data.productName);
    });
  }
});