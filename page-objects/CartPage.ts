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

  constructor(page: Page) {
    super(page);
    this.navigationComponent = new Navigation(this.page);
    this.lbl_TotalAmount = page.locator('#totalp');
    this.btn_Delete = page.getByRole('link', {name: 'Delete'});
    this.btn_PlaceOrder = page.getByRole('button', {name: 'Place Order'});
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
      await expect.poll(() => this.page.getByRole('row').filter({hasText: productName}).count(), { timeout: 10000 }).toBeGreaterThan(0);
    }
  }

  async verifyTotalAmount(amount: string) {
    await expect(this.lbl_TotalAmount).toHaveText(amount);
  }

  async verifyPlaceOrderButtonIsVisible() {
    await expect(this.btn_PlaceOrder).toBeVisible();
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

  async clickPlaceOrder() {
    const placeOrderButton = this.page.getByRole('button', { name: 'Place Order' });
    await placeOrderButton.click();
  }

  async verifyPlaceOrderFormIsVisible() {
    const placeOrderForm = this.page.locator('.modal-title', { hasText: 'Place order' });
    await expect(placeOrderForm).toBeVisible();
  }

  async fillPlaceOrderForm() {
    await this.page.getByRole('textbox', { name: 'Name' }).fill(PAYMENT_METHODS.VALID_CARD.cardHolder);
    await this.page.getByRole('textbox', { name: 'Credit card' }).fill(PAYMENT_METHODS.VALID_CARD.cardNumber);
    await this.page.getByRole('textbox', { name: 'Month' }).fill(PAYMENT_METHODS.VALID_CARD.expiryMonth);
    await this.page.getByRole('textbox', { name: 'Year' }).fill(PAYMENT_METHODS.VALID_CARD.expiryYear);
  }

  async clickPurchase() {
    const purchaseButton = this.page.getByRole('button', { name: 'Purchase' });
    await purchaseButton.click();
  }

  async verifySuccessMessage(expectedMessage: string) {
    await expect(this.page.getByText(expectedMessage)).toBeVisible();
  }
}