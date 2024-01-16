import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-recognition-model',
  templateUrl: './recognition-model.component.html',
  styleUrls: ['./recognition-model.component.scss']
})
export class RecognitionModelComponent implements OnInit {

  img = '';
  title = '';
  hour = '';
  description = '';
  fullname = ''; 
  icon = '';

  constructor(
    private dialogRef: MatDialogRef<RecognitionModelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    
    this.title = this.data.item.stitle;
    this.description = this.data.item.sdescription;
    this.hour = this.data.item.timeAll;
    this.fullname = this.data.item.sfullname;
    this.icon = this.data.item.sicon;
  }

  ngOnInit(): void {
  }

  cancel(): void {
    if (this.data.item.nid_state != 44) {
      this.dialogRef.close(true);
    } else {
      this.dialogRef.close(false);
    }
  }

}
