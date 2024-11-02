import { Component } from '@angular/core';
import { TeamService } from '../../../service/team.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-addteam',
  templateUrl: './addteam.component.html',
  styleUrl: './addteam.component.css'
})
export class AddteamComponent {
  constructor(private service:TeamService, private toastr: ToastrService){}
  teamObj:any={};
  onSubmit(formData: any) {

    this.service.postTeam(formData.value).subscribe(
      {
        next:res=>{
          this.toastr.success("ok"+res);
        },
        error:err=>{
          this.toastr.warning(err.message);
        }
      }
    );
    this.teamObj=''    
  }
}
