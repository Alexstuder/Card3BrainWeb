import {Component, OnInit, ViewChild} from '@angular/core';
import {Signup} from '../models/signup'
import {UserDto, UserRestControllerService} from "../openapi-gen";
import {ToastService} from "../services/toast.service";
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  constructor(private readonly userRestControllerService: UserRestControllerService,
              private readonly toastService: ToastService) { }
  ngOnInit(): void {
  }
  model: Signup = new Signup();
  @ViewChild('f') form: any;

  onSubmit() {
    if (this.form.valid) {
      let user: UserDto = {
        userName: this.model.lastName,
        firstName: this.model.firstName,
        mailAddress: this.model.email,
        password: this.model.password
      }
      this.userRestControllerService.createUser(user).subscribe(
        data =>{
          this.form.reset();
          window.location.href="login"
        },err =>{
          if( !this.toastService.showHttpErrorToast(err))
            this.toastService.showErrorToast('error','create user gone wrong',);
          console.log(err);
        })
    }
  }
}
