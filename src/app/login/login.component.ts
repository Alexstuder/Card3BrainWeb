import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserDto, UserRestControllerService} from "../openapi-gen";
import {ToastService} from "../services/toast.service";
import {UserLoginService} from "../services/user-login.service";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm:any = FormGroup;

  submitted = false;
  constructor( private formBuilder: FormBuilder,
               private readonly userRestControllerService: UserRestControllerService,
               private readonly toastService: ToastService,
               private userLoginService: UserLoginService){}
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    // ToDo Send Login and get real user
    this.loginForm.email
    this.loginForm.password
    // ToDo get real user
    let user: UserDto = {
      id:69,
      userName: "User2",
      firstName: "FirstName1",
      mailAddress: "Mail@Adress.1"
    }

    this.userLoginService.setUser(user)
    this.afterLoggedIn()
  }
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });


  }

  forgotPassword() {
    this.toastService.showWarningToast("reset Password", "This can not be done automatic. Please send us a Mail")
  }

  private afterLoggedIn(){
    window.location.href="category?userid=69"; //Todo return right userid
  }
}
