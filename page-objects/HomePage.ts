import { Locator, Page, expect } from '@playwright/test'
import { Navigation } from './components/Navigation'

export class Homepage {
  private readonly page: Page
  private readonly navigationComponent: Navigation
  private readonly card_ProductItem: Locator

  constructor(page: Page) {
    this.page = page
    this.navigationComponent = new Navigation(this.page)
    this.card_ProductItem = page.locator("//div[@class='card-block']")
  }

  async verifyWelcomUsernameOnNavigationBar(username: string){
    await this.navigationComponent.verifyUsernameOnNavigationBar(username)
  }
 
  async clickLogin() {
    await this.navigationComponent.clickLoginNavLink()
  }

  async goToCart() {
    await this.navigationComponent.clickCartNavLink()
  }

  async clickOnProduct(productName: string, productPrice: string) {
    let selectedProduct = this.card_ProductItem
    .filter({hasText: productName})
    .filter({hasText: productPrice})
    await selectedProduct.waitFor({state:"visible",timeout:5000})
    await selectedProduct.locator('.card-title').click()
  }

  async verifyLogoutNavLinkVisibleOnHomePage(){
    await this.navigationComponent.verifyLogoutNavLinkVisible()
  }

  async getProductImg(productName: string): Promise<Locator>{
    return this.page.locator("//div")
    .filter({ has: this.page.locator("img")})
    .filter({ has: this.page.getByRole('link', { name: `${productName}` }) })
    .last().locator('img')
  }

  async expectCorrectProductImage(productName: string, productImg: string, browserName: string) {
    await this.page.waitForLoadState()
    let productImgLocator = await this.getProductImg(productName)
    await expect(productImgLocator).toHaveJSProperty('complete', true);
    let imgFileWithBrowser: string;
    
    // Different image on Firefox browser
    if (browserName == 'firefox') {
      imgFileWithBrowser = 'FF-' + productImg ;
    } else {
      imgFileWithBrowser = productImg;
    }

      await expect(productImgLocator).toHaveScreenshot(imgFileWithBrowser,{
      threshold: 0.5,
      maxDiffPixelRatio: 0.01
    });
  }
}