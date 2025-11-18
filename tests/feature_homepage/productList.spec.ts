import { test, expect } from '@playwright/test';
import { POManager } from '../../page-objects/POManager';

test.describe('Home Page Product List Validation', () => {
  let poManager: POManager;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
  });

  test('@QAAGENT-44 Verify that products are properly displayed on the home page', async ({ page }) => {
    const homepage = poManager.getHomepage();
    
    await homepage.navigateToHomePage();
    await homepage.verifyProductListIsVisible();
    await homepage.verifyProductIsDisplayed('Samsung galaxy s6');
  });
});