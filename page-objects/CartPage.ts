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

  async verifyCartPageLoadsSuccessfully(): Promise<void> {
    const cartURL = `${process.env.BASE_URL_E2E}/${TESTCONFIG.FE_URL.URL_CARTPAGE}`;
    await this.page.waitForURL(new RegExp(`^${cartURL}`));
    await this.page.waitForLoadState('load');
  }

  async verifyProductInCart(productName: string, productPrice?: string): Promise<void> {
    if (productPrice) {
      await expect.poll(() => this.page.getByRole('row', {name: `${productName} ${productPrice}`}).count(), { timeout: 10000 }).toBeGreaterThan(0);
    } else {
      await expect.poll(() => this.page.getByRole('row', {name: productName}).count(), { timeout: 10000 }).toBeGreaterThan(0);
    }
  }

  async verifyTotalAmount(amount: string): Promise<void> {
    await expect(this.lbl_TotalAmount).toHaveText(amount);
  }

  async verifyPlaceOrderButtonIsVisible(): Promise<void> {
    await expect(this.btn_PlaceOrder).toBeVisible();
  }

  async clickPlaceOrder(): Promise<void> {
    await this.btn_PlaceOrder.click();
  }

  async verifyPlaceOrderFormIsVisible(): Promise<void> {
    await expect(this.placeOrderForm).toBeVisible();
  }

  async fillPlaceOrderForm(): Promise<void> {
    await this.page.getByRole('textbox', { name: 'Name' }).fill(PAYMENT_METHODS.VALID_CARD.cardHolder);
    await this.page.getByRole('textbox', { name: 'Credit card' }).fill(PAYMENT_METHODS.VALID_CARD.cardNumber);
    await this.page.getByRole('textbox', { name: 'Month' }).fill(PAYMENT_METHODS.VALID_CARD.expiryMonth);
    await this.page.getByRole('textbox', { name: 'Year' }).fill(PAYMENT_METHODS.VALID_CARD.expiryYear);
  }

  async clickPurchase(): Promise<void> {
    await this.btn_Purchase.click();
  }

  async verifyPurchaseConfirmation(message: string): Promise<void> {
    await expect(this.page.getByText(message)).toBeVisible();
  }

  async clearCart(): Promise<void> {
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