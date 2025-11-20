import { test, expect } from '@playwright/test';
import { POManager } from '../../page-objects/POManager';

test.describe('Category Product Validation', () => {
  let poManager: POManager;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
    await page.goto(`${process.env.BASE_URL_E2E}/`);
  });

  test('@QAAGENT-46 Verify that Product is displayed correctly according to selected Category', async ({ page }) => {
    // Navigate to homepage and select Phones category
    await poManager.getHomepage().clickCategory('Phones');
    await poManager.getHomepage().verifyProductIsDisplayed('Samsung galaxy s6');

    // Select Laptops category
    await poManager.getHomepage().clickCategory('Laptops');
    await poManager.getHomepage().verifyProductIsDisplayed('Sony vaio i5');

    // Select Monitors category
    await poManager.getHomepage().clickCategory('Monitors');
    await poManager.getHomepage().verifyProductIsDisplayed('Apple monitor 24');
  });
});