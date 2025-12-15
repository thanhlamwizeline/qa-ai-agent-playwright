import { Locator, Page } from '@playwright/test';

export class ViewGalleryPageLocator {
  readonly galleryComponent: Locator;

  constructor(page: Page) {
    this.galleryComponent = page.getByTestId('hero-container');
  }
}