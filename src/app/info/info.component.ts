import {Component, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {AuthenticationControllerService, HealthCheckService, UserRestControllerService} from "../openapi-gen";
import {ToastService} from "../services/toast.service";
import {UserLoginService} from "../services/user-login.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit{
  private healthSub: Subscription |undefined;

  healtResponse: String =""

  constructor( private readonly healthCheckRestControllerService : HealthCheckService,
               private readonly toastService: ToastService){}

  ngOnInit(): void {
    this.healthSub = this.healthCheckRestControllerService.healthCheck().subscribe({
      next: (data) => {
        this.healtResponse = data;
      },
      error: (err) => {
        if (!this.toastService.showHttpErrorToast(err))
          this.toastService.showErrorToast('error', 'login gone wrong');
        console.log(err);
      }
    })
  }



}
