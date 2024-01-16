import { Component, OnInit,Inject  } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog-solicitud',
  templateUrl: './confirm-dialog-solicitud.component.html',
  styleUrls: ['./confirm-dialog-solicitud.component.scss']
})
export class ConfirmDialogSolicitudComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConfirmDialogSolicitudComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataSolicitud,) { }



  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

export interface DialogDataSolicitud {
  titlemessage: string;
  bodymessage: string;
  result: boolean;
  textButton:string;
  comment:string;
  brequirecomment:boolean;
  textComment:string;
}