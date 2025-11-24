import { test } from '@playwright/test';

import dotenv from 'dotenv';

import { TESTCONFIG } from '../../data/config/testconfig';
import { POManager } from '../../page-objects/POManager';

dotenv.config();

test.describe('@feature_homepage Product List Verification', () => {
  let poManager: POManager;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
  });

  test('@QAAGENT-44 Verify that products are properly displayed on the home page', async () => {
    const homePage = poManager.getHomepage();

    await homePage.navigateToHomePage();
    await homePage.verifyProductTableBodyVisible();
    await homePage.verifyProductIsDisplayed('Samsung galaxy s6');
  });
});