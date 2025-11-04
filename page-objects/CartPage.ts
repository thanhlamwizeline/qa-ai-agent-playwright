import { Locator, Page, expect } from '@playwright/test'
import { Navigation } from './components/NavigationComponent.ts'
import { TestHelpers } from '../helpers/TestHelpers'
import {testconfig} from '../data/config/testconfig.ts'
import { BasePage } from './BasePage'

export class CartPage extends BasePage {
  private readonly navigationComponent: Navigation
  private readonly lbl_TotalAmount: Locator
  private readonly btn_Delete: Locator
  private readonly btn_PlaceOrder: Locator

  constructor(page: Page) {
    super(page)
    this.navigationComponent = new Navigation(this.page)
    this.lbl_TotalAmount = page.locator('#totalp')
    this.btn_Delete = page.getByRole("link", {name: 'Delete'})
    this.btn_PlaceOrder = page.getByRole("button", {name: 'Place Order'})
  }

  async verifyCartPageLoadsSuccessfully() {
    const cartURL = `${process.env.BASE_URL_E2E}/${testconfig.FE_URL.URL_CARTPAGE}`
    await this.page.waitForURL(new RegExp(`^${cartURL}`))
    await this.page.waitForLoadState("load")
  }

  async verifyProductInCart(productName: string, productPrice: string) {
    await expect.poll(() => this.page.getByRole("row", {name: `${productName} ${productPrice}`}).count(), { timeout: 10000 }).toBeGreaterThan(0)

  }

  async verifyTotalAmount(amount: string) {
    expect(await this.lbl_TotalAmount.textContent()).toBe(amount)
  }

  async verifyPlaceOrderButtonIsVisible() {
    await expect(this.btn_PlaceOrder).toBeVisible()
  }

  async clearCart() {
    await this.btn_PlaceOrder.waitFor({state:"visible"})
    await TestHelpers.waitForNumberOfSeconds(this.page, 2)
    let count = await this.btn_Delete.count()
    if(count>0){
      for(let i = 0; i < count; i++) {
        await this.btn_Delete.first().click()
        await TestHelpers.waitForNumberOfSeconds(this.page, 1)
      }
    }
    await this.navigationComponent.clickHomeNavLink()
  }

}