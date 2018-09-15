import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';

/**
 * 主路由
 * */
const routes: Routes = [
  // 空路由的重定向 注意：写成 /login 或者 /login/ 或者 login/ 都不对
  {
    path: '',
    redirectTo: 'leafletRoute',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: PageNotFoundComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class CoreRoutingModule {

}
