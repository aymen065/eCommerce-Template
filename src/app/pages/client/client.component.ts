import { ClientService } from 'src/app/providers/client.service';
import { Category } from '../models/category';
import { Product } from '../models/product';
import { Type } from '../models/type';
import { TranslateLoader, TranslateService, TranslateStore} from '@ngx-translate/core';
import {Lightbox, LightboxConfig, LightboxEvent} from 'ngx-lightbox';
import {
	faFileDownload,
	faFileUpload,
	faPen,
	faPlusSquare,
	faSearch,
	faSortAmountDownAlt,
	faSortAmountUp,
	faTrash
} from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'vex-client',
  templateUrl: '../client/client.component.html',
  styleUrls: ['./client.component.scss'],
  providers:[TranslateService,
    TranslateStore,
	Lightbox,
	LightboxConfig,
	LightboxEvent
  ]
  



})
export class ClientComponent implements OnInit {

  products: Product[] = [];
  searchResults: Product[] = [];
	currentId = 0;
	editIndex = 0;
  modalRef: BsModalRef;
	faSearch = faSearch;
	faPlusSquare = faPlusSquare;
	faPen = faPen;
	faTrash = faTrash;
	faFileUpload = faFileUpload;
	faFileDownload = faFileDownload;
	faSortAmountUp = faSortAmountUp;
	faSortAmountDownAlt = faSortAmountDownAlt;
  bgPrimary = '';
	tcPrimary = '';
	excelData: any[] = [];
	numOfSortableCol = 5; // name, price, quantity, saleAmount, id
	sortFlip: boolean[] = [];
	firstTimeSort = true;
	isSelected: boolean[] = [];
	isAdmin = false;
	//private subscriptions = new Subscription();
	translateWrongExcel = '';
	translateWrongFormat = '';
	translateImportSuccessful = '';

  displayProducts: Product[] = [];
	productsOriginalDescription: string[] = [];
	categories: Category[] = [];
	types: Type[] = [];
	pagination = {
		totalItem: 0,
		itemPerPage: 20,
		currentPage: 1,
		maxSize: 5
	};
	createForm = {
		name: '',
		description: '',
		price: 0,
		imgUrl: '',
		quantity: 0,
		saleAmount: 0,
		categoryName: '',
		typeName: ''
	};
	editForm = {
		name: '',
		description: '',
		price: 0,
		imgUrl: '',
		quantity: 0,
		saleAmount: 0,
		categoryName: '',
		typeName: ''
	};
	searchForm = {
		name: '',
		categoryName: '',
		typeName: ''
	};
  constructor(
    private clientService : ClientService,
    public translate: TranslateService,
    private lightbox: Lightbox,
    private modalService: BsModalService,
	
  ) {
   }

  ngOnInit(): void {
    this.getProducts();
		this.getCategories();
		this.getTypes();
		//this.isAdmin = localStorage.getItem('token') !== null && atob(localStorage.getItem('token')).substring(atob(localStorage.getItem('token')).indexOf('+') + 1) === 'ADMIN';
		//if (!this.isAdmin) {
		//	this.router.navigate(['/shop']);
		//}
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
		this.isSelected.length = 0;
		for (let i = 0; i < this.displayProducts.length; ++i) {
			this.isSelected.push(false);
		}
	}

  onPageChanged(event: any) { // 1: 0 1 2 3   2: 4 5 6 7   3: 8 9 10 11
		this.displayProducts = this.searchResults.slice((event.page - 1) * event.itemsPerPage, event.page * event.itemsPerPage);
		this.isSelected.length = 0;
		for (let i = 0; i < this.displayProducts.length; ++i) {
			this.isSelected.push(false);
		}
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
		} else if (mode === 'create') {
			this.createForm.typeName = this.types[this.types.findIndex(x => x.categoryName === this.createForm.categoryName)].name;
		} else if (mode === 'edit') {
			this.editForm.typeName = this.types[this.types.findIndex(x => x.categoryName === this.editForm.categoryName)].name;
		}
		this.firstTimeSort = false;
	}

	onChangeTypeSearch() {
		this.searchForm.name = '';
		this.firstTimeSort = false;
	}

 
  onRefreshCreateForm() {
		this.createForm = {
			name: '',
			description: '',
			price: 0,
			imgUrl: '',
			quantity: 0,
			saleAmount: 0,
			categoryName: '',
			typeName: ''
		};
	}

  onRefreshEditForm() {
		this.editForm = {
			name: '',
			description: '',
			price: 0,
			imgUrl: '',
			quantity: 0,
			saleAmount: 0,
			categoryName: '',
			typeName: ''
		};
	}

	openCreateModal(template: TemplateRef<any>) {
		this.modalRef = this.modalService.show(template);
	}

	onCreate() {
		
    var product = {
      "imgUrl":this.createForm.imgUrl,
      "price":this.createForm.price,
      "id": null,
	    "name": this.createForm.name,
	    "description": this.createForm.description,
	    "quantity": this.createForm.quantity,
	    "saleAmount": this.createForm.saleAmount,
    	"categoryName": this.createForm.categoryName,
	    "typeName": this.createForm.typeName

    }
    this.clientService.createProduct(product).subscribe(() => {
			this.getProducts();
		}, error => {
			console.log(`Error: ${error}`);
		}, () => {
		});
		this.modalRef.hide();
	}

	openEditModal(template: TemplateRef<any>, currentId: number) {
		this.modalRef = this.modalService.show(template);
		this.currentId = currentId;
		this.editForm = JSON.parse(JSON.stringify(this.products.find(x => x.id === this.currentId)));
		this.editIndex = this.products.findIndex(x => x.id === this.currentId);
		this.editForm.description = this.productsOriginalDescription[this.editIndex];
	}

	onEdit() {
		
    var product :any= {
      "imgUrl":this.editForm.imgUrl,
      "price":this.editForm.price,
      "id": this.currentId

    }
    this.clientService.editProduct(product).subscribe(() => {
			this.getProducts();
		}, error => {
			console.log(`Error: ${error}`);
		}, () => {
		});
	}

	onCloseEdit() {
		this.editForm.description = this.products[this.editIndex].description;
	}

	openDeleteModal(template: TemplateRef<any>, currentId: number) {
		this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
		this.currentId = currentId;
	}

	onDelete() {
		//if (this.isSelected.length === 1) {
			this.clientService.deleteProduct(this.currentId).subscribe((data) => {
				this.getProducts();
			}, error => {
				console.log(`Error: ${error}`);
			}, () => {
			});
			this.modalRef.hide();

			
		/*} else {
			const delProdIds: number[] = [];
			for (let i = 0; i < this.isSelected.length; ++i) {
				if (this.isSelected[i]) {
					delProdIds.push(this.displayProducts[i].id);
				}
			}*/
			/*this.http.request<any>('delete', `/api/product`, {body: delProdIds}).subscribe(data => {
				this.getProducts();
			}, error => {
				console.log(`Error: ${error}`);
			}, () => {
			});*/
		//}
	}

	openImportExcelModal(template: TemplateRef<any>) {
		this.modalRef = this.modalService.show(template);
	}

	onFileChange(evt: any) {
		const target: DataTransfer = (evt.target) as DataTransfer;
		if (target.files.length !== 1) {
			throw new Error('Cannot use multiple files');
		}
		if (target.files.item(0).type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
			alert(this.translateWrongExcel);
			return;
		}
		const reader: FileReader = new FileReader();
		reader.onload = (e: any) => {
			const bstr: string = e.target.result;
			const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

			const wsname: string = wb.SheetNames[0];
			const ws: XLSX.WorkSheet = wb.Sheets[wsname];

			this.excelData = XLSX.utils.sheet_to_json(ws, {header: ['id', 'name', 'description', 'imgUrl', 'price', 'quantity', 'saleAmount', 'typeName', 'categoryName']}).slice(1);
			if (!!this.excelData && typeof this.excelData === typeof this.products) {
				this.onImportExcel(this.excelData as Product[]);
			} else {
				alert(this.translateWrongFormat);
			}
		};
		reader.readAsBinaryString(target.files[0]);
	}

	onImportExcel(excelData: Product[]) {
		
    
    excelData.forEach((product)=>{
      product.price = this.clientService.getPrice(product.price, 'en');
      this.clientService.createProduct(product)
    });
	}

	onExportExcel() {
		const tempDescriptions: string[] = [];
		this.products.forEach((data, index) => {
			tempDescriptions[index] = data.description;
			data.description = this.productsOriginalDescription[index];
			if (this.translate.currentLang !== 'en-US') {
				data.price = this.clientService.getPrice(data.price, 'en');
			}
		});

		const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.products);

		const wb: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, `${this.translate.currentLang === 'en-US' ? 'Products' : 'Admin'}`);

		XLSX.writeFile(wb, `${this.translate.currentLang === 'en-US' ? 'data' : 'Admin'}-${new Date().toLocaleDateString(this.translate.currentLang)}-${new Date().toLocaleTimeString(this.translate.currentLang)}.xlsx`);

		this.products.forEach((data, index) => {
			data.description = tempDescriptions[index];
			if (this.translate.currentLang !== 'en-US') {
				data.price = this.clientService.getPrice(data.price, 'vi');
			}
		});
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
		description = this.productsOriginalDescription[this.productsOriginalDescription.findIndex(x => x.includes(this.displayProducts[index].description.substring(0, this.displayProducts[index].description.length - 3)))];
		caption += '</b> - (' + category + ' - ' + type + ').<br><i>' + description + '</i>';
		album.push({
			src,
			caption,
			thumb
		});
		this.lightbox.open(album, 0);
	}

	onSort(sortWhat: number) {
		// sortWhat <-> name, price, quantity, saleAmount, id
		if (this.sortFlip[sortWhat]) {
			switch (sortWhat) {
				case 0:
					this.products.sort((a, b) => a.name.localeCompare(b.name, this.translate.currentLang));
					break;
				case 1:
					this.products.sort((a, b) => a.price - b.price);
					break;
				case 2:
					this.products.sort((a, b) => a.quantity - b.quantity);
					break;
				case 3:
					this.products.sort((a, b) => a.saleAmount - b.saleAmount);
					break;
				case 4:
					this.products.sort((a, b) => a.id - b.id);
					break;
				default:
					break;
			}
		} else {
			switch (sortWhat) {
				case 0:
					this.products.sort((a, b) => b.name.localeCompare(a.name, this.translate.currentLang));
					break;
				case 1:
					this.products.sort((a, b) => b.price - a.price);
					break;
				case 2:
					this.products.sort((a, b) => b.quantity - a.quantity);
					break;
				case 3:
					this.products.sort((a, b) => b.saleAmount - a.saleAmount);
					break;
				case 4:
					this.products.sort((a, b) => b.id - a.id);
					break;
				default:
					break;
			}
		}
		const prevName = this.searchForm.name;
		this.searchForm.name = this.firstTimeSort && this.searchForm.name === '' ? ' ' : this.searchForm.name;
		this.onSearch();
		this.searchForm.name = prevName;
		this.sortFlip[sortWhat] = !this.sortFlip[sortWhat];
	}

	selectRow(index: number) {
		this.isSelected[index] = !this.isSelected[index];
	}

	trackByFn(index, item) {
		return index;
	}
}


