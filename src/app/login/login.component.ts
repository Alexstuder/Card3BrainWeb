import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {
  AuthenticationControllerService,
  LoginDto,
  UserDto,
  UserRestControllerService
} from "../openapi-gen";
import {ToastService} from "../services/toast.service";
import {UserLoginService} from "../services/user-login.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit,OnDestroy{

  loginForm:any = FormGroup;
  submitted = false;

  private userSub : Subscription | undefined

  constructor( private formBuilder: FormBuilder,
               private readonly userRestControllerService: UserRestControllerService,
               private readonly authenticationRestControllerService: AuthenticationControllerService,
               private readonly toastService: ToastService,
               private userLoginService: UserLoginService,
               private readonly router: Router){}
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      this.toastService.showErrorToast('error','form is invalid');
      return;
    }
    let authReq: LoginDto = {
      mailAddress: this.loginForm.controls.email.value,
      password:this.loginForm.controls.password.value
    }

    this.userSub = this.authenticationRestControllerService.authenticate(authReq).subscribe({
      next: (data) => {
        this.userLoginService.setToken(data.token ?? "")
        this.afterLoggedIn()
      },
      error: (err) => {
        if (!this.toastService.showHttpErrorToast(err))
          this.toastService.showErrorToast('error', 'login gone wrong');
        console.log(err);
      }
    })
  }
  ngOnInit() {
    if(this.userLoginService.isTokenSet()){
      this.afterLoggedIn()
    }
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  forgotPassword() {
    this.toastService.showWarningToast("reset Password", "This can not be done automatic. Please send us a Mail")
  }

  private afterLoggedIn(){
    this.router.navigate(["/category"])
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe()
  }
}
