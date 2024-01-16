import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { StaffRequestService } from '@app/data/service/staff-request.service';
import { DialogSelectTypeStaffRequestComponent } from '../dialog-select-type-staff-request/dialog-select-type-staff-request.component';

@Component({
  selector: 'app-dialog-category-request',
  templateUrl: './dialog-category-request.component.html',
  styleUrls: ['./dialog-category-request.component.scss']
})
export class DialogCategoryRequestComponent implements OnInit {

  categories: any[] = [];

  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogCategoryRequestComponent>,
    private staffRequestService: StaffRequestService,
  ) { }

  ngOnInit(): void {
    this.getCategory();
  }

  getCategory(): void {
    this.staffRequestService.Listcategory().subscribe(resp => {
      
      this.categories = resp.data;
    })
  }

  showrequest(id): void {
    // this.dialogRef.close();
    let dialogRef: MatDialogRef<any>;
    dialogRef = this.dialog.open(DialogSelectTypeStaffRequestComponent, {
      disableClose: true,
      data: { id: id },
    });
  }

}
