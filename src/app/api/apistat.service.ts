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


}
