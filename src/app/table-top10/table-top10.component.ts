
import { Component, OnInit } from '@angular/core';
import { PlaceholderService } from '../services/placeholder.service';
import { Placeholder } from '../placeholder';
import { TableModule } from 'primeng/table';
@Component({
  selector: 'app-table-top10',
  templateUrl: './table-top10.component.html',
  styleUrls: ['./table-top10.component.scss']
})
export class TableTop10Component implements OnInit {
  placeholder: Placeholder[]
  constructor(private placeholderService: PlaceholderService) { }

  ngOnInit(): void {
    this.placeholderService.getPlaceholder().then(data =>
      this.placeholder = data);
  }

}
