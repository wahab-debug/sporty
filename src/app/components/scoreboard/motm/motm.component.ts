import { Component, OnInit } from '@angular/core';
import { CricketspecialService } from '../../../service/cricketspecial.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-motm',
  templateUrl: './motm.component.html',
  styleUrl: './motm.component.css'
})
export class MotmComponent implements OnInit {
  playerDetails: any;
  deliveryDetails: any;
  motmImage: string;

  constructor(
    private cricketScroring: CricketspecialService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    // Get the fixtureId from route params (assuming 'id' is passed as the param)
    const fixtureId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    
    // Fetching Player of the Match Image (motmImagePath)
    this.cricketScroring.GetImagePath(fixtureId).subscribe((data: MotmResponse) => {
      if (data && data.MOMimagepath) {
        this.motmImage = data.MOMimagepath;
        this.playerDetails = data.playerDetails;
        this.deliveryDetails = data.Deliveryimages;
      }
    });
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
