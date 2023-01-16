import { ComponentFactory } from "@angular/core";

export class Advertiser{
    id:number;
    email :string;
    password : string;
    companyName : string;
    type: "advertiser" | "influencer";
    avatar: string;
    phone: string;
    fullName: string;
    birthDay: string;
    gender: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zipCode: string;
    category: string[];
    bio: string;
    brandsite: string;
    profileId: number;
    firstName : string;
    lastName : string;
}


