import { Component, Input, OnInit } from '@angular/core';
import { CricketspecialService } from '../../../service/cricketspecial.service';
import { ActivatedRoute } from '@angular/router';


interface Extras {
  noBalls: number;
  wides: number;
  totalExtras: number;
}

interface ApiResponse {
  extras: Extras;
}

@Component({
  selector: 'app-cricketscore',
  templateUrl: './cricketscore.component.html',
  styleUrls: ['./cricketscore.component.css']
})
export class CricketscoreComponent implements OnInit {
  extras: Extras = { noBalls: 0, wides: 0, totalExtras: 0 };
  ApiResponse:any = {
    PlayersScore : {},
    RunwithExtra : {},
    bowlingStats: [],
    winnerId : null
  };
  matchId:number = 0;
  @Input() showPerballUpdate: boolean = true;
  loadMoreClicked: boolean = false;



  constructor(private cricketService: CricketspecialService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getMatchDetails();
  }

  // Fetch match details including venue, teams, and extras
  getMatchDetails(): void {
    this.matchId = Number(this.route.snapshot.paramMap.get('id'));
    this.cricketService.getMatchScore(this.matchId).subscribe((response) => {
      this.ApiResponse = response;  
    });
  }
  getImages(){
    
  }
  loadMore(): void {
    this.loadMoreClicked = true;  // This will load the app-motm component
  }
    
}
