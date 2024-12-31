import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-sc-pointbase',
  templateUrl: './sc-pointbase.component.html',
  styleUrl: './sc-pointbase.component.css'
})
export class ScPointbaseComponent {
 @Input() pointBase:{
    team1_name:string;
    team2_name:string;
    team1_setsWon:number;
    team2_setsWon:number
  }
  onSubmit(s){
    console.log(typeof this.pointBase.team1_name,typeof this.pointBase.team1_setsWon);
    
  }
}
