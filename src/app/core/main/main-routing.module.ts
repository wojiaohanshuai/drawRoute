import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {MainComponent} from './main.component';

/**
 * 主路由
 * */
const routes: Routes = [
  {
    path: 'leafletRoute',
    component: MainComponent,
    loadChildren: '../../modules/modules.module#ModulesModule',
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class MainRoutingModule {

}
