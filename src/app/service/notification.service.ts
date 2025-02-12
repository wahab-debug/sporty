import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) { }
  url = environment.apiBaseUrl+'Notifications/';

  addNotification(noti:any){
    return this.http.post(this.url+'addNotification',noti);
  }
  fetchNotifications(id:number){
    return this.http.get(this.url+'fetchNotifications?userId='+id);
  }

}
