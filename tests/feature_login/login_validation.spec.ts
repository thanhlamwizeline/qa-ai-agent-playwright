import { test, expect } from "@playwright/test"
import { POManager } from "../../page-objects/POManager"
import { CommonActions } from "../../helpers/CommonActionsHelpers"
import { testconfig } from "../../data/config/testconfig"
import dotenv from "dotenv"

dotenv.config()

test.describe("@login Login tests", () => {
  let poManager: POManager

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page)
    await page.goto(`${process.env.BASE_URL_E2E}/${testconfig.FE_URL.URL_HOMEPAGE}`)
  })

  //Verify user login successfully
  test("@smoke User can login successfully", async ({ page }) => {
    const username = process.env.username as string
    const password = process.env.password as string

    await test.step("Login with valid credentials", async () => {
      await CommonActions.login(poManager, username, password)
    })

    await test.step("Verify login success message appears", async () => {
      const loginPage = poManager.getLoginPage()
      await loginPage.verifyLoginSuccessfully(username)
    })
  })
  //Verify unsuccessful login (blank username or blank password)
  const invalidCredentials = [
  { username: "abc", password: process.env.password as string, expectedMessage: "Wrong password." },
  { username: process.env.username as string, password: "abc", expectedMessage: "Wrong password." },
]


  for (const data of invalidCredentials) {
    test(`@negative Login should fail when username="${data.username}" or password="${data.password}"`, async ({ page }) => {
      const loginPage = poManager.getLoginPage()
      await poManager.getHomepage().clickLogin()

      await test.step("Attempt login with invalid credentials", async () => {
        await loginPage.login(data.username, data.password)
      })

      await test.step("Verify login failed dialog message", async () => {
        await loginPage.verifyLoginFailedDialogIsDisplayed()
        await loginPage.verifyLoginFailedMessage(data.expectedMessage)
      })
    })
  }
})
