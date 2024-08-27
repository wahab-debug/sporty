import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EventService } from '../../../service/event.service';

@Component({
  selector: 'app-addsession',
  templateUrl: './addsession.component.html',
  styleUrl: './addsession.component.css'
})
export class AddsessionComponent {
  sessionObj: any= {};

  constructor(private router: Router, private toastr: ToastrService, private service: EventService){
  }


  onSessionAddReq(){
    
    this.service.addSession(this.sessionObj)
    .subscribe(
      {
        next: res=>
        {          
          this.toastr.success("Session added successfully");
        },
        
        error: err=>
        {
          this.toastr.warning(err.message)
        }
      }
    );
  }

}
