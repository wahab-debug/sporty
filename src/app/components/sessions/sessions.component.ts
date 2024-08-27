import { Component, OnInit } from '@angular/core';
import { EventService } from '../../service/event.service';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrl: './sessions.component.css'
})
export class SessionsComponent implements OnInit{
  constructor(private service: EventService){}
  
  ngOnInit(): void {
    this.onRequest()
  }
  eventlist :any[]=[];
  
  onRequest(){
    this.service.getAllSession().subscribe(
      res=>{
        this.eventlist = res as any
      }
    );
  }

}
