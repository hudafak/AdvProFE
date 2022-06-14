import { Coordinates } from "./coordinates";

export class BusinessAdress {
  public adress: string;
  public city: string;
  public state: string;
  public postalCode: number;
  public coordinates: Coordinates;

  constructor() {
    this.adress = '';
    this.city = '';
    this.state = '';
    this.postalCode = null;
    this.coordinates = null;
  }
}
