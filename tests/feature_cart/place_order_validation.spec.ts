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
    const productName = 'Sony vaio i5';
    const categoryName = 'Laptops';

    // Step 1: Navigate to the homepage (already done in beforeEach)
    
    // Step 2: Click "Laptops" category on the home page
    await poManager.getHomepage().clickCategory(categoryName);

    // Step 3: Click "Sony vaio i5" products on the home page
    await poManager.getHomepage().clickOnProduct(productName);

    // Step 4: Add product to Cart
    await poManager.getProductDetailPage().addToCart();

    // Step 5: Go to the Cart page
    await poManager.getHomepage().goToCart();

    // Step 6: Verify that the product "Sony vaio i5" is displayed in the Cart
    await poManager.getCartPage().verifyProductInCart(productName);

    // Step 7: Click "Place Order" button on Cart page
    await poManager.getCartPage().clickPlaceOrder();

    // Step 8: Verify "Place order" form is visible
    await poManager.getCartPage().verifyPlaceOrderFormIsVisible();

    // Step 9: Fill the form with valid card values
    await poManager.getCartPage().fillPlaceOrderForm();

    // Step 10: Click "Purchase" button
    await poManager.getCartPage().clickPurchase();

    // Step 11: Verify success message "Thank you for your purchase"
    await poManager.getCartPage().verifySuccessMessage('Thank you for your purchase!');
  });
});