import { BusinessAdress } from "./businessAdress";
import { OpeningHours } from "./openingHours";

export class Business {
  public id: String;
  public businessid: String;
  public name: string;
  public adress: String;
  public city: String;
  public state: String;
  public postalCode: number;
  public latitude: String;
  public longitude: String;
  public stars: number;
  public reviewCount: number;
  public isOpen: boolean;
  public categories: string[];



  constructor() {
    this.id = '';
    this.businessid;
    this.name = '';
    this.adress = null;
    this.city = ''
    this.state = ''
    this.postalCode = null
    this.latitude = ''
    this.longitude = ''
    this.stars = null;
    this.reviewCount = null;
    this.isOpen = null;
    this.categories = [];
  }
}
