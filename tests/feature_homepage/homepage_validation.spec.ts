import { test } from "@playwright/test"
import { POManager } from "../../page-objects/POManager"
import { TESTCONFIG } from "../../data/config/testconfig"
import { CATEGORIES as homepageCategories } from "../../data/homepage/categories.ts"
import dotenv from "dotenv"

dotenv.config()

test.describe("@feature_homepage ", () => {
  test.use({ storageState: 'playwright/.auth/user.json' })
  let poManager: POManager

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page)
    await page.goto(`${process.env.BASE_URL_E2E}/${TESTCONFIG.FE_URL.URL_HOMEPAGE}`)
  })

  test('Homepage is loaded with Carousel, Category menu and Product list', async () => {
    const homePage = poManager.getHomepage()

    await homePage.verifyCarouselIsVisible()
    await homePage.verifyCatergoryMenuContainsCorrectItems(homepageCategories)
    await homePage.verifyProductListIsVisible()
  })

})
