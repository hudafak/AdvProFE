import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Business } from '../model/business';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ApiStatService {
  businesses: Business[];
  private host = environment.apiUrl;
  constructor(private http: HttpClient) { }


  // get business and it's information
  public getBusiness(city: string, name: string): Observable<Business | HttpErrorResponse> {
    return this.http.get<Business>
      (`${this.host}/stat/business/custom/${city}/${name}`);
  }

  // get top 10 business world
  public getTopTenWorld(): Observable<Business[] | HttpErrorResponse> {

    return this.http.get<Business[]>
      (`${this.host}/stat/business/top/ten/total`);
  }

  public getAllBusinessInCity(): Observable<String[] | HttpErrorResponse> {

    return this.http.get<String[]>
      (`${this.host}/map/businesses/new orleans/`);
  }

  // get top 10 business world
  public getBusinessInfo(): Observable<Business | HttpErrorResponse> {
    return this.http.get<Business>
      (`${this.host}/stat/business/custom/New Orleans/Acme Oyster House`);
  }

  // get all Businesses
  public getAllBusinesses() {
    return this.http.get
      (`${this.host}/map/businesses/filtered/basic/empty/empty/empty/empty/empty`)
  }


  // public getAllBusinesses() {
  //   return this.http.get<any>
  //     ('../../assets/data/Businesses.json')
  //     .toPromise()
  //     .then(res => <Business[]>res.data)
  //     .then(data => { return data; })
  // }

  // filter Businesses
  public filterBusiness(state: string, city: string, stars: number, open: boolean, review: number): Observable<Business[] | HttpErrorResponse> {
    return this.http.get<Business[]>
      (`${this.host}/map/businesses/filtered/basic/${state}/${city}/${stars}/${open}/${review}`);
  }
}
