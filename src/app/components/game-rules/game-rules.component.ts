import { Component, OnInit } from '@angular/core';
import { EventService } from '../../service/event.service';
import { ToastrService } from 'ngx-toastr';
import { SportruleService } from '../../service/sportrule.service';

@Component({
  selector: 'app-game-rules',
  templateUrl: './game-rules.component.html',
  styleUrl: './game-rules.component.css'
})
export class GameRulesComponent implements OnInit {
  constructor(private gameService: EventService, private toastr: ToastrService, private ruleService: SportruleService){}
  sport = {
    sport_id: '',
    rule_of_game: ''
  };
  selectedSportId: string | null = null; //hold selected sport id
  sports: any[] = []; //hold all sports from api response
  rules: any[] = [];  //holds rules of a game
  ngOnInit(): void { 
    this.loadForm();
  }
  //load drop down values of sports
  loadForm(){
    this.gameService.getAllSports().subscribe(
      {
        next:res=>{
          this.sports = res as any;
        },
        error:err=>{
          this.toastr.error(err.message);
        }
      }
    );
  }
  //update rules of game 
  onSubmit(form:any){
    this.sport.sport_id = this.selectedSportId;
    this.ruleService.updateRules(this.sport).subscribe({
      next:res=>{
        this.toastr.success("rule updated");
      },
      error:err=>{
        console.log(err.message);
        
        this.toastr.error(err.message);
      }
    });
    this.resetForm();
  }
  // trigger on selecting sport and display rules of games
  onSelect(){
    if(this.selectedSportId===null){
      this.toastr.warning("Please select a sport");
    }else{
      this.ruleService.viewRules(this.selectedSportId).subscribe(
        {
          next:(res)=>{
            this.sport = res as any;
            if ( typeof this.sport==='string') {
              this.toastr.warning('No rules found','',{timeOut:1000});
            } else if (this.sport && this.sport.rule_of_game) {
              this.sport.rule_of_game = this.sport.rule_of_game;
            }
          },
          error:err=>{
            this.toastr.warning(err.message);
          }
        }
      );
    }
  }
  resetForm(){
    this.sport.rule_of_game=''
    this.selectedSportId = ''
  }
}
