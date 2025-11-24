import { test } from '@playwright/test';

import dotenv from 'dotenv';

import { TESTCONFIG } from '../../data/config/testconfig';
import { CommonActions } from '../../helpers/CommonActionsHelpers';
import { POManager } from '../../page-objects/POManager';

dotenv.config();

test.describe('@feature_cart', () => {
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

    const homePage = poManager.getHomepage();
    const productDetailPage = poManager.getProductDetailPage();
    const cartPage = poManager.getCartPage();

    // Step 1: I navigate to the homepage
    await homePage.navigationComponent.clickHomeNavLink();

    // Step 2: I click "Laptops" category on the home page
    await homePage.clickCategory(categoryName);

    // Step 3: I click "Sony vaio i5" products on the home page
    await homePage.clickOnProduct(productName);

    // Step 4: I add product to Cart
    await productDetailPage.addToCart();

    // Step 5: I go to the Cart page
    await homePage.goToCart();

    // Step 6: Verify that the product "Sony vaio i5" is displayed in the Cart
    await cartPage.verifyProductInCart(productName);

    // Step 7: I click "Place Order" button on Cart page
    await cartPage.clickPlaceOrder();

    // Step 8: I see "Place order" form
    await cartPage.verifyPlaceOrderFormIsVisible();

    // Step 9: I fill the form with valid card values
    await cartPage.fillPlaceOrderForm();

    // Step 10: I click "Purchase" button
    await cartPage.clickPurchase();

    // Step 11: I see a message saying that "Thank you for your purchase"
    await cartPage.verifyPurchaseSuccessMessage();
  });
});