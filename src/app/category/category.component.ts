import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {
  Category,
  UserRestControllerService,
  User,
  UsersDto,
  UserDto,
  CategoryRestControllerService,
  CategoriesDto
} from "../openapi-gen";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit, OnDestroy{
  @ViewChild('categoryNameTextField', {static: true}) categoryNameTextField: ElementRef | undefined;

  userList: UsersDto = {};
  selectedUser: UserDto ={};
  categories: CategoriesDto = {};

  private userSubscription: Subscription | undefined;
  private categorySubscription: Subscription | undefined;

  constructor(private readonly userRestControllerService:UserRestControllerService,
              private readonly categoryRestControllerService:CategoryRestControllerService) {}

  ngOnInit(): void {
    this.updateUsers();
  }
  ngOnDestroy(): void {
    if (this.userSubscription != undefined)  {
      this.userSubscription.unsubscribe();
    }
  }
  updateUsers(): void {
    this.userSubscription = this.userRestControllerService.getAllUsers().subscribe({
      next: (data) => this.userList = data,
      error:(err) =>  console.log(err)
    });
  }

  onClickUser(user: UserDto) {
    this.selectedUser = user;
    this.updateCategories();
  }
  updateCategories():void{
    if (this.selectedUser != undefined)  {
      this.categorySubscription = this.categoryRestControllerService.getAllCategoriesOfUser(this.selectedUser).subscribe({
        next: (data) => this.userList = data,
        error:(err) =>  console.log(err)
      });
    }
  }

  onClickCategory(Category: any) {
    console.log("selected: "+ Category.categoryName)
  }

  onCreateCategory() {
    if (this.categoryNameTextField !== undefined){
      let categoryNameTemp: string = this.categoryNameTextField.nativeElement.value;
      if(this.selectedUser !==undefined){
        let user: User ={
          id: this.selectedUser.id,
          userName: this.selectedUser.userName,
          firstName: this.selectedUser.firstName,
          mailAddress: this.selectedUser.mailAddress
        }
        let category: Category = {
          categoryName: categoryNameTemp,
          owner: user
        }
        this.categoryRestControllerService.createCategory(category).subscribe(
          data =>{
            this.updateCategories();
          },
          err => console.log(err));
        this.categoryNameTextField.nativeElement.value="";
      }
    }
  }
}
