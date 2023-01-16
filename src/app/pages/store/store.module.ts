import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {StoreRoutingModule} from './store-routing.module';
import {StoreComponent} from './store.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LightboxModule } from 'ngx-lightbox';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PaginationModule } from 'ngx-bootstrap/pagination';


@NgModule({
	declarations: [StoreComponent],
	imports: [
		CommonModule,
    FormsModule,
    FontAwesomeModule,
		ModalModule,
		PaginationModule,
		TooltipModule,
		CarouselModule,
		LightboxModule,
		NgxSpinnerModule,
	]
})
export class StoreModule {
}
