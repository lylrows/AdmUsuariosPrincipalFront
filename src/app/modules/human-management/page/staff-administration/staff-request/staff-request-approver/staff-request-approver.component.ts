import { Component, OnInit, ViewChild, OnDestroy, Inject } from "@angular/core"
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { AppLoaderService } from "@app/shared/services/app-loader/app-loader.service";
import { reduce } from "rxjs/operators";
import { StaffRequestApproverService } from "@app/data/service/staff-request-approver.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-staff-request-approver",
  templateUrl: "staff-request-approver.component.html",
  styleUrls: ['./staff-request-approver.component.scss']
})
export class StaffRequestApproverComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);

  displayedColumns: string[] = [
    'approver',
    'company',
    'area',
    'charge',
    'fullName',
    'reviewDateString',
    'stateName'
  ];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<StaffRequestApproverComponent>,
    private loader: AppLoaderService,
    private staffRequestApproverService: StaffRequestApproverService
  ) {}

  ngOnInit() {
    this.loadStaffRequestApprover();
  }

  loadStaffRequestApprover(){

    this.staffRequestApproverService.getlistbyid(this.data.payload.id).subscribe(res =>{ 
        this.dataSource.data = res.data;
    });
  }

}