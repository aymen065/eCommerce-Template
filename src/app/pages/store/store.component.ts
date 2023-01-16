import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {Lightbox, LightboxConfig, LightboxEvent} from 'ngx-lightbox';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import {faAngleDoubleDown, faAngleDoubleUp, faArrowLeft, faArrowRight, faCartPlus, faDna, faMinus, faPlus, faSearch, faShoppingCart, faSignInAlt, faSignOutAlt, faSortAmountDownAlt, faSortAmountUp} from '@fortawesome/free-solid-svg-icons';
import {
	faStore,
	faUser,
	faWarehouse,
	faChartLine,
	faHandshake,
	faCubes
} from '@fortawesome/free-solid-svg-icons';
import {Router} from "@angular/router";
import { ClientService } from 'src/app/providers/client.service';
import { Product } from '../models/product';
import { Category } from '../models/category';
import { Type } from '../models/type';
import { SharedService } from 'src/app/providers/shared.service';
import { SessionService } from 'src/app/providers/session.service';
import { Bill } from '../models/bill';
import { OnChange } from 'ngx-bootstrap/utils';

@Component({
	selector: 'app-store',
	templateUrl: '../store/store.component.html',
	styleUrls: ['./store.component.scss'],
	providers:[
		Lightbox,
		LightboxConfig,
		LightboxEvent
	  ]
})
export class StoreComponent implements OnInit, OnDestroy {
	faSearch = faSearch;
	faCartPlus = faCartPlus;
	faDna = faDna;
	faSortAmountUp = faSortAmountUp;
	faSortAmountDownAlt = faSortAmountDownAlt;
	modalRef: BsModalRef;
	products: Product[] = [];
	addedProducts: Product[] = [];
	categories: Category[] = [];
	types: Type[] = [];
	bgPrimary = '';
	tcPrimary = '';
	countOfIndividualProduct: number[] = [];
	totalPriceOfIndividualProduct: number[] = [];
	pagination = {
		totalItem: 0,
		itemPerPage: 24,
		currentPage: 1,
		maxSize: 3
	};
	loginForm = {
		email: '',
		password: ''
	};
	displayProducts: Product[] = [];
	searchForm = {
		name: '',
		categoryName: '',
		typeName: ''
	};
	searchResults: Product[] = [];
	sortFlip = false;
	firstTimeSort = true;
	private subscriptions = new Subscription();
	isAdmin = false;
	isLoggedIn = false;
	faStore = faStore;
	faUser = faUser;
	faWarehouse = faWarehouse;
	faChartLine = faChartLine;
	faHandshake = faHandshake;
	faCubes = faCubes;
	isTest = false;
	faAngleDoubleUp = faAngleDoubleUp;
	faAngleDoubleDown = faAngleDoubleDown;
	faArrowLeft = faArrowLeft;
	faArrowRight = faArrowRight;
	faSignInAlt = faSignInAlt;
	faSignOutAlt = faSignOutAlt;
	faShoppingCart = faShoppingCart;
	faMinus = faMinus;
	faPlus = faPlus;
	countAddedProduct = 0;
	totalPriceOfAddedProduct = 0;
	cities: City[] = [];
	districts: District[] = [];
	cartForm = {
		phone: '',
		address: '',
		district: '',
		city: ''
	};
	signUpForm = {
		name: '',
		email: '',
		reEmail: '',
		password: '',
		rePassword: '',
		answer: '',
		reAnswer: '',
		phone: '',
		address: '',
		district: '',
		city: ''
	};

	constructor(private http: HttpClient,
	            private modalService: BsModalService,
	            private router: Router,
	            private clientService: ClientService,
	            private sharedService: SharedService,
	            private sessionService: SessionService,
	            private lightbox: Lightbox,
	            public translate: TranslateService) {
	}

	ngOnInit() {
		//this.isLoggedIn = localStorage.getItem('token') !== null && atob(localStorage.getItem('token')) !== '0+GUESS';
		//this.isAdmin = localStorage.getItem('token') !== null && atob(localStorage.getItem('token')).substring(atob(localStorage.getItem('token')).indexOf('+') + 1) === 'ADMIN';
		/*if (this.isAdmin) {
			this.router.navigate(['/admin']);
		}
		if (!this.isLoggedIn) {
			this.router.navigate(['/shop']);
		}*/
		this.getProducts();
		this.getCategories();
		this.getTypes();
		this.subscriptions.add(this.sharedService.getGlobalBackgroundPrimary().subscribe(bg => {
			this.bgPrimary = bg[0];
			this.tcPrimary = bg[1];
		}));
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}

	getProducts() {

		this.clientService.getProductList().subscribe((data) => {
				
			console.log("data",data);

					this.products = data._embedded.products;
					/*this.products.forEach(product => {
						product.imgUrl = product.imgUrl ? atob(product.imgUrl) : '';
						product.description = product.description.substr(0, 50) + (product.description.length > 60 ? '...' : '');
						//product.price = this.dataTranslateService.getPrice(product.price, 'vi');
					});*/
					this.searchResults = this.products;
					this.paging(this.searchResults);
				
			}, error => {
				console.log(`Error: ${error}`);
				this.products = [];
			}, () => {
			});
		}
	getCategories() {
		this.clientService.getAllCategories().subscribe(data => {
			
				this.categories = data._embedded.categories;
				this.searchForm.categoryName = this.categories[0].name;
			
		}, error => {
			console.log(`Error: ${error}`);
			this.categories = [];
			this.searchForm.categoryName = '';
		}, () => {
		});
	}
	openLoginModal(template: TemplateRef<any>) {
		this.modalRef = this.modalService.show(template);
	}

	getTypes() {
		this.clientService.getAllTypes().subscribe(data => {
			
				//this.types = data;
				data.forEach((type)=>{
					var t:Type = {
						id:type.id,
						name:type.name,
						categoryName : type.category.name
					}
					this.types.push(t);
					console.log("types",this.types);
				})
				this.searchForm.typeName = this.types[0].name;
			
		}, error => {
			console.log(`Error: ${error}`);
			this.types = [];
			this.searchForm.typeName = '';
		}, () => {
		});
	}

	paging(data: Product[]) {
		this.pagination.totalItem = data.length;
		this.displayProducts = data.slice((this.pagination.currentPage - 1) * this.pagination.itemPerPage,
			this.pagination.currentPage * this.pagination.itemPerPage);
	}

	onPageChanged(event: any) { // 1: 0 1 2 3   2: 4 5 6 7   3: 8 9 10 11
		this.displayProducts = this.searchResults.slice((event.page - 1) * event.itemsPerPage, event.page * event.itemsPerPage);
	}
	onLogin() {
		this.modalRef.hide();
		this.router.navigate(['/admin']);
	}

	openSignUpModal(template: TemplateRef<any>) {
		this.modalRef = this.modalService.show(template);
		this.modalRef.hide();
	}
	
	openCartModal(template: TemplateRef<any>) {
		this.cartForm.phone = localStorage.getItem('phone');
		let detailAddress = localStorage.getItem('detailAddress');
		let endAddress = detailAddress.indexOf(', ');
		let endDistrict = detailAddress.lastIndexOf(', ');
		this.cartForm.address = detailAddress.substring(0, endAddress);
		this.cartForm.district = detailAddress.substring(endAddress + 2, endDistrict);
		this.cartForm.city = detailAddress.substring(endDistrict + 2);
		this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
		
		
		
	}
	onSearch() {
		const searchResults: Product[] = [];
		this.products.forEach(product => {
			if (this.searchForm.name === '' && this.searchForm.typeName === product.typeName && this.searchForm.categoryName === product.categoryName) {
				searchResults.push(product);
			} else if (this.searchForm.name !== '' && product.name.toLowerCase().includes(this.searchForm.name.toLowerCase())) {
				searchResults.push(product);
			}
		});
		this.paging(searchResults);
		this.searchResults = searchResults;
	}

	onChangeCategory(mode: string) {
		if (mode === 'search') {
			this.searchForm.name = '';
			this.searchForm.typeName = this.types[this.types.findIndex(x => x.categoryName === this.searchForm.categoryName)].name;
			this.firstTimeSort = false;
		}
	}

	onChangeTypeSearch() {
		this.searchForm.name = '';
		this.firstTimeSort = false;
	}

	onOpenImage(index: number) {
		const album: {
			src: string;
			caption: string;
			thumb: string;
		}[] = [];
		const src = this.displayProducts[index].imgUrl;
		const thumb = this.displayProducts[index].imgUrl;
		let caption = '<b>' + this.displayProducts[index].name;
		let category = '';
		let type = '';
		let description: string;
		this.translate.get('DATA.' + this.displayProducts[index].categoryName).subscribe(rs => {
			category = rs;
		});
		this.translate.get('DATA.' + this.displayProducts[index].typeName).subscribe(rs => {
			type = rs;
		});
		description = this.displayProducts[index].description;
		caption += '</b> - (' + category + ' - ' + type + ').<br><i>' + description + '</i>';
		album.push({
			src,
			caption,
			thumb
		});
		this.lightbox.open(album, 0);
	}

	onSortPrice() {
		if (this.sortFlip) {
			this.products.sort((a, b) => a.price - b.price);
		} else {
			this.products.sort((a, b) => b.price - a.price);
		}
		const prevName = this.searchForm.name;
		this.searchForm.name = this.firstTimeSort && this.searchForm.name === '' ? ' ' : this.searchForm.name;
		this.onSearch();
		this.searchForm.name = prevName;
		this.sortFlip = !this.sortFlip;
	}

	//index: number
	/*onAddToCart(index: number) {
		//this.sessionService.updateNewlyAddedProduct(this.displayProducts[index]);
		//this.addedProducts.push(product);
		//console.log(this.addedProducts);
		this.clientService.getProductById(index).subscribe((data)=>{
			this.addedProducts.push(data._embedded.product);
			console.log(this.addedProducts);
			
		});
		
	}*/
	addProduct(i:number){
		
		this.clientService.getProductById(i).subscribe((data)=>{
			this.addedProducts.push(data);
			console.log(this.addedProducts);
			console.log("length",this.addedProducts.length);
			this.countAddedProduct = this.addedProducts.length;
			if(this.countAddedProduct>this.countOfIndividualProduct.length){
				this.countOfIndividualProduct.push(0);
				this.totalPriceOfIndividualProduct.push(0);
			}
			//this.ngOnInit();
			
		});
	}

	trackByFn(index, item) {
		return index;
	}
	
	login(){
		this.router.navigate(['/login']);
	}
	cancelAndDecreaseItem(index: number) {
		if (index === -1) {
			this.totalPriceOfAddedProduct = 0;
			this.countAddedProduct = 0;
			this.addedProducts.length = 0;
			this.countOfIndividualProduct.length = 0;
			this.totalPriceOfIndividualProduct.length = 0;
			return;
		}
		if(this.totalPriceOfAddedProduct - this.addedProducts[index].price >= 0){
		this.totalPriceOfAddedProduct -= this.addedProducts[index].price;
		if (this.countOfIndividualProduct[index] === 1) {
			this.addedProducts.splice(index, 1);
			this.countOfIndividualProduct.splice(index, 1);
			this.totalPriceOfIndividualProduct.splice(index, 1);
			--this.countAddedProduct;
		} else {
			--this.countOfIndividualProduct[index];
			this.totalPriceOfIndividualProduct[index] -= this.addedProducts[index].price;
		}
	}
	}

	increaseItem(index: number) {
		++this.countOfIndividualProduct[index];
		this.totalPriceOfIndividualProduct[index] += this.addedProducts[index].price;
		this.totalPriceOfAddedProduct += this.addedProducts[index].price;
	}
	onSettle() {
		let bills: Bill[] = [];
		let today = new Date();
		let todayStr = today.getUTCFullYear() + '-' + today.getUTCMonth() + '-' + today.getUTCDate() + ', ' + today.getUTCHours() + ':' + today.getUTCMinutes() + ':' + today.getUTCSeconds();
		let userId = parseInt(atob(localStorage.getItem('token')).substr(0, 1));
		for (let i = 0; i < this.addedProducts.length; ++i) {
			let bill: Bill = {
				placementDate: todayStr,
				productId: this.addedProducts[i].id,
				productQuantity: this.countOfIndividualProduct[i],
				price: Math.ceil(this.totalPriceOfIndividualProduct[i]),
				userId: null,
				settlementDate: todayStr,
				status: 'SUCCESS',
				phone: this.cartForm.phone,
				detailAddress: this.cartForm.address //+ ', ' + this.cartForm.district + ', ' + this.cartForm.city
			};
			if(bill.price != 0){
				this.clientService.createBill(bill).subscribe(() => {
					//alert("order sent succecfully");
		
					}, error => {
						console.log(`Error: ${error}`);
					}, () => {
						this.modalRef.hide();
					});
			}
			
				
			bills.push(bill);
		}
		
	}
	
}
interface City {
	name: string;
}

interface District {
	name: string;
	cityName: string;
}
