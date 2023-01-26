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
export class CategoryComponent implements OnInit, OnDestroy{

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
      this.toastService.showErrorToast('error', 'Not logged in');
    }
  }
  ngOnDestroy(): void {
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

  onClickCategory(category: InfoDto) {
    //this.userLoginService.setCategory(category)
    //this.router.navigate(["/play/"+category.categoryId])
    //window.location.href="play?categoryid="+category.categoryId
  }

  onCreateCategory() {
    let category: CategoryDto = {
      categoryName: "NewCategory",
      owner: this.userId
    }
    this.categoryRestControllerService.createCategory(category).subscribe(
    data =>{
      this.userLoginService.setCategory(data)
      this.router.navigate(["/managecards/",data.id])
      //window.location.href="managecards?categoryid="+data.id+"&userid="+this.userId
    },err =>{
      if( !this.toastService.showHttpErrorToast(err))
        this.toastService.showErrorToast('error','create category gone wrong',);
      console.log(err);
    })
  }

  onEdit(category: InfoDto) {
    this.router.navigate(["/managecards/",category.categoryId])
    //window.location.href="managecards?categoryid="+category.categoryId+"&userid="+this.userId
  }
}
