import { Locator, Page, expect } from '@playwright/test';

import { PAYMENT_METHODS } from '../data/constants';

import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  private readonly lbl_TotalAmount: Locator;
  private readonly btn_Delete: Locator;
  private readonly btn_PlaceOrder: Locator;
  private readonly placeOrderForm: Locator;
  private readonly btn_Purchase: Locator;

  constructor(page: Page) {
    super(page);
    this.lbl_TotalAmount = page.locator('#totalp');
    this.btn_Delete = page.getByRole('link', { name: 'Delete' });
    this.btn_PlaceOrder = page.getByRole('button', { name: 'Place Order' });
    this.placeOrderForm = page.locator('.modal-title', { hasText: 'Place order' });
    this.btn_Purchase = page.getByRole('button', { name: 'Purchase' });
  }

  async verifyCartPageLoadsSuccessfully(): Promise<void> {
    await expect(this.page.locator('#page')).toBeVisible();
  }

  async verifyProductInCart(productName: string, productPrice?: string): Promise<void> {
    await expect(this.page.getByText(productName)).toBeVisible();
    if (productPrice) {
      await expect(this.page.getByText(productPrice)).toBeVisible();
    }
  }

  async verifyTotalAmount(amount: string): Promise<void> {
    await expect(this.lbl_TotalAmount).toContainText(amount);
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

  async verifySuccessMessage(message: string): Promise<void> {
    await expect(this.page.getByText(message)).toBeVisible();
  }

  async clearCart(): Promise<void> {
    const deleteButtons = this.page.getByRole('link', { name: 'Delete' });
    const count = await deleteButtons.count();
    
    for (let i = 0; i < count; i++) {
      await deleteButtons.first().click();
      await this.page.waitForTimeout(1000);
    }
  }
}