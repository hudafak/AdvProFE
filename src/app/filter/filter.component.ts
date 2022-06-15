import { Component, OnInit,NgModule, VERSION } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from '../app.filter';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  selected_cities: { name: string; id: number; selected: boolean; }[];
  name:string;
  searchText:string = "";
  selected_count:number = 0;


  // Data Object to List Games
  games = [
    {
      name:'Chess',
      id:1,
      selected:true
    },
    {
      name:'Ludo',
      id:2,
      selected:false
    },
    {
      name:'Snakes & Ladders',
      id:3,
      selected:false
    },
    {
      name:'Carrom',
      id:4,
      selected:false},
    {
      name:'Scrabble',
      id:5,
      selected:false
    },
    {
      name:'Monopoly',
      id:6,
      selected:true},
    {
      name:'Uno',
      id:7,
      selected:false
    }
  ]

  // Getting Selected Games and Count
  getSelected(){
     this.selected_cities =  this.games.filter( s => {
          return s.selected;
        });
     this.selected_count = this.selected_cities.length;
     //alert(this.selected_cities);
  }

  // Clearing All Selections
  clearSelection(){
    this.searchText = "";
    this.games =  this.games.filter( g => {
          g.selected = false;
          return true;
        });
    this.getSelected();
  }

  //Delete Single Listed Game
  deleteGame(id:number){
    this.searchText = "";
    this.games =  this.games.filter( g => {
          if(g.id == id)
          g.selected = false;

          return true;
        });
    this.getSelected();
  }

  clearFilter(){
    this.searchText = "";
  }

  constructor() {
    this.name = `Angular! v${VERSION.full}`;
    this.getSelected();
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}
