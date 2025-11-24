import { test } from '@playwright/test';

import dotenv from 'dotenv';

import { TESTCONFIG } from '../../data/config/testconfig';
import { POManager } from '../../page-objects/POManager';

dotenv.config();

test.describe('Product List Verification', () => {
  test.use({ storageState: 'playwright/.auth/user.json' });
  let poManager: POManager;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
  });

  test('@QAAGENT-44 Verify that products are properly displayed on the home page', async () => {
    const homePage = poManager.getHomepage();

    await homePage.goToHomePage();
    await homePage.verifyProductList();
    await homePage.verifyProductIsDisplayed('Samsung galaxy s6');
  });
});