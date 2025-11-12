import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

import { POManager } from '../../page-objects/POManager';
import { TESTCONFIG } from '../../data/config/testconfig';

dotenv.config();

let poManager: POManager;

test.describe('Category Product Validation', () => {
  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
    await page.goto(`${process.env.BASE_URL_E2E}/${TESTCONFIG.FE_URL.URL_HOMEPAGE}`);
  });

  test('@QAAGENT-49 Verify Samsung galaxy s6 product is displayed correctly in Phones category', async ({ page }) => {
    const categoryName = 'Phones';
    const productName = 'Samsung galaxy s6';

    await poManager.getHomepage().clickCategory(categoryName);
    await poManager.getHomepage().verifyProductIsDisplayed(productName);
  });

  test('@QAAGENT-49 Verify Sony vaio i5 product is displayed correctly in Laptops category', async ({ page }) => {
    const categoryName = 'Laptops';
    const productName = 'Sony vaio i5';

    await poManager.getHomepage().clickCategory(categoryName);
    await poManager.getHomepage().verifyProductIsDisplayed(productName);
  });

  test('@QAAGENT-49 Verify Apple monitor 24 product is displayed correctly in Monitors category', async ({ page }) => {
    const categoryName = 'Monitors';
    const productName = 'Apple monitor 24';

    await poManager.getHomepage().clickCategory(categoryName);
    await poManager.getHomepage().verifyProductIsDisplayed(productName);
  });
});