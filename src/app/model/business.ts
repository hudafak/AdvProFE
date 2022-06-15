import { BusinessAdress } from "./businessAdress";
import { OpeningHours } from "./openingHours";

export class Business {
  public id: String;
  public name: string;
  public adress: BusinessAdress;
  public stars: number;
  public reviewCount: number;
  public isOpen: boolean;
  public attributes: string;
  public categories: string;
  public hours: OpeningHours;
  private checkins: Date;

  constructor() {
    this.id = '';
    this.name = '';
    this.adress = null;
    this.stars = null;
    this.reviewCount = null;
    this.isOpen = null;
    this.attributes = '';
    this.categories = '';
    this.hours = null;
    this.checkins = null;
  }
}
