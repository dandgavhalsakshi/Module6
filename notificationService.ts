import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private baseUrl = 'http://localhost:8080/api/notifications';

  constructor(private http: HttpClient) {}

  getAllNotifications(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getNotificationById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  createNotification(notification: any): Observable<any> {
    return this.http.post(this.baseUrl, notification);
  }

  updateNotification(id: number, notification: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, notification);
  }

  deleteNotification(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  getNotificationsByUser(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/${userId}`);
  }
}
