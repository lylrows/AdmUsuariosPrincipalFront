import { Observable } from 'rxjs';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Injectable } from '@angular/core';

import { AppDialogMessageComponent } from '@app/shared/components/app-dialog-message/app-dialog-message.component';
interface confirmData {
  title?: string,
  message?: string,
  body?: string
}

@Injectable({
  providedIn: 'root'
})
export class AppDialogMessageService {
  constructor(private dialog: MatDialog) { }

  public confirm(data:confirmData = {}): Observable<boolean> {
    data.title = data.title || 'Confirmación';
    data.message = data.message || 'Are you sure?';
    data.body = data.body || 'Content';
    let dialogRef: MatDialogRef<AppDialogMessageComponent>;
    dialogRef = this.dialog.open(AppDialogMessageComponent, {
      width: '380px',
      disableClose: true,
      data: {title: data.title, message: data.message, body: data.body}
    });
    return dialogRef.afterClosed();
  }
}
