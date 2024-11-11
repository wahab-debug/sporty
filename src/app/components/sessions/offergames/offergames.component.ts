import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../service/event.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-offergames',
  templateUrl: './offergames.component.html',
  styleUrl: './offergames.component.css'
})
export class OffergamesComponent implements OnInit{
  sports: any[] = [];       
  managers: any[] = [];     
  assignments: any[] = [];
  selectedSportId: string | null = null;  
  selectedManagerId: string | null = null;
  totalTeams:number=null;
  sportObj: SessionSport;
  constructor(private router: Router, private toastr: ToastrService, private service: EventService, private user: AuthService)
  {
    this.sportObj = new SessionSport();
  }

  ngOnInit(): void {
    this.getDropdownValues();
  }
  getDropdownValues(){
    this.service.getAllSports().subscribe(
      res=>{
        this.sports = res as any
      },  
      err=>{
        this.toastr.error('Failed to load sports : '+err.message);
      }
    );
    this.user.getAllUsers().subscribe(
      res=>{
        this.managers= (res as any).filter(u=>u.role==='Mod')
      },
      err=>{
        this.toastr.error('Failed to load managers : '+err.message);
      }
    );
  }
  onSubmit(form:any){
    this.sportObj.sports_id = this.selectedSportId;   
    this.sportObj.managed_by = this.selectedManagerId;
    this.sportObj.no_of_teams = this.totalTeams;    
    
    this.service.addSportinCurrentSession(this.sportObj)
    .subscribe(
     {
      next:res=>{
          this.toastr.success("sucess");
          location.reload();
      },
      error:err=>{
        this.toastr.warning(err.message)
      }
     }
    )

    
  }

}

export class SessionSport{
   
  sports_id:string;
  managed_by:string; 
  no_of_teams :number;
  constructor(){
    this.sports_id = '';
    this.managed_by = '';
    this.no_of_teams = 0;
  }
}