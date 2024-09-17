import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EventService } from '../../../../service/event.service';

@Component({
  selector: 'app-addsport',
  templateUrl: './addsport.component.html',
  styleUrl: './addsport.component.css'
})
export class AddsportComponent implements OnInit {
 

  constructor(private router: Router, private toastr: ToastrService, private service: EventService){
  }
  ngOnInit(): void {
    this.currentSession();
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
name : String= '';
gameObj:any={};

    onClicking(){
    this.service.addGameToSports(this.gameObj)
    .subscribe({
      next:res=>{
        this.toastr.success("added successfully"+res);
      },
      error:err=>{
        this.toastr.warning(err);
      }
    }
    );
    this.gameObj=''
    }

    currentSession(){
        this.service.getCurrentSession().subscribe(res=>{
          this.name = res as string;      
        });
      }

      
  
}
