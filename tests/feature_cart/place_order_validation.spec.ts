import { test } from '@playwright/test';

import dotenv from 'dotenv';

import { TESTCONFIG } from '../../data/config/testconfig';
import { PAYMENT_METHODS } from '../../data/constants';
import { CommonActions } from '../../helpers/CommonActionsHelpers';
import { POManager } from '../../page-objects/POManager';

dotenv.config();

test.describe('@feature_cart Place Order Validation', () => {
  test.use({ storageState: 'playwright/.auth/user.json' });
  let poManager: POManager;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
    await page.goto(`${process.env.BASE_URL_E2E}/${TESTCONFIG.FE_URL.URL_HOMEPAGE}`);
    await CommonActions.clearCart(poManager);
  });

  test('@QAAGENT-45 Verify that User can place an order', async () => {
    const homePage = poManager.getHomepage();
    const productDetailPage = poManager.getProductDetailPage();
    const cartPage = poManager.getCartPage();

    // Navigate to homepage
    await test.step('I navigate to the homepage', async () => {
      await page.goto(`${process.env.BASE_URL_E2E}/${TESTCONFIG.FE_URL.URL_HOMEPAGE}`);
    });

    // Click "Laptops" category on the home page
    await test.step('I click "Laptops" category on the home page', async () => {
      await homePage.clickCategory('Laptops');
    });

    // Click "Sony vaio i5" products on the home page
    await test.step('I click "Sony vaio i5" products on the home page', async () => {
      await homePage.clickOnProduct('Sony vaio i5');
    });

    // Add product to Cart
    await test.step('I add product to Cart', async () => {
      await productDetailPage.addToCart();
    });

    // Go to the Cart page
    await test.step('I go to the Cart page', async () => {
      await homePage.goToCart();
    });

    // Verify that the product "Sony vaio i5" is displayed in the Cart
    await test.step('Verify that the product "Sony vaio i5" is displayed in the Cart', async () => {
      await cartPage.verifyProductInCart('Sony vaio i5');
    });

    // Click "Place Order" button on Cart page
    await test.step('I click "Place Order" button on Cart page', async () => {
      await cartPage.clickPlaceOrder();
    });

    // See "Place order" form
    await test.step('I see "Place order" form', async () => {
      await cartPage.verifyPlaceOrderFormIsVisible();
    });

    // Fill the form with valid card values
    await test.step('I fill the form with valid card values', async () => {
      await cartPage.fillPlaceOrderForm();
    });

    // Click "Purchase" button
    await test.step('I click "Purchase" button', async () => {
      await cartPage.clickPurchase();
    });

    // See a message saying that "Thank you for your purchase"
    await test.step('I see a message saying that "Thank you for your purchase"', async () => {
      await cartPage.verifyPurchaseConfirmation('Thank you for your purchase');
    });
  });
});