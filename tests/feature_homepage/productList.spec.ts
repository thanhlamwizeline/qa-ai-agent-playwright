import { test } from '@playwright/test';

import dotenv from 'dotenv';

import { TESTCONFIG } from '../../data/config/testconfig';
import { POManager } from '../../page-objects/POManager';

dotenv.config();

test.describe('@feature_homepage Product List Validation', () => {
  let poManager: POManager;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
  });

  test('@QAAGENT-57 Navigate to the home page', async () => {
    const homePage = poManager.getHomepage();
    await homePage.goToHomePage();
  });

  test('@QAAGENT-57 Verify the product container element is visible', async () => {
    const homePage = poManager.getHomepage();
    await homePage.goToHomePage();
    await homePage.verifyProductList();
  });

  test('@QAAGENT-57 Verify Samsung galaxy s6 product is displayed in the product list', async () => {
    const homePage = poManager.getHomepage();
    await homePage.goToHomePage();
    await homePage.verifyProductIsDisplayed('Samsung galaxy s6');
  });
});