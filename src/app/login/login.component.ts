import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoginDto, UserDto, UserRestControllerService} from "../openapi-gen";
import {ToastService} from "../services/toast.service";
import {UserLoginService} from "../services/user-login.service";
import {Router} from "@angular/router";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm:any = FormGroup;
  submitted = false;
  private user : UserDto | undefined

  constructor( private formBuilder: FormBuilder,
               private readonly userRestControllerService: UserRestControllerService,
               private readonly toastService: ToastService,
               private userLoginService: UserLoginService,
               private readonly router: Router){}
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    let loginUser: LoginDto = {
      mailAddress: this.loginForm.controls.email.value,
      password: this.loginForm.controls.password.value
    }
    this.userRestControllerService.login(loginUser).subscribe(  //ToDo how to have the service static
      data =>{
        this.userLoginService.setUser(data)
        this.user = data
        this.afterLoggedIn()
      },err =>{
        if( !this.toastService.showHttpErrorToast(err))
          this.toastService.showErrorToast('error','login gone wrong',);
        console.log(err);
      })

  }
  ngOnInit() {
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
    //window.location.href="category?userid="+this.user?.id; //Todo return right userid
  }
}
