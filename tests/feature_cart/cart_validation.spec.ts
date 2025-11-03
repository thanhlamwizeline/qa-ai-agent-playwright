import { test } from "@playwright/test"
import { POManager } from "../../page-objects/POManager"
import { cart } from "../../data/cartPage/cart"
import { testconfig } from "../../data/config/testconfig"
import { CommonActions } from "../../helpers/CommonActionsHelpers"
import dotenv from "dotenv"

dotenv.config()

test.describe("@feature_cartpage ", () => {
  test.use({ storageState: 'playwright/.auth/user.json' })
  let poManager: POManager

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page)
    await page.goto(`${process.env.BASE_URL_E2E}/${testconfig.FE_URL.URL_HOMEPAGE}`)
    await CommonActions.clearCart(poManager)
  })

  test("@smoke Verify Cart page displays correct information  ", async () => {
    const homePage = poManager.getHomepage()
    const cartPage = poManager.getCartPage()
    const productDetailPage = poManager.getProductDetailPage()
    let productName = cart.productName
    let productPrice = cart.productPrice.toString()
    let total = cart.total.toString()

    await test.step('Add product to cart from homepage', async () => {
      await homePage.clickOnProduct(productName, productPrice)
      await productDetailPage.addToCart()
    })

    await test.step('Navigate to cart page', async () => {
      await homePage.goToCart()
    })

    await test.step('Verify cart contents and pricing', async () => {
      await cartPage.verifyProductInCart(productName, productPrice)
      await cartPage.verifyTotalAmount(total)
    })

    await test.step('Verify checkout functionality is available', async () => {
      await cartPage.verifyPlaceOrderButtonIsVisible()
    })
  })

})