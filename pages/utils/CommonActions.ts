import {POManager} from "../POManager"

export class CommonActions {
    static async clearCart(poManager: POManager){
        await poManager.getHomepage().goToCart()
        await poManager.getCartPage().clearCart()
    }

    static async login(poManager: POManager, username: string, password: string){
        await poManager.getHomepage().clickLogin()
        await poManager.getLoginPage().login(username, password)
        await poManager.getLoginPage().verifyLoginSuccessfully(username)
    }
}
