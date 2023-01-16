import {Component, Inject, OnInit, Renderer2} from '@angular/core';
import {scaleIn400ms} from '../../../../@vex/animations/scale-in.animation';
import {fadeInRight400ms} from '../../../../@vex/animations/fade-in-right.animation';
import {stagger40ms} from '../../../../@vex/animations/stagger.animation';
import {fadeInUp400ms} from '../../../../@vex/animations/fade-in-up.animation';
import {scaleFadeIn400ms} from '../../../../@vex/animations/scale-fade-in.animation';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../providers/user.service';
import {DOCUMENT} from '@angular/common';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { DataService } from 'src/app/providers/data.service';

@Component({
  selector: 'vex-user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.scss'],
  animations: [
    scaleIn400ms,
    fadeInRight400ms,
    stagger40ms,
    fadeInUp400ms,
    scaleFadeIn400ms
  ]
})
export class UserSettingComponent implements OnInit {
  imageChangedEvent: any = '';
  croppedImage: string = '';

  constructor(private route: ActivatedRoute,
              private renderer: Renderer2,
              @Inject(DOCUMENT) private document: Document,
              private router: Router,
              public userService: UserService,
              public dataService:DataService) {
    this.renderer.addClass(this.document.body, 'user-page');
  }

  ngOnInit(): void {
    this.userService.afterLogin(this.userService.currentUser.type,this.userService.currentUser.email);
    console.log(JSON.parse(localStorage.getItem('currentUser')));

  }
  onFileChange(event) {
    
    const reader = new FileReader();
    const cf = document.querySelectorAll('.img-cropping-wrapper')[0];

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      //console.log(event.name);

      reader.onload = () => {
         this.userService.currentUser.avatar = reader.result as string;
        
      };

      this.imageChangedEvent = event;
      cf.classList.add('opened');
    }
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.userService.currentUser.avatar = this.croppedImage;
    
  }
  saveCroppedImage() {
    this.userService.currentUser.avatar = this.croppedImage;
    this.dataService.updateUser(this.userService.currentUser,this.userService.currentUser.id).subscribe((data)=>{
      this.userService.currentUser=data;
      localStorage.setItem('currentUser', JSON.stringify(this.userService.currentUser));

    })
    console.log(this.userService.currentUser);
    const cf = document.querySelectorAll('.img-cropping-wrapper')[0];
    cf.classList.remove('opened');
  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

}
