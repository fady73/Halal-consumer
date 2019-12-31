import { Injectable, EventEmitter, Output } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  @Output() change: EventEmitter<number> = new EventEmitter();

  constructor(private apiService: ApiService) { }
  GetNotification() {
    return this.apiService.get(`/Notification/GetNotifications`)
  }
  PostNotification( NotificationID:number  ) {
    return this.apiService.post( `/Notification/NotificationVisited?notificationID=${NotificationID}`);

  }
  Count(length:number) {
    this.change.emit(length);
  }

}
