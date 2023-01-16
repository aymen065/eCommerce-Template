import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd, NavigationCancel, NavigationError, NavigationStart } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import icVisibility from '@iconify/icons-ic/twotone-visibility';
import icVisibilityOff from '@iconify/icons-ic/twotone-visibility-off';
import {fadeInUp400ms} from '../../../@vex/animations/fade-in-up.animation';
import {UserService} from '../../providers/user.service';
import { filter, first } from 'rxjs/operators';

import { AuthenticationService } from '../../providers/authentication.service'
import { DataService } from '../../providers/data.service'

import { HttpClient} from '@angular/common/http';
import { CampaignService } from '../../providers/campaign.service';

import { ToastrService } from 'ngx-toastr'


import {SlimLoadingBarService} from 'ng2-slim-loading-bar';
import { observable, Observable } from 'rxjs';
import { Influencer } from '../models/influencer';
import { throwMatDialogContentAlreadyAttachedError } from '@angular/material/dialog';
import { Advertiser } from '../models/advertiser';

@Component({
  selector: 'vex-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeInUp400ms
  ]
})
export class SigninComponent implements OnInit {
  form: FormGroup;
  email:FormControl;
  password:FormControl;
  influencer:Influencer;
  inputType = 'password';
  advertiser: Advertiser;
  visible = false;
  icVisibility = icVisibility;
  icVisibilityOff = icVisibilityOff;


  id: string = null;
  
  progressbar_visible = false;
  progressbar_value = 0;

  constructor(private router: Router,
              private fb: FormBuilder,
              private cd: ChangeDetectorRef,
              private snackbar: MatSnackBar,
              public userService: UserService,
              private _Activatedroute: ActivatedRoute,
              public authService: AuthenticationService,
              public dataService: DataService,
              public campService: CampaignService,
              private http: HttpClient,
              private toastr: ToastrService,
              public _loadingBar: SlimLoadingBarService
  ) {
    this._loadingBar.events.subscribe(items => {
      if(items.type == 0)
        this.progressbar_value = items.value;
    })
  }

  ngOnInit() {
     this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    }); 
    /*this.createFormControls();
    this.createForm();*/
    this._Activatedroute.paramMap.subscribe(params => {
      this.id = params.get('id');      
    });
    
    // this.router.events.pipe( filter((event) => event instanceof NavigationEnd)
    // ).subscribe((event: NavigationEnd) => {
    //    this.previousUrl = this.currentUrl;
    //    this.currentUrl = event.url;
    //    console.log('prev:', event.url);
    // });
    
  }

  createFormControls(){
    this.email = new FormControl('',Validators.required);
    this.password = new FormControl('',Validators.required);
  }
  createForm(){
    this.form = new FormGroup(
      {
        email:this.email,
      password:this.password
      }
      

    );
  }
  send() {
    this.router.navigate(['/']);
    this.snackbar.open('Lucky you! Looks like you didn\'t need a password or email address! For a real application we provide validators to prevent this. ;)', 'Got It!', {
      duration: 10000
    });
  }

  switchViewer(type) {
    
    if (type === 'panel/dashboard/home'){
      if(this.validateEmail(this.form.get('email').value)){
        if(this.form.get('email').value !== '' && this.form.get('password').value !== ''){
          
          this.progressbar_visible = true;
          this._loadingBar.start();
          
          if(this.id === 'brand'){
            //this.userService.currentUser.type = 'advertiser'; 
            this.advertiser= { 
              "id":0,
              "firstName":null,
              "lastName": null,
              "email": this.form.get('email').value,
              "password": this.form.get('password').value,
              "type": null,
              "avatar": null, 
              "phone":null,
              "fullName":null,
              "companyName":null,
              "birthDay":null,
              "gender":null,
              "address1":null,
              "address2":null,
              "city":null,
              "state":null,
              "zipCode":null,
              "category":null,
              "bio":null ,
              "brandsite":null, 
              "profileId":0
                       
            };
            this.dataService.AdvertiserSignIn(this.advertiser)
            .pipe(first())
            .subscribe(
              (data) => {
    
                
                /*this.authService.login(this.form.get('email').value, this.form.get('password').value)
                .pipe()
                .subscribe(cdata => {*/
      
                if(data == null){  
                  this._loadingBar.complete();
                  this.toastr.error('The email that you entered is incorrect. Please use a different email or contact us ','', {
                    timeOut: 3000,
                    positionClass: 'toast-bottom-right',
                    progressBar: true
                  });
                }
                  else
                  {
                    this.userService.advertiser = data;
                    this.userService.afterLogin('advertiser',this.form.get('email').value);
                    
                   
                 // this.userService.currentUser.email = this.form.get('email').value;
      
                  //this.userService.currentUser.profileId = content.profile_uuid;
      
                  this.progressbar_visible = true;
                  this._loadingBar.start();
                   localStorage.setItem('type', 'advertiser');
                     // this._loadingBar.complete();
                  this._loadingBar.complete();
                  this.router.navigate(['/panel/user/setting']);
                  }
                  
                //})
                
                
              }
              );




            
                  //this._loadingBar.complete();
                 // localStorage.setItem('type', this.userService.currentUser.type);
               //   this.router.navigate([type]);
             //this.userService.afterLogin('advertiser',this.form.get('email').value); 
            /*this.authService.login(this.form.get('email').value, this.form.get('password').value)
            .pipe(first())
            .subscribe(
              data => {
                console.log('data', data);
                // this.dataService.getMyAdvertiserProfile().pipe().subscribe((cdata : any) => { 
                  this.dataService.listOfAdvertisers().pipe().subscribe((cdata : any) => {
                  this.userService.afterLogin('advertiser'); 

                  this.userService.currentUser.avatar = cdata.results[0].profile_photo_url;
                  this.userService.currentUser.company = cdata.results[0].company_name;
                  this.userService.currentUser.email = this.form.get('email').value;
                  this.userService.currentUser.type = 'advertiser';
                  this.userService.currentUser.bio = cdata.results[0].about_company;
                  
                  this._loadingBar.complete();
                  this.router.navigate([type]);

                  localStorage.setItem('type', this.userService.currentUser.type);
                });
              },
              error => {
                // console.log('error',error.error.detail);
                this._loadingBar.complete();
                this.toastr.error('The email or password that you entered is not valid. Please try again or create a new account using sign up','', {
                  timeOut: 6000,
                  positionClass: 'toast-bottom-right',
                  progressBar: true
                });
            });*/
          }
          else{

            this.influencer = { 
              "id":0,
              "firstName":null,
              "lastName": null,
              "email": this.form.get('email').value,
              "password": this.form.get('password').value,
              "userId": 0,
              "type": null,
              "avatar": null, 
              "phone":null,
              "fullName":null,
              "birthDay":null,
              "gender":null,
              "address1":null,
              "address2":null,
              "city":null,
              "state":null,
              "zipCode":null,
              "cCards":null,
              "bankAccount":null,
              "category":null,
              "bio":null ,
              "brandsite":null, 
              "profileId":0
                       
            }
            this.dataService.InfluencerSignIn(this.influencer)
            .pipe(first())
            .subscribe(
              (data) => {
    
                
                /*this.authService.login(this.form.get('email').value, this.form.get('password').value)
                .pipe()
                .subscribe(cdata => {*/
      
                if(data == null){  
                  this._loadingBar.complete();
                  this.toastr.error('The email that you entered is incorrect. Please use a different email or contact us ','', {
                    timeOut: 3000,
                    positionClass: 'toast-bottom-right',
                    progressBar: true
                  });
                }
                  else
                  {
                    this.userService.influencer = data;
                    this.userService.afterLogin('influencer',this.form.get('email').value);
                    
                   
                 // this.userService.currentUser.email = this.form.get('email').value;
      
                  //this.userService.currentUser.profileId = content.profile_uuid;
      
                  this.progressbar_visible = true;
                  this._loadingBar.start();
                   localStorage.setItem('type', 'influencer');
                   //   this._loadingBar.complete();
                  this._loadingBar.complete();
                  this.router.navigate(['/panel/user/setting']);
                  }
                  
                //})
                
                
              }/*,
              error => {
                // console.log(error);
                this._loadingBar.complete();
                this.toastr.error('The email that you entered has been claimed by other users. Please use a different email or contact us at info@infinovae.com ','', {
                  timeOut: 6000,
                  positionClass: 'toast-bottom-right',
                  progressBar: true
                });
              }*/
            );
          }
         
       
        }
       
           
        
        else
          this.snackbar.open('Please fill out all fields', 'Got It!', {
            duration: 10000});
      }
      else {
        this.snackbar.open('Please enter a valid email', 'Got It!', {
          duration: 10000});
      }
    }
    else {      
        type = '/' + this.id + 'signup';
        this.router.navigate([type]);
    }
  }
  
  validateEmail(email:string) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(String(email).toLowerCase()))
    {
      return (true)
    }
    return false;
  }
  
  toggleVisibility() {
    if (this.visible) {
      this.inputType = 'password';
      this.visible = false;
      this.cd.markForCheck();
    } else {
      this.inputType = 'text';
      this.visible = true;
      this.cd.markForCheck();
    }
  }

 
}
