import { Component } from '@angular/core';
import { SportruleService } from '../../../service/sportrule.service';

@Component({
  selector: 'app-game-rules-mod',
  templateUrl: './game-rules-mod.component.html',
  styleUrl: './game-rules-mod.component.css'
})
export class GameRulesModComponent {
  constructor(private rulesService: SportruleService){}
  rule = {
    sport: '',
    rule_of_game: ''
  };

  ngOnInit(){
    this.onSubmit()
  }
  onSubmit(){
    const id = Number(sessionStorage.getItem('id'));
    this.rulesService.viewRulesPerEM(id).subscribe({
      next: res => {
        if (Array.isArray(res) && res.length > 0) {
          this.rule = res[0];  // Assign the first object in the array to the rule object
        } else {
          console.error('No rules found in response');
        }

        
        // You can handle the response as needed here
      },
      error: (err) => {
        console.error('Error fetching rules:', err);
        // Handle error
      }
    });    
  }
}
