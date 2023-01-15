import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {
  UserDto,
  CategoryRestControllerService,
  CategoryDto
} from "../openapi-gen";
import {Subscription} from "rxjs";
import {ActivatedRoute,ParamMap} from "@angular/router";
import {UserLoginService} from "../services/user-login.service";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit, OnDestroy{
  @ViewChild('categoryNameTextField', {static: true}) categoryNameTextField: ElementRef | undefined;

  categories: Array<CategoryDto> | undefined;

  private routeSubscription: Subscription | undefined;
  private categorySubscription: Subscription | undefined;
  private userId: number = 0

  constructor(private readonly categoryRestControllerService:CategoryRestControllerService,
              private readonly userLoginService: UserLoginService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.userId = params['userid'];
    });
    this.updateCategories();

  }
  ngOnDestroy(): void {
    if (this.routeSubscription != undefined) {
      this.routeSubscription.unsubscribe();
    }
    if (this.categorySubscription != undefined) {
      this.categorySubscription.unsubscribe();
    }
  }

  updateCategories():void{
    if (this.userId != undefined || this.userId != null)  {
      this.categorySubscription = this.categoryRestControllerService.getAllCategoriesOfUser(this.userId).subscribe({
        next: (data) => this.categories = data,
        error:(err) =>  console.log(err)
      });
    }
  }

  onClickCategory(category: CategoryDto) {
    this.userLoginService.setCategory(category)
    window.location.href="play?categoryid=162" //Todo return right category
  }

  onCreateCategory() {
    if (this.categoryNameTextField !== undefined){
      let categoryNameTemp: string = this.categoryNameTextField.nativeElement.value;
      if (this.userId != undefined || this.userId != null)  {
        let category: CategoryDto = {
          id : 0,
          categoryName: categoryNameTemp,
          owner: this.userId
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

  onEdit(i: number) {

  }
}
