import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  CategoryRestControllerService,
  CategoryDto, InfoDto, LearnRestControllerService, UserRestControllerService
} from "../openapi-gen";
import {ActivatedRoute, Router} from "@angular/router";
import {UserLoginService} from "../services/user-login.service";
import {ToastService} from "../services/toast.service";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit{

  categories: Array<InfoDto> | undefined;
  private userId: number | undefined;

  hidden:boolean = true

  constructor(private readonly learnRestControllerService : LearnRestControllerService,
              private readonly categoryRestControllerService:CategoryRestControllerService,
              private readonly userRestControllerService: UserRestControllerService,
              private userLoginService: UserLoginService,
              private readonly toastService: ToastService,
              private route: ActivatedRoute,
              private readonly router: Router) { }

  ngOnInit(): void {
    this.userId = this.userLoginService.getUserId()
    if (this.userId) {
      this.updateCategories();
    }else{
      this.toastService.showErrorToast('error', 'Please log in');
    }
  }

  updateCategories():void{
    if (this.userId != undefined || this.userId != null)  {
      this.userRestControllerService.getInfosOfUser(this.userId).subscribe(
        data => {
          this.categories = data
        },err =>{
          if( !this.toastService.showHttpErrorToast(err))
            this.toastService.showErrorToast('error','update category gone wrong',);
          console.log(err);
        })
    }
  }

  onCreateCategory() {
    let category: CategoryDto = {
      categoryName: "NewCategory",
      owner: this.userId
    }
    this.categoryRestControllerService.createCategory(category).subscribe(
    data =>{
      this.router.navigate(["/managecards/",data.id])
    },err =>{
      if( !this.toastService.showHttpErrorToast(err))
        this.toastService.showErrorToast('error','create category gone wrong',);
      console.log(err);
    })
  }

  onDeleteCategory(category: InfoDto) {
    this.categoryRestControllerService.deleteCategory(category.categoryId??0).subscribe(
      data =>{
        this.updateCategories()
      },err =>{
        if( !this.toastService.showHttpErrorToast(err))
          this.toastService.showErrorToast('error','delete category gone wrong',);
        console.log(err);
      })
  }
}
