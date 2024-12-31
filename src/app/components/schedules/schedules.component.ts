import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ScheduleService } from '../../service/schedule.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrl: './schedules.component.css'
})
export class SchedulesComponent implements OnInit {
  constructor(private router: ActivatedRoute, private toastr: ToastrService, private service: ScheduleService, private authService: AuthService, private redirect: Router){}
  scheduleDetail:any;
  userRole = ''
  ngOnInit(): void {
    this.loadForm();
    this.getUserRole();
  }
  loadForm(){
    
    this.router.paramMap.subscribe({
      next: (res)=>{
        const name = res.get('game');
        if(name){
          this.service.getMatches(name).subscribe({
            next: (response)=>{
              this.scheduleDetail = response;
            },
            error:err=>{
              this.toastr.warning(err.message)
            }
          })
        }
      }
    })
  }
  startMatch(fixtureId: number) {
    this.service.startMatch(fixtureId).subscribe({
      next:res=>{
        this.toastr.success("Match Started!!");
        this.router.paramMap.subscribe({
          next: res=>{
            const name = res.get('game');
          }
        })
        this.redirect.navigate(['']);
      },
      error:err=>{
        this.toastr.error(err.message);
      }
    });
  }
  getUserRole(){
     this.userRole = this.authService.getUserRole();
  }


}
