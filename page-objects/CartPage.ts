import { Locator, Page, expect } from '@playwright/test';

import { TESTCONFIG } from '../data/config/testconfig.ts';
import { PAYMENT_METHODS } from '../data/constants.ts';
import { TestHelpers } from '../helpers/TestHelpers';

import { BasePage } from './BasePage';
import { Navigation } from './components/NavigationComponent.ts';

export class CartPage extends BasePage {
  private readonly navigationComponent: Navigation;
  private readonly lbl_TotalAmount: Locator;
  private readonly btn_Delete: Locator;
  private readonly btn_PlaceOrder: Locator;
  private readonly placeOrderForm: Locator;
  private readonly btn_Purchase: Locator;

  constructor(page: Page) {
    super(page);
    this.navigationComponent = new Navigation(this.page);
    this.lbl_TotalAmount = page.locator('#totalp');
    this.btn_Delete = page.getByRole('link', {name: 'Delete'});
    this.btn_PlaceOrder = page.getByRole('button', {name: 'Place Order'});
    this.placeOrderForm = page.locator('.modal-title', { hasText: 'Place order' });
    this.btn_Purchase = page.getByRole('button', { name: 'Purchase' });
  }

  async verifyCartPageLoadsSuccessfully() {
    const cartURL = `${process.env.BASE_URL_E2E}/${TESTCONFIG.FE_URL.URL_CARTPAGE}`;
    await this.page.waitForURL(new RegExp(`^${cartURL}`));
    await this.page.waitForLoadState('load');
  }

  async verifyProductInCart(productName: string, productPrice?: string) {
    if (productPrice) {
      await expect.poll(() => this.page.getByRole('row', {name: `${productName} ${productPrice}`}).count(), { timeout: 10000 }).toBeGreaterThan(0);
    } else {
      await expect.poll(() => this.page.getByRole('row', {name: new RegExp(productName)}).count(), { timeout: 10000 }).toBeGreaterThan(0);
    }
  }

  async verifyTotalAmount(amount: string) {
    await expect(this.lbl_TotalAmount).toHaveText(amount);
  }

  async verifyPlaceOrderButtonIsVisible() {
    await expect(this.btn_PlaceOrder).toBeVisible();
  }

  async clickPlaceOrder() {
    await this.btn_PlaceOrder.click();
  }

  async verifyPlaceOrderFormIsVisible() {
    await expect(this.placeOrderForm).toBeVisible();
  }

  async fillPlaceOrderForm() {
    const validCard = PAYMENT_METHODS.VALID_CARD;
    
    await this.page.getByRole('textbox', { name: 'Name' }).fill(validCard.cardHolder);
    await this.page.getByRole('textbox', { name: 'Credit card' }).fill(validCard.cardNumber);
    await this.page.getByRole('textbox', { name: 'Month' }).fill(validCard.expiryMonth);
    await this.page.getByRole('textbox', { name: 'Year' }).fill(validCard.expiryYear);
  }

  async clickPurchase() {
    await this.btn_Purchase.click();
  }

  async verifySuccessMessage(message: string) {
    await expect(this.page.getByText(message)).toBeVisible();
  }

  async clearCart() {
    await this.btn_PlaceOrder.waitFor({state:'visible'});
    await TestHelpers.waitForNumberOfSeconds(this.page, 2);
    const count = await this.btn_Delete.count();
    if(count>0){
      for(let i = 0; i < count; i++) {
        await this.btn_Delete.first().click();
        await TestHelpers.waitForNumberOfSeconds(this.page, 1);
      }
    }
    await this.navigationComponent.clickHomeNavLink();
  }

}