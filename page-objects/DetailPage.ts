import { Page, expect } from '@playwright/test';

import { BasePage } from './BasePage';

export class DetailPage extends BasePage {

  constructor(page: Page) {
    super(page);
  }

  async navigateToForSaleDetailPage(): Promise<void> {
    const url = 'A_NH-Consumer_Brian-Canfield-Centre-3777-Kingsway_Binder_ZZ_00000_P417000765350';
    await this.page.goto(url);
    await expect(this.page).toHaveURL(url);
  }
}