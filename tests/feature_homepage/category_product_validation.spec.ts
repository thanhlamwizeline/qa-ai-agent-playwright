import { test, expect } from '@playwright/test';
import { POManager } from '../../page-objects/POManager';

test.describe('Category Product Validation', () => {
  let poManager: POManager;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
    await page.goto(`${process.env.BASE_URL_E2E}`);
  });

  test('@QAAGENT-46 Verify that Product is displayed correctly according to selected Category', async ({ page }) => {
    // Navigate to Homepage (already done in beforeEach)
    
    // Select Categories "Phones" and verify "Samsung galaxy s6" product is displayed
    await poManager.getHomepage().clickCategory('Phones');
    await poManager.getHomepage().verifyProductIsDisplayed('Samsung galaxy s6');

    // Select Categories "Laptops" and verify "Sony vaio i5" product is displayed  
    await poManager.getHomepage().clickCategory('Laptops');
    await poManager.getHomepage().verifyProductIsDisplayed('Sony vaio i5');

    // Select Categories "Monitors" and verify "Apple monitor 24" product is displayed
    await poManager.getHomepage().clickCategory('Monitors');
    await poManager.getHomepage().verifyProductIsDisplayed('Apple monitor 24');
  });
});