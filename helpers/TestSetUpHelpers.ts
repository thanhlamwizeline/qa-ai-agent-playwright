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
    
    await setup.step('Initialize test user credentials', async () => {
        username = `${process.env.username}`
        password = `${process.env.password}`
    })

    await setup.step('Navigate to application homepage', async () => {
        await page.goto(`${process.env.BASE_URL_E2E}`)
    })

    await setup.step('Perform user login', async () => {
        await CommonActions.login(poManager, username, password)
    })

    await setup.step('Verify login success and save authentication state', async () => {
        await poManager.getHomepage().verifyLogoutNavLinkVisibleOnHomePage()
        await page.context().storageState({ path: userFile })
    })
})