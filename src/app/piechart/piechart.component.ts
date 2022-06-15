import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-piechart',
  templateUrl: './piechart.component.html',
  styleUrls: ['./piechart.component.scss']
})
export class PiechartComponent implements OnInit {
  piechartdata: any;

  chartOptions: any;

  subscription: Subscription;



  constructor() { }

  ngOnInit(): void {
    this.piechartdata = {
      labels: ['Open', 'Closed'],
      datasets: [
        {
          data: [300, 100],
          backgroundColor: [
            "#42A5F5",
            "#66BB6A",
            "#FFA726"
          ],
          hoverBackgroundColor: [
            "#64B5F6",
            "#81C784",
            "#FFB74D"
          ]
        }
      ]
    };
  }
}
