import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';

/**
 * modules总路由
 * */
const routes = [
  {path: '', redirectTo: 'map'}
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
export class ModulesRoutingModule { }
