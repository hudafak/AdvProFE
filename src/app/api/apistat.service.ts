import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Business } from '../model/business';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ApiStatService {
  businesses: any;
  private host = environment.apiUrl;
  constructor(private http: HttpClient) { }


  // get business and it's information
  public getBusiness(city: string, name: string): Observable<Business | HttpErrorResponse> {
    return this.http.get<Business>
      (`${this.host}/stat/business/custom/${city}/${name}`);
  }

  // get all businesses
  async getAllBusiness() {
    this.businesses = await this.http.get("${this.host}/map/preview").toPromise();

    //return await this.http.get<Business[]>
    //  (`${this.host}/map/preview`);
  }

  // store all businesses in localcache
  public addBusinessToLocalCache(business: Business[]): void {
    localStorage.setItem('businesses', JSON.stringify(business));
  }
  // get all businesses from localcache
  public getBusinessFromLocalCache(): Business[] {
    if (localStorage.getItem('businesses')) {
      return JSON.parse(localStorage.getItem('businesses'));
    }
    return null;
  }
}
