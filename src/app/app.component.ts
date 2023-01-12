import { Component } from '@angular/core';
import { ToastService } from './services/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'card2brainweb';

  constructor(private toastService: ToastService) {}

  showToast() {
    this.toastService.showErrorToast('Error toast title', 'This is an error toast message.');
  }
}
