import { Page, expect } from '@playwright/test';

import { BasePage } from './BasePage';
import { ViewGalleryPageLocator } from './locators/ViewGalleryPageLocator';

export class ViewGalleryPage extends BasePage {
  private readonly locators: ViewGalleryPageLocator;

  constructor(page: Page) {
    super(page);
    this.locators = new ViewGalleryPageLocator(page);
  }

  async verifyGalleryComponentIsDisplayed(): Promise<void> {
    await expect(this.locators.galleryComponent).toBeVisible();
  }
}