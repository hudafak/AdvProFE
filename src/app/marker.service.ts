import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class MarkerService {
  capitals: string = 'localhost:8080/map/businesses/filtered/basic/empty/empty/empty/empty/empty';
  constructor(private http: HttpClient) {

  }

  makeCapitalMarkers(map: L.Map): void {
    this.http.get(this.capitals).subscribe((res: any) => {
      for (const c of res.data) {
        const lon = c.longitude;
        const lat = c.latitude;
        const marker = L.marker([lat, lon]);

        marker.addTo(map);
      }
    });



  }
}
