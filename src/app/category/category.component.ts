import {Component, ElementRef, ModuleWithProviders, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {
  UserDto,
  CategoryRestControllerService,
  CategoryDto, ApiModule
} from "../openapi-gen";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {UserLoginService} from "../services/user-login.service";
import {ToastService} from "../services/toast.service";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit, OnDestroy{

  categories: Array<CategoryDto> | undefined;

  private categorySubscription: Subscription | undefined;
  private userId: number = 0

  hidden:boolean = true

  constructor(private readonly categoryRestControllerService:CategoryRestControllerService,
              private userLoginService: UserLoginService,
              private readonly toastService: ToastService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.userId = params['userid'];
    });
    this.updateCategories();

  }
  ngOnDestroy(): void {
    if (this.categorySubscription != undefined) {
      this.categorySubscription.unsubscribe();
    }
  }

  updateCategories():void{
    if (this.userId != undefined || this.userId != null)  {
      this.categorySubscription = this.categoryRestControllerService.getAllCategoriesOfUser(this.userId).subscribe(
        data => {
          this.categories = data
        },err =>{
          if( !this.toastService.showHttpErrorToast(err))
            this.toastService.showErrorToast('error','update category gone wrong',);
          console.log(err);
        })
    }
  }

  onClickCategory(category: CategoryDto) {
    this.userLoginService.setCategory(category)
    window.location.href="play?categoryid="+category.id
  }

  onCreateCategory() {
    let category: CategoryDto = {
      categoryName: "NewCategory",
      owner: this.userId
    }
    this.categoryRestControllerService.createCategory(category).subscribe(
    data =>{
      this.userLoginService.setCategory(data)
      window.location.href="managecards?categoryid="+data.id+"&userid="+this.userId
    },err =>{
      if( !this.toastService.showHttpErrorToast(err))
        this.toastService.showErrorToast('error','create category gone wrong',);
      console.log(err);
    })
  }

  onEdit(category: CategoryDto) {
    window.location.href="managecards?categoryid="+category.id+"&userid="+this.userId
  }
}
