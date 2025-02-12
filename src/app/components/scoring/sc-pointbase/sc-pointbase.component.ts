// sc-pointbase.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatchEventsService } from '../../../service/match-events.service';
import { MemoriesService } from '../../../service/memories.service';
import { ScoringService } from '../../../service/scoring.service';
import { TeamService } from '../../../service/team.service';
import { PlayerService } from '../../../service/player.service';

@Component({
  selector: 'app-sc-pointbase',
  templateUrl: './sc-pointbase.component.html',
  styleUrls: ['./sc-pointbase.component.css']
})
export class ScPointbaseComponent implements OnInit, OnDestroy {
  fixtureId!: number;
  playingTeams: any[] = [];
  setsWon: number[] = [0, 0];
  selectedFiles?: FileList;
  uploading = false;
  imagePaths: string[] = [];
  addingEvent = false;
  fixtureDetails: any;
  eventImage?: File;
  allPlayers: any[] = [];
  currentTime: Date = new Date();
  private timeInterval: any;
  endingMatch = false;
  teamPlayersMap: { [key: number]: any[] } = {};
  selectedPrimaryTeamId: number | null = null;
  selectedSecondaryTeamId: number | null = null;
  isSingleGame = false;
  gameType = '';



  eventData: any = {
    event_type: '',
    event_time: '',
    event_description: '',
    player_id: null,
    secondary_player_id: null,
    ImgPath: '',
    fixture_id: 0
  };
  constructor(
    private scoringService: ScoringService,
    private toastr: ToastrService,
    private imgService: MemoriesService,
    private route: ActivatedRoute,
    private matchEventService: MatchEventsService,
    private teamService: TeamService,
    private playerService: PlayerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.timeInterval = setInterval(() => {
      this.currentTime = new Date();
      this.eventData.event_time = this.currentTime.toISOString(); // Or format as needed by your API
    }, 1000);
    this.route.params.subscribe(params => {
      this.gameType = params['game'];
      this.isSingleGame = this.gameType.endsWith('-single');
    });
    this.fixtureId = this.route.snapshot.params['id'];
    this.eventData.fixture_id = this.fixtureId;
    this.loadPlayingTeams();
    this.loadFixtureDetails();
  }
  ngOnDestroy() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  getTeamPlayers(teamId: number): any[] {
      return this.teamPlayersMap[teamId] || [];
  }
  loadPlayingTeams() {
    this.teamService.playingTeams(this.fixtureId).subscribe({
      next: (res: any) => {
        this.playingTeams = [
          { Tname: res.Team1, teamid: res.team1Id },
          { Tname: res.Team2, teamid: res.team2Id }
        ];
        this.loadPlayers();
        this.loadExistingScores();
      },
      error: (err) => this.toastr.error('Failed to load teams')
    });
  }
  loadPlayers() {
    this.playingTeams.forEach(team => {
      this.playerService.getTeamPlayers(team.teamid).subscribe({
        next: (players: any[]) => {
          this.teamPlayersMap[team.teamid] = players.map(p => ({
            ...p,
            teamId: team.teamid
          }));
          this.allPlayers = Object.values(this.teamPlayersMap).flat();
        },
        error: (err) => this.toastr.error(`Failed to load players for ${team.Tname}`)
      });
    });
  }
  get primaryTeamPlayers() {
    return this.teamPlayersMap[this.selectedPrimaryTeamId || -1] || [];
  }

  get secondaryTeamPlayers() {
    return this.teamPlayersMap[this.selectedSecondaryTeamId || -1] || [];
  }
  loadFixtureDetails() {
    this.scoringService.matchScores(this.fixtureId).subscribe({
      next: (res: any) => {
        this.fixtureDetails = res.Fixture;
      },
      error: (err) => this.toastr.error('Failed to load fixture details')
    });
  }

  loadExistingScores() {
    this.scoringService.matchScores(this.fixtureId).subscribe({
      next: (res: any) => {
        const pointScores = res.ScoreDetails.find((s: any) => s.Type === 'Point-Based Scoring');
        if (pointScores) {
          this.playingTeams.forEach((team, index) => {
            const teamScore = pointScores.Score.find((s: any) => s.TeamId === team.teamid);
            this.setsWon[index] = teamScore ? teamScore.setsWon : 0;
          });
        }
      },
      error: (err) => this.toastr.error('Failed to load existing scores')
    });
  }

  updateScore(teamName: string, sets: number) {
    const data = {
      teamName: teamName,
      setsWon: sets,
      fixture_id: this.fixtureId
    };

    this.scoringService.AddOrUpdatePointBasedScore(data).subscribe({
      next: () => {
        this.toastr.success('Score updated');
        this.loadExistingScores();
      },
      error: (err) => this.toastr.error('Update failed')
    });
  }
  onFileSelected(event: any) {
    this.selectedFiles = event.target.files;
  }
  onEventImageSelected(event: any) {
    this.eventImage = event.target.files[0];
  }

  uploadImages() {
    if (!this.selectedFiles || this.selectedFiles.length === 0) return;
    
    this.uploading = true;
    const formData = new FormData();
    
    // Append all files to FormData
    Array.from(this.selectedFiles).forEach(file => {
      formData.append('files', file, file.name);
    });

    this.imgService.UploadImage(this.fixtureId, formData).subscribe({
      next: (res: string[]) => {
        this.imagePaths = [...this.imagePaths, ...res];
        this.uploading = false;
        this.toastr.success('Images uploaded successfully');
      },
      error: (err) => {
        this.uploading = false;
        this.toastr.error('Image upload failed');
      }
    });
  }

  async addEvent() {
    this.addingEvent = true;
    
    try {
      let imgPath = '';
      this.eventData.event_time = this.currentTime.toISOString();
      // Upload image first if selected
      if (this.eventImage) {
        const formData = new FormData();
        formData.append('file', this.eventImage);
        const response = await this.imgService.UploadImage(this.fixtureId, formData).toPromise();
        imgPath = Array.isArray(response) ? response[0] || '' : response || '';

      }

      // Create clean matchEvent object
      const matchEvent = {
        fixture_id: this.fixtureId,
        event_time: this.eventData.event_time,
        event_type: this.eventData.event_type,
        event_description: this.eventData.event_description,
        player_id: this.eventData.player_id,
        secondary_player_id: this.eventData.secondary_player_id,
        fielder_id: this.eventData.fielder_id
      };

      // Add event with image path
      await this.matchEventService.AddMatchEvents(matchEvent, imgPath).toPromise();
      
      this.toastr.success('Event added successfully');
      this.resetEventForm();
    } catch (error) {
      this.toastr.error('Failed to add event');
    } finally {
      this.addingEvent = false;
    }
  }
  resetEventForm() {
    this.eventData = {
      event_type: '',
      event_time: '',
      event_description: '',
      player_id: null,
      secondary_player_id: null,
      ImgPath: '',
      fixture_id: this.fixtureId
    };
    this.eventImage = undefined;
  }
  endMatch() {
    if (confirm('Are you sure you want to end the match? This cannot be undone!')) {
        this.endingMatch = true;
        let id = Number(this.fixtureId);
        this.scoringService.UpdatePointBasedWinner(id).subscribe({
            next: (res) => {
                this.toastr.success('Match ended successfully');
                //this.router.navigate(['/match-summary', this.fixtureId]);
                this.router.navigate(['']);

            },
            error: (err) => {
                this.toastr.error('Failed to end match');
                this.endingMatch = false;
            }
        });
    }
  }
}