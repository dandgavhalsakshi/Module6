// RealTimeService.ts
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RealTimeService {

  constructor(private db: AngularFireDatabase) {}

  // Listen to real-time updates on user notifications
  getUserNotifications(userId: string): Observable<any[]> {
    return this.db.list(`notifications/${userId}`)
      .snapshotChanges()
      .pipe(
        map((changes: any[]) =>
          changes.map((c: { payload: { key: any; val: () => object; }; }) => ({ key: c.payload.key, ...(c.payload.val() as object) }))
        )
      );
  }

  // Add a new notification in real-time
  addNotification(userId: string, notification: any): void {
    this.db.list(`notifications/${userId}`).push(notification);
  }

  // Delete a notification
  deleteNotification(userId: string, notificationKey: string): void {
    this.db.list(`notifications/${userId}`).remove(notificationKey);
  }

  // Update a notification (e.g., mark as read)
  updateNotification(userId: string, notificationKey: string, data: Partial<any>): void {
    this.db.list(`notifications/${userId}`).update(notificationKey, data);
  }
}
