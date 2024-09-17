import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../service/event.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sports',
  templateUrl: './sports.component.html',
  styleUrl: './sports.component.css'
})
export class SportsComponent implements OnInit {

  eventlist :any[]=[];
  sessionName:any;

  constructor(private service: EventService, private router: Router, private toastr: ToastrService){}
  ngOnInit(): void {
    this.onRequest();
  }

  
  goToUrl(link:string){
    
    if(!link){
      this.toastr.warning(link+" not found");
    }
    else{
      this.router.navigateByUrl(link);

    }
  }
  onRequest(){
    this.service.getSportBySession().subscribe(
      res=>{
        this.eventlist = res as any;
        this.sessionName = this.eventlist.map(s=>s.name)[0]

      }
    );
  }

}
