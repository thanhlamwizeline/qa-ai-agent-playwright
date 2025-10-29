import { LoginPage } from "./LoginPage"
import { Homepage } from "./HomePage"
import { ProductDetailPage } from "./ProductDetailPage"
import { CartPage } from "./CartPage"
import { Page } from "@playwright/test"

export class POManager {
    private readonly page: Page
    private readonly loginPage: LoginPage
    private readonly homepage: Homepage
    private readonly productDetailPage: ProductDetailPage
    private readonly cartPage: CartPage
    
    constructor(page: Page){
        this.page = page
        this.loginPage = new LoginPage(this.page)
        this.homepage = new Homepage(this.page)
        this.productDetailPage = new ProductDetailPage(this.page)
        this.cartPage = new CartPage(this.page)
    }

    getLoginPage(){
        return this.loginPage
    }

    getHomepage(){
        return this.homepage
    }

    getProductDetailPage(){
        return this.productDetailPage
    }

    getCartPage(){
        return this.cartPage
    }
}