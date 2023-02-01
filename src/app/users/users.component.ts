import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {UserRestControllerService, UserDto} from "../openapi-gen"
import {ToastService} from "../services/toast.service";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-users,ngbd-collapse-horizontal',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy{

  @ViewChild('firstNameTextField', {static: true}) firstNameTextField: ElementRef | undefined;
  @ViewChild('userNameTextField', {static: true}) userNameTextField: ElementRef | undefined;
  @ViewChild('mailAdressTextField', {static: true}) mailAdressTextField: ElementRef | undefined;

  userList: Array<UserDto> | undefined;
  private subscription: Subscription | undefined;
  selectedUser: UserDto ={};

  display='none';

  constructor(private readonly userRestControllerService: UserRestControllerService,
              private readonly toastService: ToastService) {}

  ngOnInit(): void {
    this.useOpenApiService();
  }

  ngOnDestroy(): void {
    if (this.subscription != undefined)  {
      this.subscription.unsubscribe();
    }
  }

  useOpenApiService(): void {
    this.subscription = this.userRestControllerService.getAllUsers().subscribe({
      next: (data) => {
        this.userList = data;
      },
      error: (err) =>{
      if( !this.toastService.showHttpErrorToast(err))
        this.toastService.showErrorToast('error','get all user gone wrong',);
      console.log(err);
      }
    })
  }

  onDelete(user: UserDto) {
    if (user !== undefined) {
      this.userRestControllerService.deleteUser(user.id!).subscribe(
        data => {
          this.refreshList();
        },err =>{
          if( !this.toastService.showHttpErrorToast(err))
            this.toastService.showErrorToast('error','delete user gone wrong',);
          console.log(err);
        })
    }
  }


  refreshList() {
    this.useOpenApiService();
  }
/*
  onUpdateUser() {
    if (this.firstNameTextField !== undefined &&
      this.userNameTextField !== undefined&&
      this.mailAdressTextField !== undefined) {
      let firstNameTemp: string = this.firstNameTextField.nativeElement.value;
      let userNameTemp: string = this.userNameTextField.nativeElement.value;
      let mailAdressTemp: string = this.mailAdressTextField.nativeElement.value;
      let user: UserDto = {
        id : this.selectedUser.id,
        userName: userNameTemp,
        firstName: firstNameTemp,
        mailAddress: mailAdressTemp
      }
      this.userRestControllerService.updateUser(user).subscribe(
        data =>{
          this.refreshList();
        },err =>{
          if( !this.toastService.showHttpErrorToast(err))
            this.toastService.showErrorToast('error','update user gone wrong',);
          console.log(err);
        })
      this.firstNameTextField.nativeElement.value = "";
      this.userNameTextField.nativeElement.value = "";
      this.mailAdressTextField.nativeElement.value = "";
    }
  }
*/
  onClickUser(user: UserDto) {
    this.selectedUser = user;
    if (this.firstNameTextField !== undefined &&
      this.userNameTextField !== undefined&&
      this.mailAdressTextField !== undefined) {
      this.firstNameTextField.nativeElement.value = this.selectedUser.firstName;
      this.userNameTextField.nativeElement.value = this.selectedUser.userName;
      this.mailAdressTextField.nativeElement.value = this.selectedUser.mailAddress;
    }
  }

  onEdit(user: UserDto) {
    this.selectedUser = user
    this.display='block';
    if (this.firstNameTextField !== undefined) {
      this.firstNameTextField.nativeElement.value = user.firstName
    }
    if (this.userNameTextField !== undefined) {
      this.userNameTextField.nativeElement.value = user.userName
    }
    if (this.mailAdressTextField !== undefined) {
      this.mailAdressTextField.nativeElement.value = user.mailAddress
    }
  }

  onSave() {
    if (this.firstNameTextField !== undefined &&
      this.userNameTextField !== undefined&&
      this.mailAdressTextField !== undefined) {
      let firstNameTemp: string = this.firstNameTextField.nativeElement.value;
      let userNameTemp: string = this.userNameTextField.nativeElement.value;
      let mailAdressTemp: string = this.mailAdressTextField.nativeElement.value;
      let user: UserDto = {
        id : this.selectedUser.id,
        userName: userNameTemp,
        firstName: firstNameTemp,
        mailAddress: mailAdressTemp
      }
      this.userRestControllerService.updateUser(user).subscribe(
        data =>{
          this.refreshList();
        },err =>{
          if( !this.toastService.showHttpErrorToast(err))
            this.toastService.showErrorToast('error','update user gone wrong',);
          console.log(err);
        })
      this.firstNameTextField.nativeElement.value = "";
      this.userNameTextField.nativeElement.value = "";
      this.mailAdressTextField.nativeElement.value = "";
    }
  }

  onCloseHandled() {
    this.display='none';
  }
}

