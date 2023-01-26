import { Component } from '@angular/core';
import { ToastService } from './services/toast.service';
const hammerjs = require('node_modules/hammerjs');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'card2brainweb';

  hammerjs = hammerjs;

  constructor(private readonly toastService: ToastService) {
  }

  showToast() {
    this.toastService.showErrorToast('Error toast title', 'This is an error toast message.');
  }

  myEvent!: string;
  onMyEvent($event: string) {
    this.myEvent = $event;
  }
}
