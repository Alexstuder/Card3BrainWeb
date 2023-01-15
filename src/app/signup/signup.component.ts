import {Component, OnInit, ViewChild} from '@angular/core';
import {Signup} from '../models/signup'
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  constructor() { }
  ngOnInit(): void {
  }
  model: Signup = new Signup();
  @ViewChild('f') form: any;

  onSubmit() {
    if (this.form.valid) {
      console.log("Form Submitted!");
      this.form.reset();
    }
  }
}
