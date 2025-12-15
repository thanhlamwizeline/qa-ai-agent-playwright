import { test } from '@playwright/test';

import dotenv from 'dotenv';

import { POManager } from '../../../../../page-objects/POManager';

dotenv.config();

test.describe('@planSpec-detail-page ViewGallery Component Tests', () => {
  let poManager: POManager;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
  });

  test('@QAAGENT-70 Verify if a page details shows a gallery component', async ({ page }) => {
    const detailPage = poManager.getDetailPage();
    const viewGalleryPage = poManager.getViewGalleryPage();

    await test.step('Navigate to the sale details page', async () => {
      await detailPage.navigateToForSaleDetailPage();
    });

    await test.step('Verify whether view gallery is visible on the sale details page', async () => {
      await viewGalleryPage.verifyGalleryComponentIsDisplayed();
    });
  });
});