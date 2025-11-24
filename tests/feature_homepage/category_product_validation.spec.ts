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
    const baseUrl = process.env.BASE_URL_E2E || 'https://www.demoblaze.com';
    const homepageUrl = TESTCONFIG.FE_URL.URL_HOMEPAGE || '';
    const fullUrl = homepageUrl ? `${baseUrl}/${homepageUrl}` : baseUrl;
    await page.goto(fullUrl);
  });

  for (const categoryProduct of CATEGORIES_PRODUCTS) {
    test(`@QAAGENT-49 Verify that Product is displayed correctly according to Category ${categoryProduct.categoryName}`, async () => {
      const homepage = poManager.getHomepage();
      
      await homepage.clickCategory(categoryProduct.categoryName);
      await homepage.verifyProductIsDisplayed(categoryProduct.productName);
    });
  }
});