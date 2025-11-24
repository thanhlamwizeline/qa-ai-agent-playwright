import { test, expect } from '@playwright/test';

import dotenv from 'dotenv';

import { TESTCONFIG } from '../../data/config/testconfig';
import { POManager } from '../../page-objects/POManager';

dotenv.config();

test.describe('@feature_homepage Product List Validation', () => {
  let poManager: POManager;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
  });

  test('@QAAGENT-44 Navigate to the home page', async ({ page }) => {
    await page.goto(`${process.env.BASE_URL_E2E}/${TESTCONFIG.FE_URL.URL_HOMEPAGE}`);
    await expect(page).toHaveURL(new RegExp(`.*${TESTCONFIG.FE_URL.URL_HOMEPAGE}`));
  });

  test('@QAAGENT-44 Verify the product container element is visible', async ({ page }) => {
    await page.goto(`${process.env.BASE_URL_E2E}/${TESTCONFIG.FE_URL.URL_HOMEPAGE}`);
    const homePage = poManager.getHomepage();
    await homePage.verifyProductTableBodyVisible();
  });

  test('@QAAGENT-44 Verify Samsung galaxy s6 product is displayed in the product list', async ({ page }) => {
    await page.goto(`${process.env.BASE_URL_E2E}/${TESTCONFIG.FE_URL.URL_HOMEPAGE}`);
    const homePage = poManager.getHomepage();
    await homePage.verifyProductIsDisplayed('Samsung galaxy s6');
  });
});