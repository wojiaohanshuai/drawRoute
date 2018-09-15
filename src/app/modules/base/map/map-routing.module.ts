import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';
import {MapComponent} from './map.component';

/**
 * modules总路由
 * */
const routes = [
  {path: 'map', component: MapComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class MapRoutingModule { }
