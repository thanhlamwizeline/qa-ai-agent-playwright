import { test, expect } from '@playwright/test';
import { POManager } from '../../page-objects/POManager';

interface CategoryProductData {
  categoryName: string;
  productName: string;
}

const testData: CategoryProductData[] = [
  { categoryName: 'Phones', productName: 'Samsung galaxy s6' },
  { categoryName: 'Laptops', productName: 'Sony vaio i5' },
  { categoryName: 'Monitors', productName: 'Apple monitor 24' }
];

test.describe('Category Product Validation Tests', () => {
  let poManager: POManager;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
  });

  for (const data of testData) {
    test(`@QAAGENT-49 Verify that Product is displayed correctly according to Category ${data.categoryName}`, async ({ page }) => {
      await test.step('Navigate to Homepage', async () => {
        await poManager.getHomepage().navigateToHomepage();
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