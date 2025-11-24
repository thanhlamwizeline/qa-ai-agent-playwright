import { Locator, Page, expect } from '@playwright/test';

import { TESTCONFIG } from '../data/config/testconfig';

import { BasePage } from './BasePage';
import { Navigation } from './components/NavigationComponent';

export class Homepage extends BasePage {
  private readonly navigationComponent: Navigation;
  private readonly card_ProductItem: Locator;
  private readonly carousel: Locator;
  private readonly categoriesMenu: Locator;
  private readonly productList: Locator;
  private readonly productsTableBody: Locator;

  constructor(page: Page) {
    super(page);
    this.navigationComponent = new Navigation(this.page);
    this.card_ProductItem = page.locator("//div[@class='card-block']");
    this.carousel = page.locator('#carouselExampleIndicators');
    this.categoriesMenu = page.locator('.list-group');
    this.productList = page.locator('#tbodyid');
    this.productsTableBody = page.locator('#tbodyid');
  }

  async navigateToHomepage(): Promise<void> {
    const baseUrl = process.env.BASE_URL_E2E || 'https://www.demoblaze.com';
    const homepageUrl = TESTCONFIG?.FE_URL?.URL_HOMEPAGE || '';
    const fullUrl = homepageUrl ? `${baseUrl}/${homepageUrl}` : baseUrl;
    await this.page.goto(fullUrl);
  }

  async verifyProductsTableBodyVisible(): Promise<void> {
    await expect(this.productsTableBody).toBeVisible();
  }

  async verifyProductIsDisplayed(productName: string): Promise<void> {
    const productLocator = this.page.locator('.card-title').filter({ hasText: productName });
    await expect(productLocator).toBeVisible();
  }

  async verifyWelcomUsernameOnNavigationBar(username: string) {
    await this.navigationComponent.verifyUsernameOnNavigationBar(username);
  }
 
  async clickLogin() {
    await this.navigationComponent.clickLoginNavLink();
  }

  async goToCart() {
    await this.navigationComponent.clickCartNavLink();
  }

  async clickOnProduct(productName: string, productPrice: string) {
    const selectedProduct = this.card_ProductItem
      .filter({hasText: productName})
      .filter({hasText: productPrice});
    await selectedProduct.waitFor({state:'visible',timeout:5000});
    await selectedProduct.locator('.card-title').click();
  }

  async verifyLogoutNavLinkVisibleOnHomePage() {
    await this.navigationComponent.verifyLogoutNavLinkVisible();
  }

  async getProductImg(productName: string): Promise<Locator> {
    const selectedProduct = this.card_ProductItem
      .filter({hasText: productName});
    return selectedProduct.locator('img');
  }

  async verifyCarouselIsVisible(): Promise<void> {
    await expect(this.carousel).toBeVisible();
  }

  async verifyCatergoryMenuContainsCorrectItems(items: string[]): Promise<void> {
    for(const item of items) {
      const categoryItem = this.categoriesMenu.locator('.list-group-item').filter({hasText: item});
      await expect(categoryItem).toBeVisible();
    }
  }

  async verifyProductListIsVisible(): Promise<void> {
    await expect(this.productList).toBeVisible();
  }
}