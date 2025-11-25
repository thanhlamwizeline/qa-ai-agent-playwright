import { test } from '@playwright/test';

import dotenv from 'dotenv';

import { TESTCONFIG } from '../../data/config/testconfig';
import { POManager } from '../../page-objects/POManager';

dotenv.config();

test.describe('@QAAGENT-44 Product List Verification', () => {
  let poManager: POManager;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
  });

  test('@QAAGENT-44 Verify that products are properly displayed on the home page', async () => {
    const homePage = poManager.getHomepage();
    
    await homePage.navigateToHomePage();
    await homePage.verifyProductContainerIsVisible();
    await homePage.verifyProductIsDisplayed('Samsung galaxy s6');
  });
});