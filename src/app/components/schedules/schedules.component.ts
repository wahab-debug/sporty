import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ScheduleService } from '../../service/schedule.service';
import { AuthService } from '../../service/auth.service';
import { HttpResponse } from '@angular/common/http';

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
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor(
    private router: ActivatedRoute,
    private toastr: ToastrService,
    private service: ScheduleService,
    private authService: AuthService,
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
          this.service.getMatchesbySessionSport(name).subscribe({
            next: (response) => {
              this.scheduleDetail = response;
              this.filteredSchedules = response; // Initially, show all schedules   
              // this.sortSchedules(this.sortOrder); // Apply the default sort order                         
            },
            error: (err) => {
              if(err.status===404){
                this.toastr.info(err.error);               
              }
              else{
                this.toastr.warning("Network Error");
              }
            }
          });
        }
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
        sc.team2_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        sc.match_type.toLowerCase().includes(this.searchQuery.toLowerCase())   // Add this line to filter by match type
      );
    } else {
      // If no search query, show all schedules
      this.filteredSchedules = this.scheduleDetail;
    }
    this.sortSchedules(this.sortOrder);
  }
  //code is commented but function sort based on date of match
  sortSchedules(order: 'asc' | 'desc') {
    // this.sortOrder = order;
    // this.filteredSchedules.sort((a, b) => {
    //   const dateA = new Date(a.matchDate).getTime();
    //   const dateB = new Date(b.matchDate).getTime();
    //   return order === 'asc' ? dateA - dateB : dateB - dateA;
    // });
  }
}
