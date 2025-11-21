import { test, expect } from '@playwright/test';

import dotenv from 'dotenv';

import { TESTCONFIG } from '../../data/config/testconfig';
import { POManager } from '../../page-objects/POManager';

dotenv.config();

test.describe('Category Product Validation', () => {
  let poManager: POManager;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
    await page.goto(`${process.env.BASE_URL_E2E}/${TESTCONFIG.FE_URL.URL_HOMEPAGE}`);
  });

  test('@QAAGENT-59 Verify that Product is displayed correctly according to selected Category', async () => {
    const homepage = poManager.getHomepage();

    // Navigate to Homepage (already done in beforeEach)
    
    // Select Categories "Phones" and verify Samsung galaxy s6
    await homepage.clickCategory('Phones');
    await homepage.verifyProductIsDisplayed('Samsung galaxy s6');
    
    // Select Categories "Laptops" and verify Sony vaio i5
    await homepage.clickCategory('Laptops');
    await homepage.verifyProductIsDisplayed('Sony vaio i5');
    
    // Select Categories "Monitors" and verify Apple monitor 24
    await homepage.clickCategory('Monitors');
    await homepage.verifyProductIsDisplayed('Apple monitor 24');
  });
});