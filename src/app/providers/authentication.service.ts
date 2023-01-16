import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {User, UserService} from './user.service';
import {environment} from '../../environments/environment';
import { Advertiser } from '../pages/models/advertiser';
import { Influencer } from '../pages/models/influencer';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
       // this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        //this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(userName: string, password: string) {
        return this.http.post<any>(`${environment.REST_API_SERVER}/login`, { userName, password })
            .pipe(map(user => {
                // store jwt token in local storage to keep user logged in between page refreshes
                //localStorage.setItem('access_token', "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGVzIjpbIkFETUlOIiwiVVNFUiJdLCJpc3MiOiIvbG9naW4iLCJleHAiOjE2NjgzMDgyMDF9.xybhveDc4qfK-Ok5ioMVsFdTLgZUlR0bkW535NhL8DA");
                //localStorage.setItem('refresh_token', JSON.stringify(user.refresh));
                this.currentUserSubject.next(user);
                return user;
            }));
    }
    getusers(){
        localStorage.setItem('access_token', "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGVzIjpbIkFETUlOIiwiVVNFUiJdLCJpc3MiOiIvbG9naW4iLCJleHAiOjE2NjgzMDgyMDF9.xybhveDc4qfK-Ok5ioMVsFdTLgZUlR0bkW535NhL8DA");
        return this.http.get<any>(`${environment.REST_API_SERVER}/getAllUsers`);
    }
    getAdvertiserByEmail(email:string){
        return this.http.get<Advertiser>(`${environment.REST_API_SERVER}/advertisers/search/getByEmail?email=${email}`);
    }
    getInfluencerByEmail(email:string){
        return this.http.get<Influencer>(`${environment.REST_API_SERVER}/influencers/search/getByEmail?email=${email}`);
    }
    getUserByEmail(email:string){
        return this.http.get<User>(`${environment.REST_API_SERVER}/userApps/getByEmail?email=${email}`);

    }
    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('type');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentUserProfile');
        
        //this.currentUserSubject.next(null);
    }

    refresh(){
        const refresh = localStorage.getItem('refresh_token');
        return this.http.post<any>(`${environment.REST_API_SERVER}/accounts/token/refresh`, {refresh})
            .pipe(map(user => {
                // store jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('access_token', JSON.stringify(user.access));
                this.currentUserSubject.next(user);
                return user;
            }));
    }
}
