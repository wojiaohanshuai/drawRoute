import { Injectable } from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private messageLoadingId: string;

  constructor(
    private messageService: NzMessageService
  ) { }

  public error(str: string): void {
    this.messageService.error(str);
  }

  public success(str: string): void {
    this.messageService.success(str);
  }

  public warning(str: string): void {
    this.messageService.warning(str, {
      nzDuration: 3000
    });
  }

  public info(str: string): void {
    this.messageService.info(str, {
      nzDuration: 3000
    });
  }

  public loading(str: string): void {
    this.messageLoadingId = this.messageService.loading(str).messageId;
  }

  public loadingRemove(): void {
    this.messageService.remove(this.messageLoadingId);
  }
}
