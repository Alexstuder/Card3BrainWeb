import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-first-card',
  templateUrl: './first-card.component.html',
  styleUrls: ['./first-card.component.scss']
})
export class FirstCardComponent implements OnInit{
  headerTitle = 'Frage';
  buttonText = 'Antwort';

  ngOnInit(): void {
  }

  onRichtig(){

  }
  onFalsch(){

  }
  onAntwort(){

  }

}
