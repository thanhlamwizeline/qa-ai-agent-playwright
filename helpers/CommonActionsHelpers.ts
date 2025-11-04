import {POManager} from "../page-objects/POManager"
import { test } from "@playwright/test"

export class CommonActions {
    static async clearCart(poManager: POManager){
        return await test.step('Step: CommonActions.clearCart()', async () => {
            await poManager.getHomepage().goToCart()
            await poManager.getCartPage().clearCart()
        })
    }

    static async login(poManager: POManager, username: string, password: string){
        return await test.step(`Step: CommonActions.login("${username}")`, async () => {
            await poManager.getHomepage().clickLogin()
            await poManager.getLoginPage().login(username, password)
            await poManager.getLoginPage().verifyLoginSuccessfully(username)
        })
    }
}
