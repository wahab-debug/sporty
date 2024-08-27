import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EventService } from '../../../../service/event.service';

@Component({
  selector: 'app-addsport',
  templateUrl: './addsport.component.html',
  styleUrl: './addsport.component.css'
})
export class AddsportComponent {
 

  constructor(private router: Router, private toastr: ToastrService, private service: EventService){
  }

  games: { [key: string]: boolean } = {
  'Football': false,
  'Basketball': false,
  'Tennis': false,
  'TugOfWar': false,
  'Badminton': false,
  'TableTennis': false,
  'Chess': false,
  'Volleyball': false,
  'Race': false,
  'ArmWrestle': false,
  'Ludo':false,
};
isValidSelection = true;

  onSubmit() {
  
    this.isValidSelection = Object.values(this.games).some(val=>val===true);
    if(this.isValidSelection){
      const checkedGames = Object.keys(this.games).filter(g => this.games[g]).map(t=>({game:t}));
      if(checkedGames!=null){
        this.service.addSportinCurrentSession(checkedGames)
        .subscribe(
          {
            next: res=>{
              this.toastr.success("Sports Added Successfully");
            },
            error:err=>{
              this.toastr.warning(err.message);
            }
          }
        );

      }
    }
   
    

   
  }
  
}
