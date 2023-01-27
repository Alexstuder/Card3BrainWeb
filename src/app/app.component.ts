import { Component } from '@angular/core';
import { ToastService } from './services/toast.service';
import {UserLoginService} from "./services/user-login.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'card2brainweb';

  constructor(private readonly toastService: ToastService,
              readonly userLoginService: UserLoginService) {
  }

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
}
