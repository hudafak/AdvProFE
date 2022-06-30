
import { Component, OnInit } from '@angular/core';
import { PlaceholderService } from '../services/placeholder.service';
import { Placeholder } from '../placeholder';
import { TableModule } from 'primeng/table';
import { ApiStatService } from '../api/apistat.service';
import { Business } from '../model/business';
@Component({
  selector: 'app-table-top10',
  templateUrl: './table-top10.component.html',
  styleUrls: ['./table-top10.component.scss']
})
export class TableTop10Component implements OnInit {
  placeholder: Placeholder[]
  data: any
  constructor(private placeholderService: PlaceholderService, private apiService: ApiStatService) { }

  ngOnInit(): void {
    this.apiService.getTopTenWorld().subscribe(x => {
      this.data = x;
    })
  }

}
