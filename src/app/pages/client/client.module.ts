import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientComponent } from './client.component';
import { FormsModule } from '@angular/forms';
import {CarouselModule} from 'ngx-bootstrap/carousel';
import {ModalModule} from 'ngx-bootstrap/modal';
import {PaginationModule} from 'ngx-bootstrap/pagination';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {LightboxModule} from 'ngx-lightbox';
import {NgxSpinnerModule} from 'ngx-spinner';
import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';




@NgModule({
  declarations: [ClientComponent],
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
    

    
    

  ],
  

})


export class ClientModule { }

