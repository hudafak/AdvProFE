import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Placeholder } from '../placeholder';
@Injectable({
  providedIn: 'root'
})
export class PlaceholderService {

  constructor(private http: HttpClient) { }

  async getPlaceholder() {
    const res = await this.http.get<any>('assets/data/placeholder.json')
      .toPromise();
    const data = <Placeholder[]>res.data;
    return data;
  }
}
