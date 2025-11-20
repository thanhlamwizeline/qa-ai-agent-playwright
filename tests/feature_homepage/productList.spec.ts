import { test, expect } from '@playwright/test';

import { TESTCONFIG } from '../../data/config/testconfig';
import { POManager } from '../../page-objects/POManager';

test.describe('Product List Verification', () => {
  let poManager: POManager;

  test('@QAAGENT-44 Verify products are properly displayed on the home page', async ({ page }) => {
    poManager = new POManager(page);

    await test.step('Navigate to the home page', async () => {
      await page.goto(`${process.env.BASE_URL_E2E}/${TESTCONFIG.FE_URL.URL_HOMEPAGE}`);
    });

    await test.step('Verify the product container element is visible', async () => {
      await poManager.getHomepage().verifyProductListIsVisible();
    });

    await test.step('Verify Samsung galaxy s6 product is displayed in the product list', async () => {
      await poManager.getHomepage().verifyProductIsDisplayed('Samsung galaxy s6');
    });
  });
});