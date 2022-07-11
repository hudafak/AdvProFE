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
import * as L from 'leaflet';

//values for Map
const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;



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

  //vars for map
  private map;
  public tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    minZoom: 3,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  });


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
  public catHold: string[] = [];
  public openMerge = {}
  public starMerge = {}
  public catMerge = {}

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
    this.initMap();
    this.countCategories();

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
      () => {
        this.countOpenClosed();
        this.countStars();

      });

  }

  updateData() {
    this.isLoading = true;
    this.map.remove()
    this.initMap();
    if (this.cityCtrl.value) {
      this.city = this.cityCtrl.value

    } else {
    }
    if (this.stateCtrl.value) {
      this.state = this.stateCtrl.value
    } else {
    }
    if (this.starCtrl.value) {
      let value = this.starCtrl.value as number
      value = value - 1;
      this.stars = value as unknown as string;
    } else {
    }
    if (this.openCtrl.value) {
      this.open = this.openCtrl.value
    } else {
    }
    if (this.catCtrl.value) {
      this.category = this.catCtrl.value
    } else {
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
  }

  countOpenClosed() {

    this.businessHold = this.dataSource.data as Business[];
    this.makeMarkers(this.map)
    this.openCount = this.businessHold.filter((obj) => obj.open === true).length;
    this.closedCount = this.businessHold.filter((obj) => obj.open === false).length;
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
    this.isLoading = false

  }
  countCategories() {

    let data0: {}
    let data1: {}
    let data2: {}
    let data3: {}
    let data4: {}
    let data5: {}
    let data6: {}
    let data7: {}
    let data8: {}
    let data9: {}
    let res = this.apiService.getTopCategories();
    res.subscribe((obj) => {
      this.catHold = obj as string[];
    },
      (err) => console.log(err),
      () => {
        let count = 0;
        for (let index = 0; index < this.catHold.length; index++) {
          let dataname = "data" + count
          let nomb = this.catHold[index];
          let numb = this.catHold[index + 1]
          if ("data0" === dataname) {
            data0 = {
              value: numb,
              name: nomb,
            }
            this.catOptions.series[0].data.push(data0)
          }
          if ("data1" === dataname) {
            data1 = {
              value: numb,
              name: nomb,
            }
            this.catOptions.series[0].data.push(data1)
          }
          if ("data2" === dataname) {
            data2 = {
              value: numb,
              name: nomb,
            }
            this.catOptions.series[0].data.push(data2)
          }
          if ("data3" === dataname) {
            data3 = {
              value: numb,
              name: nomb,
            }
            this.catOptions.series[0].data.push(data3)
          }
          if ("data4" === dataname) {
            data4 = {
              value: numb,
              name: nomb,

            }
            this.catOptions.series[0].data.push(data4)
          }
          if ("data5" === dataname) {
            data5 = {
              value: numb,
              name: nomb,
            }
            this.catOptions.series[0].data.push(data5)
          }
          if ("data6" === dataname) {
            data6 = {
              value: numb,
              name: nomb,
            }
            this.catOptions.series[0].data.push(data6)
          }
          if ("data7" === dataname) {
            data7 = {
              value: numb,
              name: nomb,
            }
            this.catOptions.series[0].data.push(data7)
          }
          if ("data8" === dataname) {
            data8 = {
              value: numb,
              name: nomb,
            }
            this.catOptions.series[0].data.push(data8)
          }
          if ("data9" === dataname) {
            data9 = {
              value: numb,
              name: nomb,
            }
            this.catOptions.series[0].data.push(data9)
          }

          index++
          count++
        }
        console.log(this.catOptions.series[0])
      });

  }

  resetFilter() {
    this.state = 'empty';
    this.city = 'empty';
    this.reviews = 'empty';
    this.stars = 'empty';
    this.open = 'empty';
    this.category = 'empty'
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

  catOptions: EChartsOption = {
    title: {
      text: 'Categories',
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
        name: 'Categories',
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

  initMap(): void {
    this.map = L.map('map', {
      center: [39.8282, -98.5795],
      zoom: 3
    });

    this.tiles.addTo(this.map);

  }
  makeMarkers(map: L.Map): void {
    if (this.businessHold.length < 10000) {
      for (const c of this.businessHold) {
        const lon = c.longitude as unknown as number
        const lat = c.latitude as unknown as number;
        const marker = L.marker([lat, lon]);
        marker.addTo(map);
      }
    }

  }

}