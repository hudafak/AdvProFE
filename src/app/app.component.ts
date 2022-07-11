import { AfterViewInit, Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Business } from './model/business';
import { ApiStatService } from './api/apistat.service';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ECharts, EChartsOption } from 'echarts';
import { MatSort, Sort } from '@angular/material/sort';
import { RatingModule } from 'ngx-bootstrap/rating';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnInit, OnDestroy {
  // Directives
  // Paginator Directive for Mat-table
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // Sort Directive for Mat-table
  @ViewChild('empTbSort') empTbSort = new MatSort();
  //Directive for searchable Select field
  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  // vars for filter-api
  public state: string = 'empty';
  public city: string = 'empty';
  public reviews: string = 'empty';
  public stars: string = 'empty';
  public open: string = 'empty';
  public category: string = 'empty'
  // vars for open/closed pie-chart
  public openCount: number = 0;
  public closedCount: number = 0;
  public businessHold: Business[] = [];
  public openMerge = {}
  public starMerge = {}

  // var for showing loading animation
  public isLoading: boolean = false;
  // vars for searchable Select fields
  public cities: string[] = [];
  public states: string[] = [];
  public categories: string[] = []
  public openCtrl: FormControl = new FormControl();
  public starCtrl: FormControl = new FormControl();
  public cityCtrl: FormControl = new FormControl();
  public cityFilterCtrl: FormControl = new FormControl();
  public filteredCities: ReplaySubject<any> = new ReplaySubject(1);
  public stateCtrl: FormControl = new FormControl();
  public stateFilterCtrl: FormControl = new FormControl();
  public filteredStates: ReplaySubject<any> = new ReplaySubject(1);
  public catCtrl: FormControl = new FormControl();
  public catFilterCtrl: FormControl = new FormControl();
  public filteredCats: ReplaySubject<any> = new ReplaySubject(1);
  protected _onDestroy = new Subject();
  // Columns for Mat-table
  public displayedColumns: string[] = ['name', 'city', 'stars', 'open', 'reviewCount'];
  public ELEMENT_DATA: Business[] = [];
  public dataSource = new MatTableDataSource<Business>(this.ELEMENT_DATA);

  constructor(private apiService: ApiStatService) {

  }

  ngOnInit(): void {
    this.getAllBusiness();
    this.getCities();
    this.getStates();
    this.getCategories();
    this.cityCtrl.setValue(this.cities[1]);
    this.stateCtrl.setValue(this.states[1]);
    this.filteredCities.next(this.cities.slice());
    this.filteredStates.next(this.states.slice())
    this.cityFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCities();
      });
    this.stateFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterStates();
      });
    this.catFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCats();
      });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.empTbSort;
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next(1);
    this._onDestroy.complete();
  }

  protected setInitialValue() {
    this.filteredCities
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: string, b: string) => a && b && a === b;
      });
    this.filteredStates
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: string, b: string) => a && b && a === b;
      })
    this.filteredCats
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: string, b: string) => a && b && a === b;
      })

  }

  protected filterCities() {
    if (!this.cities) {
      return;
    }
    let search = this.cityFilterCtrl.value;
    if (!search) {
      this.filteredCities.next(this.cities.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredCities.next(
      this.cities.filter(city => city.toLowerCase().indexOf(search) > -1)
    );
  }
  protected filterCats() {
    if (!this.categories) {
      return;
    }
    let search = this.catFilterCtrl.value;
    if (!search) {
      this.filteredCats.next(this.categories.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredCats.next(
      this.categories.filter(cat => cat.toLowerCase().indexOf(search) > -1)
    );
  }
  protected filterStates() {

    if (!this.states) {

      return;

    }

    let search = this.stateFilterCtrl.value;

    if (!search) {

      this.filteredStates.next(this.states.slice());

      return;

    } else {

      search = search.toLowerCase();

    }

    this.filteredStates.next(

      this.states.filter(state => state.toLowerCase().indexOf(search) > -1)

    );

  }
  public getAllBusiness() {
    this.isLoading = true
    let res = this.apiService.filterBusiness(this.state, this.city, this.stars, this.open, this.reviews, this.category);
    res.subscribe((business) => {
      this.dataSource.data = business as Business[];
    },
      (err) => console.log(err),
      () => { this.countOpenClosed(); this.countStars() });

  }

  updateData() {
    this.isLoading = true;

    if (this.cityCtrl.value) {
      this.city = this.cityCtrl.value
      console.log("city: " + this.city)
    } else {
      console.log("city: " + this.city)
    }
    if (this.stateCtrl.value) {
      this.state = this.stateCtrl.value
      console.log("state: " + this.state)
    } else {
      console.log("state: " + this.state)
    }
    if (this.starCtrl.value) {
      this.stars = this.starCtrl.value
      console.log("stars: " + this.stars)
    } else {
      console.log("stars: " + this.stars)
    }
    if (this.openCtrl.value) {
      this.open = this.openCtrl.value
      console.log("open: " + this.open)
    } else {
      console.log("open: " + this.open)
    }
    if (this.catCtrl.value) {
      this.category = this.catCtrl.value
      console.log("category: " + this.category)
    } else {
      console.log("category: " + this.category)
    }

    this.getAllBusiness()


  }

  getCities() {
    let res = this.apiService.getAllCities();
    res.subscribe(city => this.cities = city as string[]);
  }

  getStates() {
    let res = this.apiService.getAllStates();
    res.subscribe(state => this.states = state as string[]);
  }

  getCategories() {
    let res = this.apiService.getAllCategories();
    res.subscribe(cat => this.categories = cat as string[])
  }

  countStars() {
    let star0 = this.dataSource.data.filter((obj) => obj.stars === 0).length;
    let star1 = this.dataSource.data.filter((obj) => obj.stars === 1).length;
    let star2 = this.dataSource.data.filter((obj) => obj.stars === 2).length;
    let star3 = this.dataSource.data.filter((obj) => obj.stars === 3).length;
    let star4 = this.dataSource.data.filter((obj) => obj.stars === 4).length;
    let star5 = this.dataSource.data.filter((obj) => obj.stars === 5).length;

    let data0 = {
      value: star0,
      name: 0
    }
    let data1 = {
      value: star1,
      name: 1
    }
    let data2 = {
      value: star2,
      name: 2
    }
    let data3 = {
      value: star3,
      name: 3
    }
    let data4 = {
      value: star4,
      name: 4
    }
    let data5 = {
      value: star5,
      name: 5
    }
    this.starMerge = {
      series: [
        {
          data: [data0, data1, data2, data3, data4, data5],
          type: 'bar'
        },
      ],
      emphasis: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }

    }


    // this.starOption.series[0].data.push(data0)
    // this.starOption.series[0].data.push(data1)
    // this.starOption.series[0].data.push(data2)
    // this.starOption.series[0].data.push(data3)
    // this.starOption.series[0].data.push(data4)
    // this.starOption.series[0].data.push(data5)
    // console.log(this.starOption.series[0].data)
  }
  countOpenClosed() {
    console.log("Aufruf count: " + this.dataSource.data.length)
    this.businessHold = this.dataSource.data as Business[];
    console.log(this.businessHold.length)
    console.log(this.businessHold)
    this.openCount = this.businessHold.filter((obj) => obj.open === true).length;
    console.log(this.openCount)
    this.closedCount = this.businessHold.filter((obj) => obj.open === false).length;
    console.log(this.closedCount)
    let data1 = {
      value: this.closedCount,
      name: 'Closed'
    };
    let data2 = {
      value: this.openCount,
      name: 'Open'
    };
    this.openMerge = {
      series: [
        {
          name: 'Status',
          type: 'pie',
          radius: '70%',
          data: [data1, data2],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]


    }
    // this.openClosedOptions.series[0].data.push(data1)
    // this.openClosedOptions.series[0].data.push(data2)
    this.isLoading = false

  }
  resetFilter() {
    this.catCtrl.reset();
    this.cityCtrl.reset();
    this.stateCtrl.reset();
    this.openCtrl.reset();
    this.starCtrl.reset();
  }


  openClosedOptions: EChartsOption = {
    title: {
      text: 'Status of Businesses',
      subtext: 'Open/ Closed',
      left: 'left'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'horizontal',
      bottom: 'bottom'
    },
    series: [
      {
        name: 'Status',
        type: 'pie',
        radius: '70%',
        data: [],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  starOption: EChartsOption = {
    title: {
      text: 'Distribution of Ratings',
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'horizontal',
      bottom: 'bottom'
    },
    xAxis: {
      type: 'category',
      name: 'rating'
    },
    yAxis: {
      name: 'quantity'
    },
    series: [
      {
        data: [],
        type: 'bar'
      },
    ],
    emphasis: {
      shadowBlur: 10,
      shadowOffsetX: 0,
      shadowColor: 'rgba(0, 0, 0, 0.5)'
    }
  };
}







