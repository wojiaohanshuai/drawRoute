import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import {CoreRoutingModule} from './core-routing.module';
import {MainModule} from './main/main.module';

@NgModule({
  imports: [
    CommonModule,
    MainModule,
    CoreRoutingModule
  ],
  declarations: [
    PageNotFoundComponent
  ]
})
export class CoreModule {

}
