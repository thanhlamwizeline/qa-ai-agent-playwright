import { test, expect } from '@playwright/test';

import { TESTCONFIG } from '../../data/config/testconfig';
import { POManager } from '../../page-objects/POManager';

test.describe('Category Product Validation', () => {
  let poManager: POManager;

  test.use({
    storageState: 'playwright/.auth/user.json'
  });

  test('@QAAGENT-46 Verify that Product is displayed correctly according to selected Category', async ({ page }) => {
    poManager = new POManager(page);

    await test.step('Navigate to Homepage', async () => {
      await poManager.getHomepage().navigateToHomepage();
    });

    await test.step('Select Categories "Phones" and verify "Samsung galaxy s6" product is displayed', async () => {
      await poManager.getHomepage().clickCategory('Phones');
      await poManager.getHomepage().verifyProductIsDisplayed('Samsung galaxy s6');
    });

    await test.step('Select Categories "Laptops" and verify "Sony vaio i5" product is displayed', async () => {
      await poManager.getHomepage().clickCategory('Laptops');
      await poManager.getHomepage().verifyProductIsDisplayed('Sony vaio i5');
    });

    await test.step('Select Categories "Monitors" and verify "Apple monitor 24" product is displayed', async () => {
      await poManager.getHomepage().clickCategory('Monitors');
      await poManager.getHomepage().verifyProductIsDisplayed('Apple monitor 24');
    });
  });
});