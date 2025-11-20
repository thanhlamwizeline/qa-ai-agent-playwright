import { test } from '@playwright/test';

import dotenv from 'dotenv';

import { TESTCONFIG } from '../../data/config/testconfig';
import { CATEGORIES_PRODUCTS } from '../../data/homepage/categories_products';
import { POManager } from '../../page-objects/POManager';

dotenv.config();

test.describe('@feature_homepage Category Product Validation', () => {
  let poManager: POManager;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
  });

  test('@QAAGENT-57 Verify that Product is displayed correctly according to Category Phones', async () => {
    const testData = CATEGORIES_PRODUCTS[0];
    const homePage = poManager.getHomepage();

    await homePage.navigateToHomepage();
    await homePage.clickCategory(testData.categoryName);
    await homePage.verifyProductIsDisplayed(testData.productName);
  });

  test('@QAAGENT-57 Verify that Product is displayed correctly according to Category Laptops', async () => {
    const testData = CATEGORIES_PRODUCTS[1];
    const homePage = poManager.getHomepage();

    await homePage.navigateToHomepage();
    await homePage.clickCategory(testData.categoryName);
    await homePage.verifyProductIsDisplayed(testData.productName);
  });

  test('@QAAGENT-57 Verify that Product is displayed correctly according to Category Monitors', async () => {
    const testData = CATEGORIES_PRODUCTS[2];
    const homePage = poManager.getHomepage();

    await homePage.navigateToHomepage();
    await homePage.clickCategory(testData.categoryName);
    await homePage.verifyProductIsDisplayed(testData.productName);
  });
});