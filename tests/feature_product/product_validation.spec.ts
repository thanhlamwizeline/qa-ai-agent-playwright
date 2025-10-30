import { test } from "@playwright/test"
import { POManager } from "../../page-objects/POManager"
import { testconfig } from "../../data/config/testconfig"
import ProductList from "../../data/testdata/products/data_e2e.json"
import { CommonActions } from "../../helpers/CommonActions"
import dotenv from "dotenv"

dotenv.config()

test.describe("@e2e end to end ", () => {
  test.use({ storageState: 'playwright/.auth/user.json' })
  let poManager: POManager
  let productList: any[] = ProductList

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page)
    await page.goto(`${process.env.BASE_URL_E2E}/${testconfig.FE_URL.URL_HOMEPAGE}`)
    await CommonActions.clearCart(poManager)
  })

  for (let product of productList) {
    test(`@smoke @regression Verify Product ${product.ProductName} displays correctly in Product List`, async () => {
        let productName = `${product.ProductName}`
        let productPrice = `${product.ProductPrice}`
        
        const homePage = poManager.getHomepage()
        const productDetailPage = poManager.getProductDetailPage()

        await homePage.clickOnProduct(productName, productPrice)
        await productDetailPage.verifyProductDetailPageLoadsSuccessfully()
        await productDetailPage.verifyProductDetail(productName, productPrice)
    })
  }

})