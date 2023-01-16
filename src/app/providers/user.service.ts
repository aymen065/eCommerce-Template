import { Injectable } from '@angular/core';
import {BankAcc, CCard} from '../pages/campaign/interfaces/payment.interface';
import {Profile, Analyze} from '../pages/campaign/interfaces/profile.interface';
import {profileData} from '../../static-data/profiles';
import {DataService} from './data.service';
import { AuthenticationService } from './authentication.service';
import { Advertiser } from '../pages/models/advertiser';
import { Observable } from 'rxjs';
import { Influencer } from '../pages/models/influencer';


export interface User {
    id: number;
    type: 'advertiser' | 'influencer';
    avatar: string;
    email: string;
    phone?: string;
    fullName: string;
    companyName?: string;
    birthDay?: string;
    gender?: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    cCards?: CCard[];
    bankAccount?: BankAcc;
    category?: string[];
    bio?: string;
    brandsite: string;
    profileId: number;
}

@Injectable({
    providedIn: 'root'
})


export class UserService {
    influencer : Influencer;
    advertiser : Advertiser;
    currentUser: User;
    currentUserProfile: Profile ;
    user:Observable<User>
    currentAdvertiser:Observable<Advertiser>;
    currentInfliencer:Observable<Influencer>;
    currentUserAnalyze: Analyze[] = [
        {
          profile_id: 1,
          platform: '',
          followers: {
              value: 0,
              change: 0,
          },
          likes: {
              value: 0,
              change: 0,
          },
          posting: {
              value: 0,
              change: 0,
          },
          comments: {
              value: 0,
              change: 0,
          },
          rate: {
              value: 0,
          },
          post_urls: [],
      },
      {
          profile_id: 1,
          platform: '',
          followers: {
              value: 0,
              change: 0,
          },
          likes: {
              value: 0,
              change: 0,
          },
          posting: {
              value: 0,
              change: 0,
          },
          comments: {
              value: 0,
              change: 0,
          },
          rate: {
              value: 0,
          },
          post_urls: [],
      }
    ];
    

    profiles = profileData;

    instaLoginStatus: boolean = false;
    instaAvatar: string = null;
    instaName: string = null;

    constructor(private dataService: DataService,
        private authService: AuthenticationService) {

        this.userInit();
    }
    get Profile(): Profile {
        const profile = this.profiles.find(p => p.id === Number(this.currentUser.id));
        return profile;
    }
    userInit() {
        const type = localStorage.getItem('type');

            

            this.currentUserProfile=JSON.parse(localStorage.getItem('currentUserProfile'));
           // console.log(this.currentUserProfile);
       
            this.currentUser=JSON.parse(localStorage.getItem('currentUser'));
           // console.log(this.currentUser);
    }


    

    afterLogin(type : string, email: string) {
        if(email!==''){
            console.log(type);
        if (type === 'advertiser') {
                console.log("reaquète en cours d'envoie");
                this.currentAdvertiser = this.authService.getAdvertiserByEmail(email);
                this.currentAdvertiser.subscribe((data)=>{
                    /*this.currentUser = {
                        id: 1,
                        avatar: '../../../../assets/img/brand.png',
                        email: data.email,
                        fullName: '',
                        birthDay: '',
                        phone: '',
                        gender: '',
                        type: 'advertiser',
                        company: 'Nike, Inc',
                        brandsite: 'http://www.nike.com',
                        bio: 'NIKE is an American multinational corporation sales of footwear, apparel, equipment, accessories, and services. It is the world’s largest supplier of athletic shoes and apparel.',
                        category: ['beauty', 'technology'],
                        profileId: data.id,
                    };*/

                    this.currentUser={
                        id:data.id,
                        bio:data.bio,
                        gender : data.gender,
                        birthDay : data.birthDay,
                        companyName: data.companyName,
                        profileId: data.profileId,
                        avatar: data.avatar,
                        brandsite: data.brandsite,
                        phone: data.phone,
                        city: data.city,
                        state: data.state,
                        fullName : data.fullName,
                        email : data.email,
                        type :'advertiser',
                        category : data.category,
                        
                    };
                    console.log(this.currentUser);
    
                  this.currentUserProfile = {
                    id: data.id,
                    profile_bg: '../../../../assets/img/demo/profile-bg-01.jpg',
                    photo_img: data.avatar,
                    name: data.fullName,
                    userid: '',
                    socials: ['instagram', 'facebook', 'youtube'],
                    gender: data.gender,
                    ages: [18, 25],
                    sayings: 'I love taking pictures and enjoy experiencing a new journey in my life. I’ll be happy if I work with you!Check my new video in Youtube! Link',
                    video: 'youtube.com',
                    categories: data.category,
                    acheivedCampaign: 56,
                    followers: 2500,
                    followers_change: 0.3,
                    posts: 30,
                    hotness: 99,
                    price: '50-60',
                    favorited: false,
                    
                };
                })  ;  
                localStorage.removeItem("currentUserProfile");
                localStorage.removeItem("currentUser");  
                localStorage.setItem('currentUserProfile', JSON.stringify(this.currentUserProfile));
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                console.log(this.currentUser);
                console.log(this.currentUserProfile);

                
           
           
        }else{
            
            this.currentInfliencer = this.authService.getInfluencerByEmail(email);
            this.currentInfliencer.subscribe((data)=>{

                this.currentUser={
                    id:data.id,
                    bio:data.bio,
                    gender : data.gender,
                    birthDay : data.birthDay,
                    profileId: data.profileId,
                    avatar: data.avatar,
                    brandsite: data.brandsite,
                    phone: data.phone,
                    city: data.city,
                    state: data.state,
                    fullName : data.firstName +' '+data.lastName,
                    email : data.email,
                    type :'influencer',
                    category : data.category,
                    
                }
                


              this.currentUserProfile = {
                id: data.id,
                profile_bg: '../../../../assets/img/demo/profile-bg-01.jpg',
                photo_img: data.avatar,
                name: data.fullName,
                userid: '',
                socials: ['instagram', 'facebook', 'youtube'],
                gender: data.gender,
                ages: [18, 25],
                sayings: 'I love taking pictures and enjoy experiencing a new journey in my life. I’ll be happy if I work with you!Check my new video in Youtube! Link',
                video: 'youtube.com',
                categories: data.category,
                acheivedCampaign: 56,
                followers: 2500,
                followers_change: 0.3,
                posts: 30,
                hotness: 99,
                price: '50-60',
                favorited: false,
                
            };
            /*localStorage.setItem('currentUserProfile', JSON.stringify({
                id: data.id,
                profile_bg: '../../../../assets/img/demo/profile-bg-01.jpg',
                photo_img: data.avatar,
                name: data.fullName,
                userid: '',
                socials: ['instagram', 'facebook', 'youtube'],
                gender: data.gender,
                ages: [18, 25],
                sayings: 'I love taking pictures and enjoy experiencing a new journey in my life. I’ll be happy if I work with you!Check my new video in Youtube! Link',
                video: 'youtube.com',
                categories: data.category,
                acheivedCampaign: 56,
                followers: 2500,
                followers_change: 0.3,
                posts: 30,
                hotness: 99,
                price: '50-60',
                favorited: false
                
            }));*/
                
            });
            localStorage.setItem('currentUserProfile', JSON.stringify(this.currentUserProfile));
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            
           // console.log(this.currentUser);
            //console.log(this.currentUserProfile);


            
           
           
            
        }
    }
    }
}
