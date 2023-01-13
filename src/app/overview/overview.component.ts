import { Component } from '@angular/core';
import {UserDto, UserRestControllerService, UsersDto} from "../openapi-gen";
import {Subscription} from "rxjs";
import {UserService} from "../services/user.service";
import {ToastService} from "../services/toast.service";
import { Inject }  from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent {

  userList: UsersDto = {};
  selectedUser: UserDto ={};
  selected: number | undefined;
  private userSubscription: Subscription | undefined;

  constructor(private readonly userRestControllerService: UserRestControllerService,
              private readonly userService: UserService,
              private readonly toastService: ToastService) {
  }

  ngOnInit(): void {
    this.useOpenApiService();
  }

  ngOnDestroy(): void {
    if (this.userSubscription != undefined)  {
      this.userSubscription.unsubscribe();
    }
  }

  useOpenApiService(): void {
    this.userSubscription = this.userRestControllerService.getAllUsers().subscribe(
      data => {
        this.userList = data;
      },err =>{
        if( !this.toastService.showHttpErrorToast(err))
          this.toastService.showErrorToast('error','get all user gone wrong',);
        console.log(err);
      })
  }

  onClickUser(user: UserDto, index:number) {
    this.selectedUser = user;
    //this.updateCategories();
  }

}
