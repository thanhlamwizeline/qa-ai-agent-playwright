import { Page } from '@playwright/test';

import { CartPage } from './CartPage';
import { DetailPage } from './DetailPage';
import { Homepage } from './HomePage';
import { LoginPage } from './LoginPage';
import { ProductDetailPage } from './ProductDetailPage';
import { ViewGalleryPage } from './ViewGalleryPage';

export class POManager {
  private readonly page: Page;
  private readonly loginPage: LoginPage;
  private readonly homepage: Homepage;
  private readonly productDetailPage: ProductDetailPage;
  private readonly cartPage: CartPage;
  private readonly detailPage: DetailPage;
  private readonly viewGalleryPage: ViewGalleryPage;
    
  constructor(page: Page){
    this.page = page;
    this.loginPage = new LoginPage(this.page);
    this.homepage = new Homepage(this.page);
    this.productDetailPage = new ProductDetailPage(this.page);
    this.cartPage = new CartPage(this.page);
    this.detailPage = new DetailPage(this.page);
    this.viewGalleryPage = new ViewGalleryPage(this.page);
  }

  getLoginPage(){
    return this.loginPage;
  }

  getHomepage(){
    return this.homepage;
  }

  getProductDetailPage(){
    return this.productDetailPage;
  }

  getCartPage(){
    return this.cartPage;
  }

  getDetailPage(){
    return this.detailPage;
  }

  getViewGalleryPage(){
    return this.viewGalleryPage;
  }
}