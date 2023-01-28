import {AfterContentChecked, Component, OnInit} from '@angular/core';
import { ToastService } from './services/toast.service';
import {UserLoginService} from "./services/user-login.service";
//const hammerjs = require('node_modules/hammerjs');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterContentChecked{

  //hammerjs = hammerjs;

  constructor(private readonly toastService: ToastService,
              readonly userLoginService: UserLoginService) {
  }

  loggedIn : boolean = false;
  loggedUser : String = ""

  showToast() {
    this.toastService.showErrorToast('Error toast title', 'This is an error toast message.');
  }

  myEvent!: string;
  onMyEvent($event: string) {
    this.myEvent = $event;
  }

  logout(){
    this.userLoginService.resetToken()
  }

  ngAfterContentChecked(): void {
    this.userLoginService.loggedUser$.subscribe({
        next: ( data)=>(this.loggedUser = data)
      }
    )
    this.userLoginService.loggedId$.subscribe({
        next: ( data)=>(this.loggedIn = data)
      }
    )
  }
}
