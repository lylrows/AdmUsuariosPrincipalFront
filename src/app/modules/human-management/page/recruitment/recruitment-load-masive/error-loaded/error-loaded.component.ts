import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { RecruitmentLoadMasiveComponent } from './../recruitment-load-masive.component';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
    selector: 'app-error-loaded',
    templateUrl: 'error-loaded.component.html',
    styleUrls: ['./error-loaded.component.scss']
})

export class ErrorLoadedComponent implements OnInit {
    listError: any[];
    title: any;
    constructor(private dialogRef: MatDialogRef<RecruitmentLoadMasiveComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
            this.title = this.data.title;
            this.listError = this.data.error;
         }

    ngOnInit() { }

    close(): void {
        this.dialogRef.close(false);
      }
}