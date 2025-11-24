import { Locator, Page, expect } from '@playwright/test';

import { TESTCONFIG } from '../data/config/testconfig.ts';

import { BasePage } from './BasePage';
import { Navigation } from './components/NavigationComponent';

export class Homepage extends BasePage {
  readonly navigationComponent: Navigation;
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

  async navigateToHomepage() {
    const homeURL = `${process.env.BASE_URL_E2E}/${TESTCONFIG.FE_URL.URL_HOMEPAGE}`;
    await this.page.goto(homeURL);
    await this.page.waitForLoadState('load');
  }

  async clickCategory(categoryName: string) {
    const categoryLink = this.categoriesMenu.getByRole('link', { name: categoryName });
    await categoryLink.waitFor({ state: 'visible' });
    await categoryLink.click();
  }

  async verifyWelcomUsernameOnNavigationBar(username: string){
    await this.navigationComponent.verifyUsernameOnNavigationBar(username);
  }
 
  async clickLogin() {
    await this.navigationComponent.clickLoginNavLink();
  }

  async goToCart() {
    await this.navigationComponent.clickCartNavLink();
  }

  async clickOnProduct(productName: string, productPrice?: string) {
    if (productPrice) {
      const selectedProduct = this.card_ProductItem
        .filter({hasText: productName})
        .filter({hasText: productPrice});
      await selectedProduct.waitFor({state:'visible',timeout:5000});
      await selectedProduct.locator('.card-title').click();
    } else {
      const selectedProduct = this.card_ProductItem
        .filter({hasText: productName});
      await selectedProduct.waitFor({state:'visible',timeout:5000});
      await selectedProduct.locator('.card-title').click();
    }
  }

  async verifyLogoutNavLinkVisibleOnHomePage(){
    await this.navigationComponent.verifyLogoutNavLinkVisible();
  }

  async getProductImg(productName: string): Promise<Locator>{
    return this.page.locator('//div')
      .filter({ has: this.page.locator('img')})
      .filter({ has: this.page.getByRole('link', { name: `${productName}` }) })
      .last().locator('img');
  }

  async verifyCarouselIsVisible(){
    await expect(this.carousel).toBeVisible();
  }

  async verifyCatergoryMenuContainsCorrectItems(items: string[]){
    for (const item of items) {
      await expect(this.categoriesMenu.getByRole('link', { name: item})).toBeVisible();
    }
  }
  
  async verifyProductListIsVisible(){
    await expect(this.productList).toBeVisible();
  }  
}