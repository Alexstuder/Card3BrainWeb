import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {UserService} from "../services/user.service";
import {UserRestControllerService, UsersDto} from "../openapi-gen"
import {UserDto} from "../openapi-gen"

@Component({
  selector: 'app-users,ngbd-collapse-horizontal',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy{

  @ViewChild('firstNameTextField', {static: true}) firstNameTextField: ElementRef | undefined;
  @ViewChild('userNameTextField', {static: true}) userNameTextField: ElementRef | undefined;
  @ViewChild('mailAdressTextField', {static: true}) mailAdressTextField: ElementRef | undefined;

  userList: UsersDto = {};
  private subscription: Subscription | undefined;

  constructor(private readonly userRestControllerService:UserRestControllerService,
              private readonly userService:UserService) {}

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
      next: (data) => this.userList = data,
      error:(err) =>  console.log(err)
    });
  }

  onDelete(user: UserDto) {
    if (user !== undefined) {
      this.userRestControllerService.deleteUser(user).subscribe(
        data => {
          this.refreshList();
        },
        err => console.log(err)
      );
    }
  }

  onCreateUser() {
    if (this.firstNameTextField !== undefined &&
      this.userNameTextField !== undefined&&
      this.mailAdressTextField !== undefined) {
      let firstNameTemp: string = this.firstNameTextField.nativeElement.value;
      let userNameTemp: string = this.userNameTextField.nativeElement.value;
      let mailAdressTemp: string = this.mailAdressTextField.nativeElement.value;
      let user: UserDto = {
        userName: userNameTemp,
        firstName: firstNameTemp,
        mailAddress: mailAdressTemp
      }
      this.userRestControllerService.createUser(user).subscribe(
        data =>{
          this.refreshList();
        },
          err => console.log(err));
      this.firstNameTextField.nativeElement.value = "";
      this.userNameTextField.nativeElement.value = "";
      this.mailAdressTextField.nativeElement.value = "";
      }
  }

  refreshList() {
    this.useOpenApiService();
  }
}

