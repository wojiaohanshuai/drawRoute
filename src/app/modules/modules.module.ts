import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {ModulesRoutingModule} from './modules-routing.module';

import {BaseModule} from './base/base.module';

@NgModule({
  imports: [
    CommonModule,
    ModulesRoutingModule,
    BaseModule
  ],
  declarations: []
})
export class ModulesModule { }
