import { test } from "@playwright/test"
import { POManager } from "../../page-objects/POManager"
import { constants } from "../../data/testdata/constants"
import { testconfig } from "../../data/config/testconfig"
import { CommonActions } from "../../helpers/CommonActions"
import dotenv from "dotenv"

dotenv.config()

test.describe("@e2e end to end ", () => {
  test.use({ storageState: 'playwright/.auth/user.json' })
  let poManager: POManager

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page)
    await page.goto(`${process.env.BASE_URL_E2E}/${testconfig.FE_URL.URL_HOMEPAGE}`)
    await CommonActions.clearCart(poManager)
  })

  test("@smoke Signed In User can add product to Cart successfully ", async () => {
    const homePage = poManager.getHomepage()
    const cartPage = poManager.getCartPage()
    const productDetailPage = poManager.getProductDetailPage()
    let productName = constants.productdata.productName
    let productPrice = constants.productdata.productPrice.toString()
    let total = constants.productdata.total.toString()

    await homePage.clickOnProduct(productName, productPrice)
    await productDetailPage.verifyProductDetailPageLoadsSuccessfully()
    await productDetailPage.verifyProductDetail(productName, productPrice)
    await productDetailPage.addToCart()
    await homePage.goToCart()
    await cartPage.verifyProductInCart(productName, productPrice)
    await cartPage.verifyTotalAmount(total)
  })

})