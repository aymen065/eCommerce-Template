import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';

import {  Observable, Subject, of, throwError, BehaviorSubject } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {environment} from '../../environments/environment';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Advertiser } from '../pages/models/advertiser';
import { Influencer } from '../pages/models/influencer';
import { User, UserService } from './user.service';
import { Campaign } from '../pages/campaign/interfaces/campaign.interface';
import { Offer } from './campaign.service';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  private BASE = environment.REST_API_SERVER;
  /* social media (create only) endpoints */
  private INSTAGRAM_CREATE_USER_SOCIAL_ACCOUNT = this.BASE + '/accounts/instagram/';
  private YOUTUBE_CREATE_USER_SOCIAL_ACCOUNT = this.BASE + '/accounts/youtube/';
  private FACEBOOK_CREATE_USER_SOCIAL_ACCOUNT = this.BASE + '/accounts/facebook/';
  /* user account endpoints */
  private INFLUENCER_CREATE_ENDPOINT = this. BASE + '/influencer/signup'; // POST  
  private ADVERTISER_CREATE_ENDPOINT = this. BASE + '/accounts/brands/'; // POST
  private INFLUENCER_ME_ENDPOINT = this. BASE + '/influencers/search/getByEmail?email=${userService.currentUser.email}'; // GET
  private ADVERTISER_ME_ENDPOINT = this. BASE + '/accounts/brands/?owned_by_me=True'; // GET
  private INFLUENCER_LIST_ENDPOINT = this. BASE + 'influencers/'; //  GET
  private ADVERTISER_LIST_ENDPOINT = this. BASE + '/accounts/brands/'; // GET
  /* retrieve only (just append user_uuid at the end of endpoint) * eg: /accounts/influencers/UVF94-SDN48-SDFS/ */
  private INFLUENCER_RETRIEVE_ENDPOINT = this. BASE + '/influencers'; // PATCH
  private ADVERTISER_RETRIEVE_ENDPOINT = this. BASE + '/advertisers'; // PATCH
  private USER_RETRIEVE_ENDPOINT = this. BASE + '/userApps'; // PATCH


  // private INSTAGRAM_USER_SOCIAL_ACCOUNT_ACCESS_TOKEN = this. BASE + '/accounts/social/instagram'; // POST
  private FACEBOOK_USER_SOCIAL_ACCOUNT_ACCESS_TOKEN = this. BASE + '/accounts/social/facebook/'; // POST
  private GOOGLE_USER_SOCIAL_ACCOUNT_ACCESS_TOKEN = this. BASE + '/accounts/social/google/'; // POST

  private FACEBOOK_USER_SOCIAL_ACCOUNT_DISCONNET = this.BASE + '/accounts/social/facebook/disconnect' // POST

  private CAMPAIGN_CREATE_ENDPOINT =  this.BASE + '/campaigns/';  //POST
  private CAMPAIGN_GET_ENDPOINT = this.BASE + '/campaigns';   // GET /uuid
  private INFLUENCER_SIGN_iN = this.BASE + '/influencer/signin';//POST
  private ADVERTISER_SIGN_iN = this.BASE + '/advertiser/signin';//POST
  private ADVERTISER_CURRENT_LIST_CAMPAIGN_ENDPOINT = this.BASE + '/campaigns/?owned_by_me=True'; //GET

  private OFFER_SEND_ENDPOINT = this.BASE + '/offers/';  //POST
  private OFFER_LIST_CURRENT_ADVERTISER_ENDPOINT =  this.BASE + '/offers/?sent_by_me=True';  //GET
  private OFFER_LIST_CURRENT_INFLUENCER_ENDPOINT = this.BASE + '/offers/?receivedByMe=True'; // GET
  private OFFER_SPECIFIC = this.BASE + '/offers/'; //GET /uuid

  private PACKAGE_ADVERTISER_ENDPOINT =  this.BASE + '/packages/'; //PATCH /uuid
  private PACKAGE_INFLUENCER_ENDPOINT =  this.BASE + '/packages/'; //PATCH /uuid

  private SUBMISSION_REVIEWS_ADVERTISER_ENDPOINT = this.BASE + '/submission-reviews/'; // PATCH /uuid
  private SUBMISSION_REVIEWS_INFLUENCER_ENDPOINT = this.BASE + '/offers'; // PATCH /uuid

  private UPLOADED_CONTENT_ADVERTISER_ENDPOINT = this.BASE + '/uploaded-content-details/'; //GET /uuid
  private UPLOADED_CONTENT_INFLUENCER_ENDPOINT = this.BASE + '/uploaded-content-details/'; //PATCH /uuid

  private ADD_CAMPAIGN_TO_FAVORITES = this.BASE + '/campaign-favorite-list/'; // PATCH /uuid
  private RETRIEVE_FAVORITED_CAMPAIGNS_LIST = this.BASE + '/campaigns'; // GET
  private REMOVE_CAMPAIGN_FROM_CAMPAIGN_FAVORITES = this.BASE + '/campaign-favorite-list/'; // PATCH /uuid
  
  private ADD_CAMPAIGN_TO_MY_LIST = this.BASE + '/campaign-my-list/'; // PATCH /uuid
  private RETRIEVE_CAMPAIGN_MY_LIST = this.BASE + '/campaigns/'; // GET
  private REMOVE_CAMPAIGN_FROM_MY_LIST = this.BASE + '/campaign-my-list/'; // PATCH /uuid

  private ADD_INFLUENCER_TO_FAVORITE_LIST = this.BASE + '/influencer-favorite-list/'; // PATCH /uuid
  private RETRIEVE_INFLUENCER_TO_FAVORITE_LIST = this.BASE + '/influencers'; // GET
  private REMOVE_INFLUENCER_FROM_INFLUENCER_FAVORITE_LIST = this.BASE + '/influencer-favorite-list/'; // PATCH /uuid

  private ADD_INFLUENCER_TO_MYLIST = this.BASE + '/influencer-my-list/'; // PATCH /uuid
  private RETRIEVE_MYLIST_OF_INFLUENCERS = this.BASE + '/influencer-my-list/'; // GET
  private REMOVE_INFLUENCER_FROM_MYLIST = this.BASE + '/influencer-my-list/'; // PATCH /uuid

  private GET_LIST_OF_RATINGS_FOR_AN_INFLUENCER = this.BASE + "/ratings/?influencer=" // GET uuid

  private GET_A_LIST_OF_ALL_CONVERSATIONS_FOR_CURRENT_USER = this.BASE + '/conversations/'; // GET

  private CREATE_A_NEW_CONVERSATION = this.BASE + '/conversations/' // POST
  private GET_ALL_MESSAGES_FOR_A_GIVEN_CONVERSATION = this.BASE + '/conversations/'; // GET /conversation_uuid
  private SEND_A_MESSAGE_TO_A_CONVERSATION = this.BASE + '/conversations/'; // POST /conversation_uuid
  private MARK_CONVERSATION_AS_READ = this.BASE + '/conversations/'; // PATCH /conversation_uuid

  private CREATE_NEW_ADVERTISER = this. BASE + '/advertiser/signup'; // POST
  private LIST_OF_ADVERTISERS = this. BASE + '/getAllUsers'; // GET

  private chatChange = new Subject(); // used to announce change
  chatChangeStream = this.chatChange.asObservable(); // subscribed to, to listen for updates
  public notifications$ = new BehaviorSubject(null);
  
  constructor(private httpClient: HttpClient) { }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  createAuthorizationHeader(headers: HttpHeaders){
    const token = 'Bearer ' + localStorage.getItem('access_token');    
    if (token){
      // console.log('token', token);
      headers.append('Authorization', token);
      // headers.set("Authorization", token);
    }
    else{
      console.log('Error: Access token is null.');
    }
  }

  get(url){
    
    let token;
    if(localStorage.getItem('access_token') != null)
      token= 'Bearer ' + localStorage.getItem('access_token').replace(/['"]+/g, '');
      const header = new HttpHeaders().set("Authorization", token);
      // const header = new HttpHeaders();
      // this.createAuthorizationHeader(header);
      const options = {
        headers: header,
    };
    return this.httpClient.get(url, options).pipe(retry(3), catchError(this.handleError));
  }

  private buildURLWithPathVariables(url, pathVariables){ /* needs to be abstracted */
    return url + '/' + pathVariables;
  }

  post(url, data){
    // const header = new HttpHeaders();
    // this.createAuthorizationHeader(header);
    let token = null;
    if(localStorage.getItem('access_token') != null)
    {
      token= 'Bearer ' + localStorage.getItem('access_token').replace(/['"]+/g, '');
      const header = new HttpHeaders().set("Authorization", token);
      const options = {
        headers: header,
      };
      // console.log('post', data, url, header);
      // console.log('header', header);
      // console.log('body', data);
      return this.httpClient.post<any>(url, data,  options).pipe(catchError(this.handleError));
    }
    else
      return this.httpClient.post<any>(url, data).pipe(catchError(this.handleError));
  }

  put(url, data){
    // const header = new HttpHeaders();
    // this.createAuthorizationHeader(header);
    // // let token = 'Bearer ';
    // // if(localStorage.getItem('access_token') != null)
    // //   token = token + localStorage.getItem('access_token').replace(/['"]+/g, '');
    // // const header = new HttpHeaders().set("Authorization", token);
    // const options = {
    //   headers: header,
    // };
    // return this.httpClient.put(url, data,  options).pipe(catchError(this.handleError));
    let token = null;
    if(localStorage.getItem('access_token') != null)
    {
      token= 'Bearer ' + localStorage.getItem('access_token').replace(/['"]+/g, '');
      const header = new HttpHeaders().set("Authorization", token);
      const options = {
        headers: header,
      };
      // console.log('post', data, url, header);
      // console.log('header', header);
      // console.log('body', data);
      return this.httpClient.post<any>(url, data,  options).pipe(catchError(this.handleError));
    }
    else
      return this.httpClient.post<any>(url, data).pipe(catchError(this.handleError));
  }

  patch(url, data){
    
    let token = null;
    if(localStorage.getItem('access_token') != null)
    {
      token= 'Bearer ' + localStorage.getItem('access_token').replace(/['"]+/g, '');
      const header = new HttpHeaders().set("Authorization", token);
      const options = {
        headers: header,
      };
      // console.log('post', data, url, header);
      // console.log('header', header);
      // console.log('body', data);
      return this.httpClient.patch<any>(url, data,  options).pipe(catchError(this.handleError));
    }
    else
      return this.httpClient.patch<any>(url, data).pipe(catchError(this.handleError));
  }

  delete(url) {
    let token;
    if(localStorage.getItem('access_token') != null)
      token= 'Bearer ' + localStorage.getItem('access_token').replace(/['"]+/g, '');
      const header = new HttpHeaders().set("Authorization", token);
      // const header = new HttpHeaders();
      // this.createAuthorizationHeader(header);
      const options = {
        headers: header,
    };
    return this.httpClient.delete(url, options).pipe(retry(3), catchError(this.handleError));
  }
  getMyInfluencerProfile(currentUser) {
    console.log('getMyInfluencerProfile');
    return this.httpClient.get<Influencer>(`${environment.REST_API_SERVER}/influencers/search/getByEmail?email=${currentUser.email}`);
  }

  getMyAdvertiserProfile() {
    console.log('getMyAdvertiserProfile');
    return this.httpClient.get<any>(this.ADVERTISER_ME_ENDPOINT);
  }

  createInfluencerAccount(influencer : Influencer) {
    console.log('createInfluencerAccount');
    localStorage.removeItem('access_token');
    return this.httpClient.post<any>(this.INFLUENCER_CREATE_ENDPOINT, influencer);
  }
  AdvertiserSignIn(advertiser : Advertiser) {
    console.log('SignAdvertiserAccount');
    return this.httpClient.post<Advertiser>(this.ADVERTISER_SIGN_iN, advertiser);
  }
  InfluencerSignIn(influencer : Influencer) {
    console.log('SignInfluencerAccount');
    return this.httpClient.post<Influencer>(this.INFLUENCER_SIGN_iN, influencer);
  }
  

  createAdvertiserAccount(data) {
    localStorage.removeItem('access_token');
    return this.httpClient.post<any>(this.ADVERTISER_CREATE_ENDPOINT, data);
  }

  getInfluencersList() {
    return this.httpClient.get<any>(this.INFLUENCER_LIST_ENDPOINT);
  }

  getAdvertisersList() {
    return this.httpClient.get<any>(this.ADVERTISER_LIST_ENDPOINT);
  }

  sendInstaAccessToken(data) {
    // return this.post(this.INSTAGRAM_USER_SOCIAL_ACCOUNT_ACCESS_TOKEN, data);
  }

  sendFacebookAccessToken(data) {
    var formData: any = new FormData();
    formData.append('access_token', data);
    console.log(data);
    return this.post(this.FACEBOOK_USER_SOCIAL_ACCOUNT_ACCESS_TOKEN, formData);
  }

  sendGoogleAccessToken(data) {
    var formData: any = new FormData();
    formData.append('access_token', data);
    return this.httpClient.post<any>(this.GOOGLE_USER_SOCIAL_ACCOUNT_ACCESS_TOKEN, formData);
  }

  disconnectFB() {
    return this.httpClient.post<any>(this.FACEBOOK_USER_SOCIAL_ACCOUNT_DISCONNET, null);
  }

  updateUser(data , id:number) {
    let url = this.USER_RETRIEVE_ENDPOINT +'/'+id;
    console.log('updateUser patch url', url);
    return this.httpClient.patch<User>(url, data);
  }
  updateInfluencer(data , id:number) {
    let url = this.INFLUENCER_RETRIEVE_ENDPOINT +'/'+id;
    console.log('updateInfluencer patch url', url);
    return this.httpClient.patch<Influencer>(url, data);
  }

  updateAdvertiser(data,id) {
    let url = this.ADVERTISER_RETRIEVE_ENDPOINT+'/'+id;
    console.log('patch url', url);
    return this.httpClient.patch<Advertiser>(url, data);
  }
  
  createCampaign(data : Campaign) {
    return this.httpClient.post<Campaign>(this.CAMPAIGN_CREATE_ENDPOINT, data);
  }

  getCampaignList() {
    return this.httpClient.get<Campaign[]>(this.CAMPAIGN_GET_ENDPOINT);
  }

  getCampaign(id) {
    let url = this.CAMPAIGN_GET_ENDPOINT + id + '/';
    return this.httpClient.get<any>(url);
  }

  upddateCampaign(id, data) {
    let url = this.CAMPAIGN_GET_ENDPOINT + id + '/';
    // console.log('patch url', url);
    return this.httpClient.patch<any>(url, data);
  }

  deleteCampaign(id) {
    let url = this.CAMPAIGN_GET_ENDPOINT + id + '/';
    return this.delete(url);
  }

  getCurrentAdvertiserList() {
    return this.httpClient.get<any>(this.ADVERTISER_CURRENT_LIST_CAMPAIGN_ENDPOINT);
  }

  sendOffer(data) {
    return this.httpClient.post<any>(this.OFFER_SEND_ENDPOINT, data);
  }

  checkOffer(id, data) {
    let url = this.OFFER_SEND_ENDPOINT + id + '/?received_by_me=True';
    return this.httpClient.patch<any>(url, data);
  }

  getOfferListByAdvertiser() {
    return this.httpClient.get<any>(this.OFFER_LIST_CURRENT_ADVERTISER_ENDPOINT);
  }

  getOfferListByInfluencer () {
    return this.httpClient.get<any>(this.OFFER_LIST_CURRENT_INFLUENCER_ENDPOINT);
  }

  getSpecificAdvertiserOffer(id) {
    let url = this.OFFER_SEND_ENDPOINT + id + '/?sent_by_me=True';
    return this.httpClient.get<any>(url);
  }

  getSpecificInfluencerOffer(id) {
    let url = this.OFFER_SEND_ENDPOINT + id + '/?received_by_me=True';
    return this.httpClient.get<any>(url);
  }

  savePackageDetail(id, data) {
    let url = this.PACKAGE_ADVERTISER_ENDPOINT + id + '/';
    return this.httpClient.patch<any>(url, data);
    // if(localStorage.getItem('access_token') != null)
    // {
    //   var token= 'Bearer ' + localStorage.getItem('access_token').replace(/['"]+/g, '');
    //   const header = new HttpHeaders().set("Authorization", token);
    //   const options = {
    //     headers: header,
    //   };
    //   // console.log('post', data, url, header);
    //   // console.log('header', header);
    //   // console.log('body', data);
    //   return this.httpClient.post(url, data,  options).pipe(catchError(this.handleError));
    // }
  }

  receivePackage(id) {
    let url = this.PACKAGE_INFLUENCER_ENDPOINT + id + '/';
    var formData: any = new FormData();
    formData.append('package_received', true);
    return this.httpClient.patch<any>(url, formData);
  }

  postSubmission(data) {
    let url = this.SUBMISSION_REVIEWS_INFLUENCER_ENDPOINT + "/"+data.id;
    return this.httpClient.patch<any>(url, data);
  }

  reviewSubmission(id, data) {
    let url = this.SUBMISSION_REVIEWS_ADVERTISER_ENDPOINT + id + '/';
    return this.httpClient.patch<any>(url, data);
  }

  getUploadedContent(id) {
    let url = this.UPLOADED_CONTENT_ADVERTISER_ENDPOINT + id + '/';
    return this.httpClient.get<any>(url);
  }

  provideUploadedContent(id, data) {
    let url = this.UPLOADED_CONTENT_INFLUENCER_ENDPOINT + id + '/';
    return this.httpClient.patch<any>(url, data);
  }

  retrieveFavoritedCampaignsList(){
    return this.httpClient.get<Campaign[]>(this.RETRIEVE_FAVORITED_CAMPAIGNS_LIST);
  }

  addCampaignToFavorites(id, data) {
    let url = this.ADD_CAMPAIGN_TO_FAVORITES;
    return this.httpClient.patch<any>(url, data);
  }

  removeCampaignFromCampaignFavorites(id, data) {
    let url = this.REMOVE_CAMPAIGN_FROM_CAMPAIGN_FAVORITES;
    return this.httpClient.patch<any>(url, data);
  }

  retrieveCampaignToMyList(){
    return this.httpClient.get<Campaign>(this.RETRIEVE_CAMPAIGN_MY_LIST);
  }

  addCampaignToMyList(id, data) {
    let url = this.ADD_CAMPAIGN_TO_MY_LIST;
    return this.httpClient.patch<any>(url, data);
  }

  removeCampaignFromMyList(id, data) {
    let url = this.REMOVE_CAMPAIGN_FROM_MY_LIST;
    return this.httpClient.patch<any>(url, data);
  }

  retrieveInfluencerToFavoriteList(){
    return this.httpClient.get<any>(this.RETRIEVE_INFLUENCER_TO_FAVORITE_LIST);
  }

  addInfluencerToFavoriteList(id, data) {
    let url = this.ADD_INFLUENCER_TO_FAVORITE_LIST;
    return this.httpClient.patch<any>(url, data);
  }

  removeInfluencerFromInfluencerFavoriteList(id, data) {
    let url = this.REMOVE_INFLUENCER_FROM_INFLUENCER_FAVORITE_LIST;
    return this.httpClient.patch<any>(url, data);
  }

  retrieveMyListOfInfluencers(){
    return this.httpClient.get<any>(this.RETRIEVE_MYLIST_OF_INFLUENCERS);
  }

  addInfluencerToMyList(id, data) {
    let url = this.ADD_INFLUENCER_TO_MYLIST;
    return this.httpClient.patch<any>(url, data);
  }

  removeInfluencerFromMyList(id, data) {
    let url = this.REMOVE_INFLUENCER_FROM_MYLIST;
    return this.httpClient.patch<any>(url, data);
  }

  getListOfRatingsForAnInfluencer(id){
    let url = this.GET_LIST_OF_RATINGS_FOR_AN_INFLUENCER + id;
    return this.httpClient.get<any>(url);
  }

  getAListOfAllConversationsForCurrrentUser():Observable<Object>{
    return this.httpClient.get<any>(this.GET_A_LIST_OF_ALL_CONVERSATIONS_FOR_CURRENT_USER);
  }

  creatANewConversation(user_id, msg) {
    let data = 
    {
      "recipient" : user_id,
      "message" : msg
    }
    
    return this.httpClient.post<any>(this.CREATE_A_NEW_CONVERSATION, data);
  }

  getAllMessagesForAGivenConversation(conversation_id){
    let url = this.GET_ALL_MESSAGES_FOR_A_GIVEN_CONVERSATION + conversation_id + '/messages/';
    return this.httpClient.get<any>(url);
  }

  sendAMessageToAConversation(conversation_id, msg) {
    let data = 
    {
      "body" : msg
    }
    this.chatChange.next(true); // this approach would be refined with socket usage
    return this.httpClient.post<any>(this.SEND_A_MESSAGE_TO_A_CONVERSATION + conversation_id + '/sendMessage/', data);
  }

  markAsConvesationAsRead(conversation_id) {
    let url = this.MARK_CONVERSATION_AS_READ + conversation_id + '/markAsRead/';
    return this.httpClient.patch<any>(url, '');
  }

  createNewAdvertiser(adviser : Advertiser) {
    //localStorage.removeItem('access_token');
    return this.httpClient.post<any>(this.CREATE_NEW_ADVERTISER, adviser);
  }
  

  listOfAdvertisers(){
    return this.httpClient.get<any>(this.LIST_OF_ADVERTISERS);
  }
  /*getNotification() {
    return this.get(`${this.BASE}/notifications/`).subscribe((res: any) => {
      console.log("=====", res.results);
      // const tempData = [
      //   {
      //     notification_uuid: "50ecad92-717d-4ac9-84a1-cb302e3f1ecf",
      //     actioned: false,
      //     read: false,
      //     created_at: "2021-04-05T02:13:48.037955Z",
      //     notification_type: "NEW_OFFER",
      //     related_object_uuid: "e6f024f7-5a7d-46fe-ae85-49f522a97f3c",
      //     deep_link:
      //       "/panel/offer/e6f024f7-5a7d-46fe-ae85-49f522a97f3c",
      //     formatted_text: "You received an offer from Nike",
      //     notification_for: "2972a254-3f2e-4712-a2cd-7a2c9cae41e4",
      //   },
      //   {
      //     notification_uuid: "44f0a589-a974-456c-b70e-2747fffd9ccc",
      //     actioned: false,
      //     read: false,
      //     created_at: "2021-04-05T02:20:34.210352Z",
      //     notification_type: "NEW_OFFER",
      //     related_object_uuid: "e642ec2f-f1cf-4d5f-be7e-3f6c9c1fbd82",
      //     deep_link:
      //       "/panel/offer/e642ec2f-f1cf-4d5f-be7e-3f6c9c1fbd82",
      //     formatted_text: "You received an offer from Nike",
      //     notification_for: "2972a254-3f2e-4712-a2cd-7a2c9cae41e4",
      //   },
      //   {
      //     notification_uuid: "72a3be33-517d-45e3-9d7b-5365b04f2f9f",
      //     actioned: true,
      //     read: false,
      //     created_at: "2021-04-05T02:21:54.517799Z",
      //     notification_type: "NEW_OFFER",
      //     related_object_uuid: "f0b82d9c-ad1f-4564-b0ab-d47688cb152c",
      //     deep_link:
      //       "/panel/offer/f0b82d9c-ad1f-4564-b0ab-d47688cb152c",
      //     formatted_text: "You received an offer from Nike",
      //     notification_for: "2972a254-3f2e-4712-a2cd-7a2c9cae41e4",
      //   },
      // ];

      this.notifications$.next(res.results);
    });
  }

  setNotificationAction (id) {
    console.log('Call: [PATCH] /notifications/notification/:id/');
    this.patch(`${this.BASE}/notifications/${id}/`, null).subscribe(() => {
      this.getNotification();
    })
  }
  setMarkAsRead (ids) {
    console.log('Call: [PATCH] /notifications/markAsRead/');
    this.patch(`${this.BASE}/notifications/markAsRead/`, { notifs: ids }).subscribe(() => {
      this.getNotification();
    })
  }*/
}
