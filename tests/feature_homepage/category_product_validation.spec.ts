import { test } from '@playwright/test';

import dotenv from 'dotenv';

import { TESTCONFIG } from '../../data/config/testconfig';
import { POManager } from '../../page-objects/POManager';

dotenv.config();

test.describe('@feature_homepage Category Product Validation', () => {
  let poManager: POManager;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
    await page.goto(`${process.env.BASE_URL_E2E}/${TESTCONFIG.FE_URL.URL_HOMEPAGE}`);
  });

  test('@QAAGENT-46 Verify that Product is displayed correctly according to selected Category', async () => {
    const homePage = poManager.getHomepage();

    await homePage.clickCategory('Phones');
    await homePage.verifyProductIsDisplayed('Samsung galaxy s6');

    await homePage.clickCategory('Laptops');
    await homePage.verifyProductIsDisplayed('Sony vaio i5');

    await homePage.clickCategory('Monitors');
    await homePage.verifyProductIsDisplayed('Apple monitor 24');
  });
});