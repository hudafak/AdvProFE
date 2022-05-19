import { Component, NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ChartsComponent } from "./charts/charts.component";
import { LoginComponent } from "./login/login.component";
import { MapComponent } from "./map/map.component";



const routes: Routes = [
  {
    path: "map",
    component: MapComponent
  },
  {
    path: "charts",
    component: ChartsComponent
  },
  {
path: "login",
component: LoginComponent
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
