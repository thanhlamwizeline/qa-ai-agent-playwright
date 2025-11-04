import { test } from '@playwright/test';

import dotenv from 'dotenv';

import { TESTCONFIG } from '../../data/config/testconfig';
import { PRODUCTS} from '../../data/products/products';
import { CommonActions } from '../../helpers/CommonActionsHelpers';
import { POManager } from '../../page-objects/POManager';

dotenv.config();

test.describe('@feature_product ', () => {
  test.use({ storageState: 'playwright/.auth/user.json' });
  let poManager: POManager;
  const productList = PRODUCTS;

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page);
    await page.goto(`${process.env.BASE_URL_E2E}/${TESTCONFIG.FE_URL.URL_HOMEPAGE}`);
    await CommonActions.clearCart(poManager);
  });

  for (const product of productList) {
    test(`@smoke @regression Verify Product ${product.productName} displays correctly in Product Detail Page`, async () => {
      const productName = `${product.productName}`;
      const productPrice = `${product.productPrice}`;
      const productImage = `${product.imgSrc}`;

      const homePage = poManager.getHomepage();
      const productDetailPage = poManager.getProductDetailPage();

      await homePage.clickOnProduct(productName, productPrice);
      await productDetailPage.verifyProductDetailPageLoadsSuccessfully();
      await productDetailPage.verifyProductDetail(productName, productPrice);
      await productDetailPage.verifyProductImageIsCorrect(productImage);
      await productDetailPage.verifyAddToCartButtonIsVisible();
    });
  }

});
