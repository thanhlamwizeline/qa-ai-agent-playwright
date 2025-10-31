import { test as setup, expect } from '@playwright/test'
import { POManager } from '../page-objects/POManager'
import { CommonActions } from "./CommonActionsHelpers"

import dotenv from "dotenv"

dotenv.config()
let poManager:POManager 
let username: string
let password: string

const userFile = 'playwright/.auth/user.json'
setup('Authenticate as singed in user', async ({ page }) => {
    poManager = new POManager(page)
    // Perform authentication steps.
    username = `${process.env.username}`
    password = `${process.env.password}`
    await page.goto(`${process.env.BASE_URL_E2E}`)
    await CommonActions.login(poManager, username, password)
    // Wait until the page receives the cookies.
    // Sometimes login flow sets cookies in the process of several redirects.
    // Alternatively, you can wait until the page reaches a state where all cookies are set.
    await poManager.getHomepage().verifyLogoutNavLinkVisibleOnHomePage()
    // End of authentication steps.
    await page.context().storageState({ path: userFile })
})