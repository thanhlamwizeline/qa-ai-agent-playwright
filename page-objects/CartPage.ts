import { Locator, Page, expect } from '@playwright/test';

import { TESTCONFIG } from '../data/config/testconfig.ts';
import { PAYMENT_METHODS } from '../data/constants';
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

  async verifyProductInCart(productName: string, productPrice?: string): Promise<void> {
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

  async clickPlaceOrder(): Promise<void> {
    await this.btn_PlaceOrder.click();
  }

  async verifyPlaceOrderFormIsVisible(): Promise<void> {
    const placeOrderForm = this.page.locator('.modal-title', { hasText: 'Place order' });
    await expect(placeOrderForm).toBeVisible();
  }

  async fillPlaceOrderForm(): Promise<void> {
    const nameField = this.page.getByRole("textbox", { name: 'Name' });
    const creditCardField = this.page.getByRole("textbox", { name: 'Credit card' });
    const monthField = this.page.getByRole("textbox", { name: 'Month' });
    const yearField = this.page.getByRole("textbox", { name: 'Year' });

    await nameField.fill(PAYMENT_METHODS.VALID_CARD.cardHolder);
    await creditCardField.fill(PAYMENT_METHODS.VALID_CARD.cardNumber);
    await monthField.fill(PAYMENT_METHODS.VALID_CARD.expiryMonth);
    await yearField.fill(PAYMENT_METHODS.VALID_CARD.expiryYear);
  }

  async clickPurchase(): Promise<void> {
    const purchaseButton = this.page.getByRole("button", { name: 'Purchase' });
    await purchaseButton.click();
  }

  async verifySuccessMessage(expectedMessage: string): Promise<void> {
    const successMessage = this.page.getByText(expectedMessage);
    await expect(successMessage).toBeVisible();
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