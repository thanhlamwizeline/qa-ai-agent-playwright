import { Locator, Page, expect } from '@playwright/test';

import { BasePage } from './BasePage';
import { Navigation } from './components/NavigationComponent';

export class Homepage extends BasePage {
  private readonly navigationComponent: Navigation;
  private readonly card_ProductItem: Locator;
  private readonly carousel: Locator;
  private readonly categoriesMenu: Locator;
  private readonly productList: Locator;

  constructor(page: Page) {
    super(page);
    this.navigationComponent = new Navigation(this.page);
    this.card_ProductItem = page.locator("//div[@class='card-block']");
    this.carousel = page.locator('#carouselExampleIndicators');
    this.categoriesMenu = page.locator('.list-group');
    this.productList = page.locator('#tbodyid');
  }

  async verifyWelcomUsernameOnNavigationBar(username: string): Promise<void> {
    await this.navigationComponent.verifyUsernameOnNavigationBar(username);
  }

  async clickLogin(): Promise<void> {
    await this.navigationComponent.clickLoginNavLink();
  }

  async goToCart(): Promise<void> {
    await this.navigationComponent.clickCartNavLink();
  }

  async clickCategory(categoryName: string): Promise<void> {
    await this.page.getByRole('link', { name: categoryName }).click();
  }

  async clickOnProduct(productName: string, productPrice?: string): Promise<void> {
    await this.page.getByRole('link', { name: productName }).click();
  }

  async verifyLogoutNavLinkVisibleOnHomePage(): Promise<void> {
    await this.navigationComponent.verifyLogoutNavLinkVisible();
  }

  async getProductImg(productName: string): Promise<Locator> {
    return this.page.locator(`img[alt="${productName}"]`);
  }

  async verifyCarouselIsVisible(): Promise<void> {
    await expect(this.carousel).toBeVisible();
  }

  async verifyCatergoryMenuContainsCorrectItems(items: string[]): Promise<void> {
    for (const item of items) {
      await expect(this.categoriesMenu).toContainText(item);
    }
  }

  async verifyProductListIsVisible(): Promise<void> {
    await expect(this.productList).toBeVisible();
  }
}