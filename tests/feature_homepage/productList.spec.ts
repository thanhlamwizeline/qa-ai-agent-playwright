import { test, expect } from '@playwright/test';
import { POManager } from '../../page-objects/POManager';
import { TESTCONFIG } from '../../data/config/testconfig';

test.describe('Product List Verification', () => {
  let poManager: POManager;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
  });

  test('@ITA-2 Verify that products are properly displayed on the home page', async ({ page }) => {
    await poManager.getHomepage().goToHomePage();
    await poManager.getHomepage().verifyProductTableBodyVisible();
    await poManager.getHomepage().verifyProductIsDisplayed('Samsung galaxy s6');
  });
});