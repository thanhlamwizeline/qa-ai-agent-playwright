import { test } from "@playwright/test"
import { POManager } from "../../page-objects/POManager"
import { CART } from "../../data/cartPage/cart"
import { TESTCONFIG } from "../../data/config/testconfig"
import { CommonActions } from "../../helpers/CommonActionsHelpers"
import dotenv from "dotenv"

dotenv.config()

test.describe("@feature_cartpage ", () => {
  test.use({ storageState: 'playwright/.auth/user.json' })
  let poManager: POManager

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page)
    await page.goto(`${process.env.BASE_URL_E2E}/${TESTCONFIG.FE_URL.URL_HOMEPAGE}`)
    await CommonActions.clearCart(poManager)
  })

  test("@smoke Verify Cart page displays correct information  ", async () => {
    const homePage = poManager.getHomepage()
    const cartPage = poManager.getCartPage()
    const productDetailPage = poManager.getProductDetailPage()
    let productName = CART.productName
    let productPrice = CART.productPrice.toString()
    let total = CART.total.toString()

    await homePage.clickOnProduct(productName, productPrice)
    await productDetailPage.addToCart()
    await homePage.goToCart()
    await cartPage.verifyProductInCart(productName, productPrice)
    await cartPage.verifyTotalAmount(total)
    await cartPage.verifyPlaceOrderButtonIsVisible()
  })

})
