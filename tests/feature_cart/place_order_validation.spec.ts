import { test, expect } from '@playwright/test';

import { TESTCONFIG } from '../../data/config/testconfig';
import { POManager } from '../../page-objects/POManager';

test.describe('Place Order Validation', () => {
  let poManager: POManager;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
    await page.goto(`${process.env.BASE_URL_E2E}/${TESTCONFIG.FE_URL.URL_HOMEPAGE}`);
  });

  test('@QAAGENT-45 Verify that User can place an order', async ({ page }) => {
    await test.step('Navigate to homepage', async () => {
      await page.goto(`${process.env.BASE_URL_E2E}/${TESTCONFIG.FE_URL.URL_HOMEPAGE}`);
    });

    await test.step('Click "Laptops" category on the home page', async () => {
      await poManager.getHomepage().clickCategory('Laptops');
    });

    await test.step('Click "Sony vaio i5" products on the home page', async () => {
      await poManager.getHomepage().clickOnProduct('Sony vaio i5');
    });

    await test.step('Add product to Cart', async () => {
      await poManager.getProductDetailPage().addToCart();
    });

    await test.step('Go to the Cart page', async () => {
      await poManager.getHomepage().goToCart();
    });

    await test.step('Verify that the product "Sony vaio i5" is displayed in the Cart', async () => {
      await poManager.getCartPage().verifyProductInCart('Sony vaio i5');
    });

    await test.step('Click "Place Order" button on Cart page', async () => {
      await poManager.getCartPage().clickPlaceOrder();
    });

    await test.step('Verify "Place order" form is visible', async () => {
      await poManager.getCartPage().verifyPlaceOrderFormIsVisible();
    });

    await test.step('Fill the form with valid card values', async () => {
      await poManager.getCartPage().fillPlaceOrderForm();
    });

    await test.step('Click "Purchase" button', async () => {
      await poManager.getCartPage().clickPurchase();
    });

    await test.step('Verify success message is displayed', async () => {
      await poManager.getCartPage().verifyPurchaseSuccessMessage();
    });
  });
});