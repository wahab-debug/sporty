import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../../service/notification.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];

  constructor(
    private toastr: ToastrService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.loadNotifications();
  }

  private loadNotifications() {
    const userId = sessionStorage.getItem('id');
    if (!userId) {
      this.toastr.error('User not authenticated');
      return;
    }

    this.notificationService.fetchNotifications(+userId).subscribe({
      next: (res: Notification[]) => {
        this.notifications = res;
      },
      error: (err) => {
        this.toastr.error('Failed to load notifications');
        console.error('Notification error:', err);
      }
    });
  }

  markAsRead(fixtureId: number) {
    // this.notificationService.markAsRead(fixtureId).subscribe({
    //   next: () => {
    //     const notification = this.notifications.find(n => n.FixtureId === fixtureId);
    //     if (notification) {
    //       notification.IsRead = true;
    //     }
    //   },
    //   error: (err) => {
    //     this.toastr.warning('Could not mark notification as read');
    //     console.error('Mark read error:', err);
    //   }
    // });
    console.log(fixtureId);
    
  }
}

interface Notification {
  FixtureId: number;
  IsRead: boolean;
  Team1Name: string;
  Team1Id: number;
  Team2Name: string;
  Team2Id: number;
  MatchType: string;
  MatchDate: Date;
  WinnerTeam: string;
  WinnerId: number;
}