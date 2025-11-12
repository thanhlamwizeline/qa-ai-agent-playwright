import { test, expect } from '@playwright/test';
import { POManager } from '../../page-objects/POManager';

test.describe('Category Product Validation', () => {
  let poManager: POManager;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
  });

  test('@QAAGENT-49 Verify that Product is displayed correctly according to Category Phones', async ({ page }) => {
    await poManager.getHomepage().navigateToHomepage();
    await poManager.getHomepage().clickCategory('Phones');
    await poManager.getHomepage().verifyProductIsDisplayed('Samsung galaxy s6');
  });

  test('@QAAGENT-49 Verify that Product is displayed correctly according to Category Laptops', async ({ page }) => {
    await poManager.getHomepage().navigateToHomepage();
    await poManager.getHomepage().clickCategory('Laptops');
    await poManager.getHomepage().verifyProductIsDisplayed('Sony vaio i5');
  });

  test('@QAAGENT-49 Verify that Product is displayed correctly according to Category Monitors', async ({ page }) => {
    await poManager.getHomepage().navigateToHomepage();
    await poManager.getHomepage().clickCategory('Monitors');
    await poManager.getHomepage().verifyProductIsDisplayed('Apple monitor 24');
  });
});