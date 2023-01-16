import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Bill } from "../pages/models/bill";
import { Product } from "../pages/models/product";

@Injectable({
    providedIn: 'root'
  })
  
  export class ClientService {
    
    private BASE = environment.REST_API_SERVER;
    constructor(private http: HttpClient) { }

    getProductList() {
        return this.http.get<any>(this.BASE+'/products');
      }
    createProduct(product:Product){
        return this.http.post<Product>(this.BASE+'/products',product);
    }
    getPrice(price: number, lang: string): number {
		const ratio = 23000.0;
		const offset = 9770;
		if (lang === 'vi') {
			return price * ratio - offset;
		}
		return (price + offset) / ratio;
	}

	getLocale(lang: string): string {
		if (lang === 'vi') {
			return 'vi-VN';
		}
		return 'en-US';
	}
    editProduct(product : Product){
        return this.http.patch<Product>(this.BASE+'/products/'+product.id , product);

    }
    deleteProduct(id){
      return this.http.delete<Product>(this.BASE+'/products/'+id);

    }

    getAllCategories() {
      return this.http.get<any>(this.BASE+'/categories');
    }
    getAllTypes() {
      return this.http.get<any>(this.BASE+'/types')
    }
    getProductById(id:number){
      return this.http.get<any>(this.BASE+'/products/'+id);

    }
    createBill(bill){
      return this.http.post<Bill>(this.BASE+'/bills', bill)
    }
    
  }