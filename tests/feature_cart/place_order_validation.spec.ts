import { test } from '@playwright/test';

import dotenv from 'dotenv';

import { TESTCONFIG } from '../../data/config/testconfig';
import { CommonActions } from '../../helpers/CommonActionsHelpers';
import { POManager } from '../../page-objects/POManager';

dotenv.config();

test.describe('Place Order Validation', () => {
  test.use({ storageState: 'playwright/.auth/user.json' });
  let poManager: POManager;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
    await page.goto(`${process.env.BASE_URL_E2E}/${TESTCONFIG.FE_URL.URL_HOMEPAGE}`);
    await CommonActions.clearCart(poManager);
  });

  test('@QAAGENT-45 Verify that User can place an order', async () => {
    const productName = 'Sony vaio i5';
    const categoryName = 'Laptops';

    // Step 1: Navigate to homepage (already done in beforeEach)
    
    // Step 2: Click "Laptops" category on the home page
    const homePage = poManager.getHomepage();
    await homePage.clickCategory(categoryName);

    // Step 3: Click "Sony vaio i5" products on the home page
    await homePage.clickOnProduct(productName);

    // Step 4: Add product to Cart
    const productDetailPage = poManager.getProductDetailPage();
    await productDetailPage.addToCart();

    // Step 5: Go to the Cart page
    await homePage.goToCart();

    // Step 6: Verify that the product "Sony vaio i5" is displayed in the Cart
    const cartPage = poManager.getCartPage();
    await cartPage.verifyProductInCart(productName);

    // Step 7: Click "Place Order" button on Cart page
    await cartPage.clickPlaceOrder();

    // Step 8: See "Place order" form
    await cartPage.verifyPlaceOrderFormIsVisible();

    // Step 9: Fill the form with valid card values
    await cartPage.fillPlaceOrderForm();

    // Step 10: Click "Purchase" button
    await cartPage.clickPurchase();

    // Step 11: See a message saying that "Thank you for your purchase"
    await cartPage.verifySuccessMessage('Thank you for your purchase!');
  });
});