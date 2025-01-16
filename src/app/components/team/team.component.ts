import { Component, OnInit } from '@angular/core';
import { TeamService } from '../../service/team.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrl: './team.component.css'
})
export class TeamComponent implements OnInit {
  teamList: any []=[]
  constructor(private service: TeamService, private toastr: ToastrService,private redirect: Router,     private sanitizer: DomSanitizer
  ){}
  ngOnInit(): void {
    this.onReq();
  }
  onReq(){
    const reg = sessionStorage.getItem('registration_no');
    this.service.AllTeamsByEM(reg).subscribe(
        {
          next: res=>
          {
            this.teamList = (res as any[]).map((team) => {
              // Sanitize the image path
              return {
                ...team,
                safeImagePath: this.sanitizer.bypassSecurityTrustUrl(team.image_path),
              };
            });   
            
          },
          error: err=>
            {
              this.toastr.warning(err);
              
            }
        }
      );
  }
  onSubmit(teamid:number) {
    if (teamid == null) {
      this.toastr.error('Team ID is required.');
      return;
    }
    
    this.service.ApproveTeamById(teamid).subscribe({
      next:res=>{
        this.toastr.success("team approved");
        location.reload();
        
      },
      error:err=>{
        this.toastr.error(err.message);
      }
    });  
  }
  // removeUser(id:any){
  //   if(confirm("Are you sure?")){
  //     this.service.removeTeam(id).subscribe({
  //       next:res=>{
  //         this.toastr.success("deleted");
  //       },
  //       error:err=>{
  //         this.toastr.warning(err.message)
  //       }
  //     })
  //   }
    
  // }
}
