import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  CategoryRestControllerService,
  CategoryDto, InfoDto, LearnRestControllerService, UserRestControllerService
} from "../openapi-gen";
import {ActivatedRoute, Router} from "@angular/router";
import {UserLoginService} from "../services/user-login.service";
import {ToastService} from "../services/toast.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit, OnDestroy{

  categories: Array<InfoDto> | undefined;
  private userId: number | undefined;

  hidden:boolean = true

  private categorySub : Subscription | undefined
  private userSub : Subscription | undefined

  constructor(private readonly learnRestControllerService : LearnRestControllerService,
              private readonly categoryRestControllerService:CategoryRestControllerService,
              private readonly userRestControllerService: UserRestControllerService,
              private userLoginService: UserLoginService,
              private readonly toastService: ToastService,
              private route: ActivatedRoute,
              private readonly router: Router) { }

  ngOnDestroy(): void {
    this.categorySub?.unsubscribe()
    this.userSub?.unsubscribe()
  }

  ngOnInit(): void {
    this.userId = this.userLoginService.getUserId()
    if (this.userId) {
      this.updateCategories();
    }else{
      this.router.navigate(["/login"])
    }
  }

  updateCategories():void{
    if (this.userId != undefined || this.userId != null)  {
      this.userSub = this.userRestControllerService.getInfosOfUser(this.userId).subscribe({
        next: (data) => {
          this.categories = data
        },
        error: (err) => {
          if (!this.toastService.showHttpErrorToast(err))
            this.toastService.showErrorToast('error', 'update category gone wrong',);
          console.log(err);
        }
      });
    }
  }

  onCreateCategory() {
    let category: CategoryDto = {
      categoryName: "NewCategory",
      owner: this.userId
    }
    this.categorySub = this.categoryRestControllerService.createCategory(category).subscribe({
      next: (data) => {
        this.router.navigate(["/managecards/", data.id])
      },
      error: (err) => {
        if (!this.toastService.showHttpErrorToast(err))
          this.toastService.showErrorToast('error', 'create category gone wrong',);
        console.log(err);
      }
    })
  }

  onDeleteCategory(category: InfoDto) {
    this.categorySub = this.categoryRestControllerService.deleteCategory(category.categoryId??0).subscribe({
      next: (data) => {
        this.updateCategories()
      },
      error: (err) => {
        if (!this.toastService.showHttpErrorToast(err))
          this.toastService.showErrorToast('error', 'delete category gone wrong',);
        console.log(err);
      }
    })
  }
}
