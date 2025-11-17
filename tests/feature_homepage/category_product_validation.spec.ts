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

  test('@QAAGENT-49 Verify that Product is displayed correctly according to Category Phones', async ({ page }) => {
    const testCase = testData[0];
    
    await poManager.getHomepage().navigateToHomepage();
    await poManager.getHomepage().clickCategory(testCase.categoryName);
    await poManager.getHomepage().verifyProductIsDisplayed(testCase.productName);
  });

  test('@QAAGENT-49 Verify that Product is displayed correctly according to Category Laptops', async ({ page }) => {
    const testCase = testData[1];
    
    await poManager.getHomepage().navigateToHomepage();
    await poManager.getHomepage().clickCategory(testCase.categoryName);
    await poManager.getHomepage().verifyProductIsDisplayed(testCase.productName);
  });

  test('@QAAGENT-49 Verify that Product is displayed correctly according to Category Monitors', async ({ page }) => {
    const testCase = testData[2];
    
    await poManager.getHomepage().navigateToHomepage();
    await poManager.getHomepage().clickCategory(testCase.categoryName);
    await poManager.getHomepage().verifyProductIsDisplayed(testCase.productName);
  });
});