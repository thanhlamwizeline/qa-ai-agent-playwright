import { test, expect } from '@playwright/test';
import { POManager } from '../../page-objects/POManager';

test.describe('Category Product Validation', () => {
  let poManager: POManager;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
  });

  test('@QAAGENT-49 Verify Samsung galaxy s6 product is displayed correctly according to Phones category', async ({ page }) => {
    await poManager.getHomepage().navigateToHomepage();
    await poManager.getHomepage().clickCategory('Phones');
    await poManager.getHomepage().verifyProductIsDisplayed('Samsung galaxy s6');
  });

  test('@QAAGENT-49 Verify Sony vaio i5 product is displayed correctly according to Laptops category', async ({ page }) => {
    await poManager.getHomepage().navigateToHomepage();
    await poManager.getHomepage().clickCategory('Laptops');
    await poManager.getHomepage().verifyProductIsDisplayed('Sony vaio i5');
  });

  test('@QAAGENT-49 Verify Apple monitor 24 product is displayed correctly according to Monitors category', async ({ page }) => {
    await poManager.getHomepage().navigateToHomepage();
    await poManager.getHomepage().clickCategory('Monitors');
    await poManager.getHomepage().verifyProductIsDisplayed('Apple monitor 24');
  });
});