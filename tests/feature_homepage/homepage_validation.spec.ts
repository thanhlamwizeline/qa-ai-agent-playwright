import { test } from '@playwright/test';

import dotenv from 'dotenv';

import { TESTCONFIG } from '../../data/config/testconfig';
import { CATEGORIES as homepageCategories } from '../../data/homepage/categories.ts';
import { POManager } from '../../page-objects/POManager';

dotenv.config();

test.describe('@feature_homepage ', () => {
  test.use({ storageState: 'playwright/.auth/user.json' });
  let poManager: POManager;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
    await page.goto(`${process.env.BASE_URL_E2E}/${TESTCONFIG.FE_URL.URL_HOMEPAGE}`);
  });

  test('Homepage is loaded with Carousel, Category menu and Product list', async () => {
    const homePage = poManager.getHomepage();

    await homePage.verifyCarouselIsVisible();
    await homePage.verifyCatergoryMenuContainsCorrectItems(homepageCategories);
    await homePage.verifyProductListIsVisible();
  });

});

test.describe('Product Display Validation', () => {
  test.use({ storageState: 'playwright/.auth/user.json' });
  let poManager: POManager;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
  });

  test('@QAAGENT-71 should verify products are properly displayed on home page', async () => {
    const homePage = poManager.getHomepage();

    await homePage.navigateToHomePage();
    await homePage.verifyProductList();
    await homePage.verifyProductIsDisplayed('Samsung galaxy s6');
  });

});