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

  test('@QAAGENT-44 Navigate to home page and verify product display functionality', async () => {
    const homePage = poManager.getHomepage();
    
    await homePage.navigateToHomePage();
    await homePage.verifyProductList();
    await homePage.verifyProductIsDisplayed('Samsung galaxy s6');
  });
});