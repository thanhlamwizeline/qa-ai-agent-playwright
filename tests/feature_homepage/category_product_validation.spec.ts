import { test } from '@playwright/test';

import dotenv from 'dotenv';

import { TESTCONFIG } from '../../data/config/testconfig';
import { POManager } from '../../page-objects/POManager';

dotenv.config();

test.describe('@feature_homepage Category Product Validation', () => {
  let poManager: POManager;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
    await poManager.getHomepage().navigateToHomepage();
  });

  test('@QAAGENT-44 Verify that Product is displayed correctly according to selected Category', async () => {
    const homePage = poManager.getHomepage();

    // Select Categories "Phones" and verify "Samsung galaxy s6" product is displayed
    await homePage.clickCategory('Phones');
    await homePage.verifyProductIsDisplayed('Samsung galaxy s6');

    // Select Categories "Laptops" and verify "Sony vaio i5" product is displayed  
    await homePage.clickCategory('Laptops');
    await homePage.verifyProductIsDisplayed('Sony vaio i5');

    // Select Categories "Monitors" and verify "Apple monitor 24" product is displayed
    await homePage.clickCategory('Monitors');
    await homePage.verifyProductIsDisplayed('Apple monitor 24');
  });
});