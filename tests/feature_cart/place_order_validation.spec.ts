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
    // Step 1: Navigate to homepage (already done in beforeEach)
    
    // Step 2: Click "Laptops" category on the home page
    await poManager.getHomepage().clickCategory('Laptops');
    
    // Step 3: Click "Sony vaio i5" products on the home page
    await poManager.getHomepage().clickOnProduct('Sony vaio i5');
    
    // Step 4: Add product to Cart
    await poManager.getProductDetailPage().addToCart();
    
    // Step 5: Go to the Cart page
    await poManager.getHomepage().goToCart();
    
    // Step 6: Verify that the product "Sony vaio i5" is displayed in the Cart
    await poManager.getCartPage().verifyProductInCart('Sony vaio i5');
    
    // Step 7: Click "Place Order" button on Cart page
    await poManager.getCartPage().clickPlaceOrder();
    
    // Step 8: Verify "Place order" form is visible
    await poManager.getCartPage().verifyPlaceOrderFormIsVisible();
    
    // Step 9: Fill the form with valid card values
    await poManager.getCartPage().fillPlaceOrderForm();
    
    // Step 10: Click "Purchase" button
    await poManager.getCartPage().clickPurchase();
    
    // Step 11: Verify success message
    await poManager.getCartPage().verifyPurchaseSuccessMessage('Thank you for your purchase');
  });
});