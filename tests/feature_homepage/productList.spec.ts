import { test, expect } from '@playwright/test';

import { POManager } from '../../page-objects/POManager';

test.describe('Product List Display', () => {
  let poManager: POManager;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
  });

  test('@QAAGENT-57 Verify that products are properly displayed on the home page', async ({ page }) => {
    await test.step('Navigate to the home page (/)', async () => {
      await poManager.getHomepage().goToHomePage();
    });

    await test.step('Verify the product container element is visible (products table body)', async () => {
      await poManager.getHomepage().verifyProductTableBodyIsVisible();
    });

    await test.step('Verify "Samsung galaxy s6" product is displayed in the product list', async () => {
      await poManager.getHomepage().verifyProductIsDisplayed('Samsung galaxy s6');
    });
  });
});