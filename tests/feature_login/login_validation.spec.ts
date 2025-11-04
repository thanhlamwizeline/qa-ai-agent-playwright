import { test } from "@playwright/test"
import { POManager } from "../../page-objects/POManager"
import { CommonActions } from "../../helpers/CommonActionsHelpers"
import { TESTCONFIG } from "../../data/config/testconfig"
import { LOGIN_USER } from "../../data/login/loginUser"
import dotenv from "dotenv"

dotenv.config()

test.describe("@login Login tests", () => {
  let poManager: POManager

  test.beforeEach(async ({ page }) => {
    poManager = new POManager(page)
    await page.goto(`${process.env.BASE_URL_E2E}/${TESTCONFIG.FE_URL.URL_HOMEPAGE}`)
  })

  //Verify user login successfully
  test("@smoke User can login successfully", async () => {
    const username = LOGIN_USER.VALID_USER.userName
    const password = LOGIN_USER.VALID_USER.password

    await CommonActions.login(poManager, username, password)
    const loginPage = poManager.getLoginPage()
    await loginPage.verifyLoginSuccessfully(username)
  })

  const invalidCredentials = [ LOGIN_USER.INVALID_USER_1, LOGIN_USER.INVALID_USER_2]

  for (const data of invalidCredentials) {
    test(`@negative Login should fail when username="${data.userName}" or password="${data.password}"`, async () => {
      const loginPage = poManager.getLoginPage()

      await poManager.getHomepage().clickLogin()
      await loginPage.login(data.userName, data.password)
      await loginPage.verifyLoginFailedDialogIsDisplayed()
      await loginPage.verifyLoginFailedMessage(data.expectedMessage)
    })
  }
})
