import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import {CardDto, CardRestControllerService, CategoryDto, CategoryRestControllerService, LoginDto} from "../openapi-gen";
import { ToastService } from '../services/toast.service';
import {ActivatedRoute} from "@angular/router";
import {UserLoginService} from "../services/user-login.service";

@Component({
  selector: 'app-manage-cards',
  templateUrl: './manage-cards.component.html',
  styleUrls: ['./manage-cards.component.scss']
})
export class ManageCardsComponent implements OnInit, OnDestroy {

  selectedCategory: CategoryDto ={};

  columnsToDisplay = ['question', 'answer', 'actions'];
  cardTypes: CardDto[] = [];
  dataSource = new MatTableDataSource<CardDto>(this.cardTypes);

  loading = false;
  resultsLength = 0;

  private categoryId : number | undefined
  private userId : number | undefined

  private modalCreate : boolean = true
  modalTitle : String ='Title'
  modalButtonText : String = 'Button'
  modalOpen : boolean = false
  display='none';
  selectedCard : CardDto | undefined

  @ViewChild('categoryNameTextField', {static: true}) categoryNameTextField: ElementRef | undefined;
  @ViewChild('questionTextField', {static: true}) questionTextField: ElementRef | undefined;
  @ViewChild('answerTextField', {static: true}) answerTextField: ElementRef | undefined;
  @ViewChild('modalCard',{static:true}) modalCard:ElementRef | undefined;


  constructor(private readonly categoryRestControllerService:CategoryRestControllerService,
              private readonly cardRestControllerService :CardRestControllerService,
              private readonly toastService: ToastService,
              private userLoginService: UserLoginService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    let tempString = this.route.snapshot.paramMap.get('id')
    if (tempString){
      this.categoryId = +tempString
    }
    this.userId = this.userLoginService.getUserId()
    if (!this.userId) {
      this.toastService.showErrorToast('error', 'Not logged in');
    }else if(!this.categoryId){
      this.toastService.showErrorToast('error', 'category not valid');
    }else{
        this.updateCards();
    }
  }

  updateCards():void{
    if (this.userId != undefined) {
      let tempCategories: Array<CategoryDto> = []
      this.categoryRestControllerService.getAllCategoriesOfUser(this.userId).subscribe( //Todo get the Category from the Service
        data => {
          tempCategories = data
          for (var i = 0; i < tempCategories.length; i++) {
            if (tempCategories[i].id == this.categoryId) {
              this.selectedCategory = tempCategories[i]
              if (this.categoryNameTextField !== undefined) {
                this.categoryNameTextField.nativeElement.value = this.selectedCategory.categoryName
              }
            }
          }
        }, err => {
          if (!this.toastService.showHttpErrorToast(err))
            this.toastService.showErrorToast('error', 'get categories gone wrong',);
          console.log(err);
        })

    }

    if (this.categoryId != undefined)  {
      this.loading = true
      this.cardRestControllerService.getCardsByCategory(this.categoryId).subscribe(
        data =>{
          this.dataSource = new MatTableDataSource(data)
          this.resultsLength = data.length
          this.loading = false
        },err => {
          if (!this.toastService.showHttpErrorToast(err))
            this.toastService.showErrorToast('error', 'update cards gone wrong',);
          console.log(err);
          this.loading = false
        });
    }
  }

  ngOnDestroy(): void {}

  onCreateCard() {
    this.modalCreate = true
    this.modalTitle = 'Create card'
    this.modalButtonText = 'create card'
    this.display='block';
    if (this.answerTextField !== undefined) {
      this.answerTextField.nativeElement.value = "Your answer"
    }
    if (this.questionTextField !== undefined) {
      this.questionTextField.nativeElement.value = "Your question"
    }
  }

  onEditCard(card : CardDto) {
    this.modalCreate = false
    this.modalTitle = 'Edit card'
    this.modalButtonText = 'Save changes'
    this.display='block';
    this.selectedCard = card
    if (this.answerTextField !== undefined) {
      this.answerTextField.nativeElement.value = card.answer
    }
    if (this.questionTextField !== undefined) {
      this.questionTextField.nativeElement.value = card.question
    }
  }

  onDeleteCard(card : CardDto) {
    if (card?.id){
      this.cardRestControllerService.deleteCard(card.id).subscribe(
        data=>{
          this.updateCards();
        },err =>{
          if( !this.toastService.showHttpErrorToast(err))
            this.toastService.showErrorToast('error','delete card gone wrong',);
          console.log(err);
        })
    }

  }

  onClickSubmit() {
    if (this.categoryNameTextField !== undefined){
      if (this.userId != undefined || this.userId != null)  {
        let tempCategories :Array<CategoryDto> = []
        this.categoryRestControllerService.getAllCategoriesOfUser(this.userId).subscribe( //Todo get the Category from the Service
          data=>{
            tempCategories = data
          },err =>{
            if( !this.toastService.showHttpErrorToast(err))
              this.toastService.showErrorToast('error','get categories gone wrong',);
            console.log(err);
          })
        for (var i = 0; i < tempCategories.length; i++) {
          if(tempCategories[i].id == this.categoryId){
            this.selectedCategory = tempCategories[i]
          }
        }
        this.selectedCategory.categoryName = this.categoryNameTextField.nativeElement.value
        this.categoryRestControllerService.updateCategory(this.selectedCategory).subscribe(
          data =>{
            this.selectedCategory = data;
            // @ts-ignore
            this.categoryNameTextField.nativeElement.value = this.selectedCategory.categoryName
          },
          err => console.log(err));
        this.categoryNameTextField.nativeElement.value=this.selectedCategory.categoryName;
        this.userLoginService.setCategory(this.selectedCategory)
      }
    }
  }

  onCloseHandled() {
    this.display='none';
  }

  onSave() {
    if (this.modalCreate){
      if (this.answerTextField !== undefined && this.questionTextField !== undefined) {
        let card: CardDto = {
          answer : this.answerTextField.nativeElement.value,
          question : this.questionTextField.nativeElement.value,
          categoryId : this.categoryId
        }
        this.cardRestControllerService.addCard(card).subscribe(
          data=>{
            this.updateCards();
          },err =>{
            if( !this.toastService.showHttpErrorToast(err))
              this.toastService.showErrorToast('error','create card gone wrong',);
            console.log(err);
          })
      }
    } else{
      if(this.selectedCard) {
        if (this.answerTextField !== undefined && this.questionTextField !== undefined) {
          this.selectedCard.answer = this.answerTextField.nativeElement.value
          this.selectedCard.question = this.questionTextField.nativeElement.value
          this.cardRestControllerService.updateCard(this.selectedCard).subscribe(
            data=>{
              this.updateCards();
            },err =>{
              if( !this.toastService.showHttpErrorToast(err))
                this.toastService.showErrorToast('error','update card gone wrong',);
              console.log(err);
            })
        }
      }
    }
    this.display='none';
  }
}
