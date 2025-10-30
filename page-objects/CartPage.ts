import { Locator, Page, expect } from '@playwright/test'
import { Navigation } from './components/Navigation'
import { TestHelpers } from '../helpers/TestHelpers'
import {testconfig} from '../data/config/testconfig.ts'

export class CartPage {
  private readonly page: Page
  private readonly navigationComponent: Navigation
  private readonly lbl_TotalAmount: Locator
  private readonly btn_Delete: Locator
  private readonly btn_PlaceOrder: Locator

  constructor(page: Page) {
    this.page = page
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