import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Business } from './model/business';
import { ApiStatService } from './api/apistat.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['name', 'city', 'stars', 'open', 'reviews'];


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  ELEMENT_DATA: Business[] = [];
  dataSource = new MatTableDataSource<Business>(this.ELEMENT_DATA);


  constructor(private apiService: ApiStatService) {

  }
  ngOnInit(): void {
    this.getAllBusiness();

  }

  ngAfterViewInit() {

    this.dataSource.paginator = this.paginator;
  }
  public getAllBusiness() {
    let res = this.apiService.getAllBusinesses();
    res.subscribe(business => this.dataSource.data = business as Business[]);
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


}







