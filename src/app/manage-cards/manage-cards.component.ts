import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {
  UserRestControllerService,
  UserDto,
  CategoryRestControllerService,
  CardRestControllerService,
  CategoryDto, CardDto,
} from "../openapi-gen";
import {ToastService} from "../services/toast.service";

@Component({
  selector: 'app-manage-cards',
  templateUrl: './manage-cards.component.html',
  styleUrls: ['./manage-cards.component.scss']
})
export class ManageCardsComponent implements OnInit, OnDestroy{
  @ViewChild('categoryNameTextField', {static: true}) categoryNameTextField: ElementRef | undefined;
  @ViewChild('questionTextField', {static: true}) questionTextField: ElementRef | undefined;
  @ViewChild('answerTextField', {static: true}) answerTextField: ElementRef | undefined;

  userList: Array<UserDto> | undefined;
  selectedUser: UserDto ={};
  categories: Array<CategoryDto> | undefined;
  selectedCategory: CategoryDto ={};
  cards: Array<CardDto> | undefined;
  selectedCard: CardDto | undefined;

  private userSubscription: Subscription | undefined;
  private categorySubscription: Subscription | undefined;
  private cardsSubscription: Subscription | undefined;

  constructor(private readonly userRestControllerService:UserRestControllerService,
              private readonly categoryRestControllerService:CategoryRestControllerService,
              private readonly cardRestControllerService :CardRestControllerService,
              private readonly toastService: ToastService) {}

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
      this.categorySubscription = this.categoryRestControllerService.getAllCategoriesOfUser(this.selectedUser.id!).subscribe({
        next: (data) => this.categories = data,
        error:(err) =>  console.log(err)
      });
    }
  }

  onClickCategory(category: CategoryDto) {
    this.selectedCategory = category;
    this.updateCards();
  }

  updateCards():void{
    if (this.selectedCategory != undefined)  {
      //this.cardsSubscription = this.cardRestControllerService.getCardsByCategory(this.selectedCategory.id!).subscribe({
      this.cardsSubscription = this.cardRestControllerService.getCardsByCategory(162).subscribe({
        next: (data) => this.cards = data,
        error:(err) =>  console.log(err)
      });
    }
  }

  onClickCard(card: CardDto){
    this.selectedCard = card;
    if (this.questionTextField !== undefined &&
      this.answerTextField !== undefined) {
      this.questionTextField.nativeElement.value = this.selectedCard.question
      this.answerTextField.nativeElement.value =this.selectedCard.answer
    }
  }

  onLoad() {
    window.location.href="play";
  }

  onNewCard() {
    if (this.questionTextField !== undefined &&
      this.answerTextField !== undefined) {
      let card: CardDto = {
        answer: this.answerTextField.nativeElement.value,
        question: this.questionTextField.nativeElement.value,
        categoryId: 162 //ToDo this.selectedCategory.id
      }
      let newCard:CardDto
      this.cardsSubscription = this.cardRestControllerService.addCard(card).subscribe(
        data=>{
            this.updateCards();
          },err =>{
            if( !this.toastService.showHttpErrorToast(err))
              this.toastService.showErrorToast('error','create card gone wrong',);
            console.log(err);
          })

    }
  }

  onUpdateCard() {
    if (this.questionTextField !== undefined &&
      this.answerTextField !== undefined) {
      let card: CardDto = {
        id: this.selectedCard?.id,
        answer: this.answerTextField.nativeElement.value,
        question: this.questionTextField.nativeElement.value,
        categoryId: 162 //ToDo this.selectedCategory.id
      }
      let newCard:CardDto
      this.cardsSubscription = this.cardRestControllerService.updateCard(card).subscribe(
        data=>{
          this.updateCards();
        },err =>{
          if( !this.toastService.showHttpErrorToast(err))
            this.toastService.showErrorToast('error','create card gone wrong',);
          console.log(err);
        })

    }
  }

}
