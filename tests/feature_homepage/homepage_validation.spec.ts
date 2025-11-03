import { test } from "@playwright/test"
import { POManager } from "../../page-objects/POManager"
import { testconfig } from "../../data/config/testconfig"
import { categories as homepageCategories } from "../../data/homepage/categories.ts"
import dotenv from "dotenv"

dotenv.config()

test.describe("@feature_homepage ", () => {
  test.use({ storageState: 'playwright/.auth/user.json' })
  let poManager: POManager

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page)
    await page.goto(`${process.env.BASE_URL_E2E}/${testconfig.FE_URL.URL_HOMEPAGE}`)
  })

  test('Homepage is loaded with Carousel, Category menu and Product list', async () => {
    const homePage = poManager.getHomepage()

    await test.step('Verify carousel is displayed', async () => {
      await homePage.verifyCarouselIsVisible()
    })

    await test.step('Verify category menu contains correct items', async () => {
      await homePage.verifyCatergoryMenuContainsCorrectItems(homepageCategories)
    })

    await test.step('Verify product list is visible', async () => {
      await homePage.verifyProductListIsVisible()
    })
  })

})