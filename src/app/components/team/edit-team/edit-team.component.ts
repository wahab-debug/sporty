import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TeamService } from '../../../service/team.service';

@Component({
  selector: 'app-edit-team',
  templateUrl: './edit-team.component.html',
  styleUrl: './edit-team.component.css'
})
export class EditTeamComponent implements OnInit {
  constructor(private router: ActivatedRoute, private toastr: ToastrService, private service: TeamService, private redirect: Router){}
  ngOnInit(): void {
   this.loadForm();
  }
  teamDetail: Team={
    teamid:0,
    Tname: '',
    className: '',
    session_id: 0,
    managedby: 0,
    sport_id:0,
    image_path:'',
    teamStatus:0
  };
  onSubmit(){
    this.service.updateTeam(this.teamDetail.teamid,this.teamDetail).subscribe({
      next:res=>{
        this.toastr.success("updated successfully");
        this.redirect.navigate(['teams']);
      },
      error:err=>{
        this.toastr.warning("Error updating user");
      }
    })
    
  }
  loadForm(){
    
    this.router.paramMap.subscribe({
      next: (res)=>{
        const id = res.get('teamid');                
        if(id){
          this.service.getByTeamId(id).subscribe({
            next: (response)=>{
              this.teamDetail = response[0] as Team;
              console.log(this.teamDetail); 
            },
            error:err=>{
              console.log(err.message);
              
            }
          })
        }
      }
    })
  }

}
export class Team{
  teamid:number;
  Tname: string;
  className: string;
  session_id: number;
  managedby: number;
  sport_id:number;
  image_path:string;
  teamStatus:number
}
