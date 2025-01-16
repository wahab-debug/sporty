import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ScheduleService } from '../../service/schedule.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.css']  // Corrected the styleUrl to styleUrls
})
export class SchedulesComponent implements OnInit {
  scheduleDetail: any = [];
  filteredSchedules: any = [];
  searchQuery: string = '';  // To bind with the search input
  userRole = '';

  constructor(
    private router: ActivatedRoute,
    private toastr: ToastrService,
    private service: ScheduleService,
    private authService: AuthService,
    private redirect: Router
  ) {}

  ngOnInit(): void {
    this.loadForm();
    this.getUserRole();
  }

  // Method to load schedule data
  loadForm() {
    this.router.paramMap.subscribe({
      next: (res) => {
        const name = res.get('game');
        if (name) {
          this.service.getMatches(name).subscribe({
            next: (response) => {
              this.scheduleDetail = response;
              this.filteredSchedules = response; // Initially, show all schedules              
            },
            error: (err) => {
              this.toastr.warning(err.message);
            }
          });
        }
      }
    });
  }

  // Method to start a match
  startMatch(fixtureId: number) {
    this.service.startMatch(fixtureId).subscribe({
      next: (res) => {
        this.toastr.success("Match Started!!");
        this.router.paramMap.subscribe({
          next: (res) => {
            const name = res.get('game');
          }
        });
        this.redirect.navigate(['']);
      },
      error: (err) => {
        this.toastr.error(err.message);
      }
    });
  }

  // Method to get user role
  getUserRole() {
    this.userRole = this.authService.getUserRole();
  }

  // Method to filter schedules based on search query
  filterSchedules() {
    if (this.searchQuery) {
      this.filteredSchedules = this.scheduleDetail.filter((sc) =>
        sc.sport_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        sc.team1_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        sc.team2_name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      // If no search query, show all schedules
      this.filteredSchedules = this.scheduleDetail;
    }
  }
}
