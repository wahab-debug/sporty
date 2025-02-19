import { Component, OnInit } from '@angular/core';
import { ScheduleService } from '../../service/schedule.service';
import { ToastrService } from 'ngx-toastr';
import { CricketspecialService } from '../../service/cricketspecial.service';

@Component({
  selector: 'app-taskwork',
  templateUrl: './taskwork.component.html',
  styleUrl: './taskwork.component.css'
})
export class TaskworkComponent implements OnInit{
  constructor(private scheduleService: ScheduleService, private toastr: ToastrService, private cricketService: CricketspecialService){}
  showDiv :boolean = false;
  matches;
  selectedYear;
  filteredMatches;
  requestedMatch;
  teamName;
  playerDetails: any;
  deliveryDetails: any;
  motmImage: string;
  selectedEventType
  filteredMatchEvents
  matchEventsVar
  ngOnInit(){
    this.getMatches();
  }

  getMatches(){
    this.scheduleService.getMatchesofCricket().subscribe({
      next:res=>{
        this.matches = res       
        this.fetchTeams();
        
      },
      error:err=>{
        this.toastr.error('Error while loading');
      }
    });
  }
  fetchTeams(){
    this.scheduleService.getMatchesofCricketwithTime(this.selectedYear).subscribe({
      next:res=>{
        this.filteredMatches = res
      },
      // error:err=>{
      //   this.toastr.error('No match in this slot');
      // }
    });
  }
  
  requestData(t){
    this.cricketService.GetImagePath(t).subscribe({
      next:(data : MotmResponse)=>{
        this.motmImage = data.MOMimagepath;
        this.playerDetails = data.playerDetails;
        this.deliveryDetails = data.Deliveryimages;
        this.matchEventsVar = data.Deliveryimages;
      }
    });
    
  }
  // showSix(){
  //   this.selectedEventType == 6;
  //   if (this.selectedEventType===6) {
  //     this.filteredMatchEvents = this.matchEventsVar.filter(event => 
  //         event.score === this.selectedEventType
  //     );

  //     console.log(this.filteredMatchEvents);
      
  // } else {
  //     // Show all events when no filter is selected
  //     this.filteredMatchEvents = [...this.matchEventsVar];
  // }
  // }
  // showFour(){
  //   this.selectedEventType == 4;
  //   if (this.selectedEventType === 4) {
  //     this.filteredMatchEvents = this.matchEventsVar.filter(event => 
  //         event.score === this.selectedEventType
  //     );

  //     console.log(this.filteredMatchEvents);
      
  // } else {
  //     // Show all events when no filter is selected
  //     this.filteredMatchEvents = [...this.matchEventsVar];
  // }
  // }
  // showCatch(){
  //   if (this.selectedEventType) {
  //     this.filteredMatchEvents = this.matchEventsVar.filter(event => 
  //         event.score === this.selectedEventType
  //     );

  //     console.log(this.filteredMatchEvents);
      
  // } else {
  //     // Show all events when no filter is selected
  //     this.filteredMatchEvents = [...this.matchEventsVar];
  // }
  // }
  // showBowled(){
  //   if (this.selectedEventType) {
  //     this.filteredMatchEvents = this.matchEventsVar.filter(event => 
  //         event.score === this.selectedEventType
  //     );
  //     console.log(this.filteredMatchEvents);
      
  // } else {
  //     // Show all events when no filter is selected
  //     this.filteredMatchEvents = [...this.matchEventsVar];
  // }
  // }

  onEventTypeChange() {
    if(!this.selectedYear || !this.requestedMatch){
      this.toastr.warning("Please select valid teams and time slots");
      return;
    }
    this.filterEventsByType();
  }
  filterEventsByType() {
    debugger
    if (this.selectedEventType && this.selectedEventType==='4' || this.selectedEventType==='6') {
        this.filteredMatchEvents = this.matchEventsVar.filter(event => 
            event.score === this.selectedEventType
        );
        console.log(this.filteredMatchEvents);
        if(this.filteredMatchEvents.length==0) {
          this.toastr.show("No images for selected event");
        }
    }else if(this.selectedEventType && this.selectedEventType==='Caught' || this.selectedEventType==='Bowled'){
      this.filteredMatchEvents = this.matchEventsVar.filter(event => 
        event.wicket === this.selectedEventType
    );
    console.log(this.filteredMatchEvents);
    if(this.filteredMatchEvents==0){
      this.toastr.show("No images for selected event");
    }
    }
     else {
        // Show all events when no filter is selected
        this.filteredMatchEvents = [...this.matchEventsVar];
    }
}
}
interface MotmResponse {
  MOMimagepath: string;
  playerDetails: {
    studentreg: string;
    name: string;
    section: string;
    semno: number;
    discipline: string;
    runsscored: number;
    wickets_taken: number;
  };
  Deliveryimages: Array<{
    imagepath: string;
    deliveriesid: number;
    score: string;
    wicket: string;
    StrikerName: string,
    NonStrikerName: string,
    BowlerName: string,
    DismissedPlayerName: string,
    FielderName: string,
    OverNumber:number,
    BallNumber:number
  }>;
}
