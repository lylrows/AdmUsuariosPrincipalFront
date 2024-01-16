import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-recruitment-detail-document',
  templateUrl: './recruitment-detail-document.component.html',
  styleUrls: ['./recruitment-detail-document.component.scss']
})
export class RecruitmentDetailDocumentComponent implements OnInit {
  datos: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RecruitmentDetailDocumentComponent>,
  ) { 
    
    this.datos = data;
  } 

  ngOnInit(): void {
  }

}
