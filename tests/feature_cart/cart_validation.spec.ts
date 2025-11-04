import { test } from '@playwright/test';

import dotenv from 'dotenv';

import { CART } from '../../data/cartPage/cart';
import { TESTCONFIG } from '../../data/config/testconfig';
import { CommonActions } from '../../helpers/CommonActionsHelpers';
import { POManager } from '../../page-objects/POManager';

dotenv.config();

test.describe('@feature_cartpage ', () => {
  test.use({ storageState: 'playwright/.auth/user.json' });
  let poManager: POManager;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
    await page.goto(`${process.env.BASE_URL_E2E}/${TESTCONFIG.FE_URL.URL_HOMEPAGE}`);
    await CommonActions.clearCart(poManager);
  });

  test('@smoke Verify Cart page displays correct information  ', async () => {
    const homePage = poManager.getHomepage();
    const cartPage = poManager.getCartPage();
    const productDetailPage = poManager.getProductDetailPage();
    const productName = CART.productName;
    const productPrice = CART.productPrice.toString();
    const total = CART.total.toString();

    await homePage.clickOnProduct(productName, productPrice);
    await productDetailPage.addToCart();
    await homePage.goToCart();
    await cartPage.verifyProductInCart(productName, productPrice);
    await cartPage.verifyTotalAmount(total);
    await cartPage.verifyPlaceOrderButtonIsVisible();
  });

});
