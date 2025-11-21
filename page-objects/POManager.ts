import { Page } from '@playwright/test';

import { CartPage } from './CartPage';
import { Homepage } from './HomePage';
import { InventoryPage } from './InventoryPage';
import { LoginPage } from './LoginPage';
import { ProductDetailPage } from './ProductDetailPage';

export class POManager {
  private readonly page: Page;
  private readonly loginPage: LoginPage;
  private readonly homepage: Homepage;
  private readonly productDetailPage: ProductDetailPage;
  private readonly cartPage: CartPage;
  private readonly inventoryPage: InventoryPage;
    
  constructor(page: Page){
    this.page = page;
    this.loginPage = new LoginPage(this.page);
    this.homepage = new Homepage(this.page);
    this.productDetailPage = new ProductDetailPage(this.page);
    this.cartPage = new CartPage(this.page);
    this.inventoryPage = new InventoryPage(this.page);
  }

  getLoginPage(): LoginPage {
    return this.loginPage;
  }

  getHomepage(): Homepage {
    return this.homepage;
  }

  getProductDetailPage(): ProductDetailPage {
    return this.productDetailPage;
  }

  getCartPage(): CartPage {
    return this.cartPage;
  }

  getInventoryPage(): InventoryPage {
    return this.inventoryPage;
  }
}