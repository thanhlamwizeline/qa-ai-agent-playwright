import { test } from "@playwright/test"
import { POManager } from "../../page-objects/POManager"
import { testconfig } from "../../data/config/testconfig"
import { products} from "../../data/products/products"
import { CommonActions } from "../../helpers/CommonActionsHelpers"
import dotenv from "dotenv"

dotenv.config()

test.describe("@feature_product ", () => {
  test.use({ storageState: 'playwright/.auth/user.json' })
  let poManager: POManager
  let productList = products

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page)
    await page.goto(`${process.env.BASE_URL_E2E}/${testconfig.FE_URL.URL_HOMEPAGE}`)
    await CommonActions.clearCart(poManager)
  })

  for (let product of productList) {
    test(`@smoke @regression Verify Product ${product.productName} displays correctly in Product Detail Page`, async () => {
        let productName = `${product.productName}`
        let productPrice = `${product.productPrice}`
        let productImage = `${product.imgSrc}`
        
        const homePage = poManager.getHomepage()
        const productDetailPage = poManager.getProductDetailPage()

        await test.step('Navigate to product from homepage', async () => {
          await homePage.clickOnProduct(productName, productPrice)
        })

        await test.step('Verify product detail page loads', async () => {
          await productDetailPage.verifyProductDetailPageLoadsSuccessfully()
        })

        await test.step('Verify product information is correct', async () => {
          await productDetailPage.verifyProductDetail(productName, productPrice)
          await productDetailPage.verifyProductImageIsCorrect(productImage)
        })

        await test.step('Verify add to cart functionality is available', async () => {
          await productDetailPage.verifyAddToCartButtonIsVisible()
        })
    })
  }

})