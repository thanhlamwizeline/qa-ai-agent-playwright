import { Locator, Page, expect } from '@playwright/test';

import { BasePage } from './BasePage';
import { Navigation } from './components/NavigationComponent';
import { TESTCONFIG } from '../data/config/testconfig';

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
    this.productsTableBody = page.locator('#tbodyid2');
  }

  async navigateToHomePage(): Promise<void> {
    const url = `${process.env.BASE_URL_E2E}/${TESTCONFIG.FE_URL.URL_HOMEPAGE}`;
    await this.page.goto(url);
  }

  async verifyProductList(): Promise<void> {
    await expect(this.productsTableBody).toBeVisible();
  }

  async verifyProductIsDisplayed(productName: string): Promise<void> {
    const product = this.page.locator('.card-title').filter({ hasText: productName });
    await expect(product).toBeVisible();
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

  async clickOnProduct(productName: string, productPrice: string): Promise<void> {
    const selectedProduct = this.card_ProductItem
      .filter({hasText: productName})
      .filter({hasText: productPrice});
    await selectedProduct.waitFor({state:'visible',timeout:5000});
    await selectedProduct.click();
  }

  async verifyLogoutNavLinkVisibleOnHomePage(): Promise<void> {
    await this.navigationComponent.verifyLogoutNavLinkVisible();
  }

  async getProductImg(productName: string): Promise<Locator> {
    const productCard = this.card_ProductItem.filter({hasText: productName});
    const productImg = productCard.locator('img');
    return productImg;
  }

  async verifyCarouselIsVisible(): Promise<void> {
    await expect(this.carousel).toBeVisible();
  }

  async verifyCatergoryMenuContainsCorrectItems(items: string[]): Promise<void> {
    for(const item of items){
      const categoryItem = this.categoriesMenu.getByText(item);
      await expect(categoryItem).toBeVisible();
    }
  }

  async verifyProductListIsVisible(): Promise<void> {
    await expect(this.productList).toBeVisible();
  }
}