import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map.component';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {MapRoutingModule} from './map-routing.module';

@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    MapRoutingModule
  ],
  declarations: [MapComponent],
  providers: [

  ]
})
export class MapModule { }
