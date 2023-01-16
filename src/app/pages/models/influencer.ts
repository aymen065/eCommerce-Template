import { User } from "src/app/providers/user.service";
import { CCard, BankAcc } from "../campaign/interfaces/payment.interface";

export class Influencer  {
    userId: number;
    type: "advertiser" | "influencer";
    avatar: string;
    phone?: string;
    fullName: string;
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
    brandsite?: string;
    profileId: number;
    id:number;
    email :string;
    password : string;
    firstName : string;
    lastName : string;
}