import {Component, OnInit} from '@angular/core';
import {HealthCheckControllerService} from "../openapi-gen";
import {ToastService} from "../services/toast.service";
import {Subscription} from "rxjs";

interface infoObject {
  appVersion: string;
  app_IS_RUNNING: string;
  buildTime: string;
  swaggerUrl: string;
}


@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})

export class InfoComponent implements OnInit{
  private healthSub: Subscription |undefined;

  backendInfo :infoObject = {
    appVersion: "",
    app_IS_RUNNING: "not",
    buildTime: "0",
    swaggerUrl: ""};

  constructor( private readonly healthCheckRestControllerService : HealthCheckControllerService,
               private readonly toastService: ToastService){}



  ngOnInit(): void {
    this.healthSub = this.healthCheckRestControllerService.healthCheckinfo().subscribe({
      next: (data) => {
        try {
          this.backendInfo = data as unknown as infoObject;
        }catch (e){
          this.toastService.showErrorToast('error parsing JSON', " Info String");
        }
      },
      error: (err) => {
        if (!this.toastService.showHttpErrorToast(err))
          this.toastService.showErrorToast('error', 'login gone wrong');
        console.log(err);
      }
    })
  }
}
