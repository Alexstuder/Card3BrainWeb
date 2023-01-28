import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Signup} from '../models/signup'
import {AuthenticationControllerService, UserDto} from "../openapi-gen";
import {ToastService} from "../services/toast.service";
import {Subscription} from "rxjs";
import {UserLoginService} from "../services/user-login.service";
import {Router} from "@angular/router";
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  constructor(private readonly authenticationRestControllerService: AuthenticationControllerService,
              private readonly toastService: ToastService,
              private userLoginService: UserLoginService,
              private readonly router: Router) { }
  ngOnInit(): void {
  }
  model: Signup = new Signup();
  @ViewChild('f') form: any;

  private authSub : Subscription | undefined

  onSubmit() {
    if (this.form.valid) {
      let user: UserDto = {
        userName: this.model.lastName,
        firstName: this.model.firstName,
        mailAddress: this.model.email,
        password: this.model.password
      }
      this.authSub = this.authenticationRestControllerService.register(user).subscribe({
        next: (data) => {
          this.userLoginService.setToken(data.token??"")
          this.form.reset();
          this.router.navigate(["/login"])
        },
        error: (err) => {
          if (!this.toastService.showHttpErrorToast(err))
            this.toastService.showErrorToast('error', 'create user gone wrong',);
          console.log(err);
        }
      })
    }
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe()
  }
}
