import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { TypeStaffRequestService } from "@app/data/service/typestaffrequest.service";
import { TypeStaffRequestQueryFilter } from "@app/data/schema/StaffRequest/TypeStaffRequestQueryFilter";
import { AppConfirmService } from "@app/shared/services/app-confirm/app-confirm.service";
import { AppLoaderService } from "@app/shared/services/app-loader/app-loader.service";
import { DialogTypeStaffRequestComponent } from "./dialog-type-staff-request/dialog-type-staff-request.component";

@Component({
  selector: "crud-type-staff-request",
  templateUrl: "crud-type-staff-request.component.html",
  styleUrls: ['./crud-type-staff-request.component.scss']
})
export class CrudTypeStaffRequestComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  totalRows = 0;
  pageSize = 10;
  currentPage= 0;

  pageSizeOptions: number[] = [5, 10, 25, 100];

  typeStaffRequestFilter = <TypeStaffRequestQueryFilter>{pagination:{
    currentPage:1,
    itemsPerPage:10,
    totalItems:0,
    totalPages:1,
    totalRows:0
  }, name: ''};

  displayedColumns: string[] = [
    'option',
    'name',
    'description',
    'active'
  ];

  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private typeStaffRequestService: TypeStaffRequestService
  ) {}

  ngOnInit() {
    this.load();
  }

  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? "Agregar Tipo de Solicitud" : "Actualizar Tipo de Solicitud";
    let dialogRef: MatDialogRef<any>;
    
    if (isNew){
      dialogRef = this.dialog.open(DialogTypeStaffRequestComponent, {
        width: "720px",
        disableClose: true,
        data: { title: title, payload: data },
      });
    }
    else{
      this.typeStaffRequestService.getbyid(data.id).subscribe((res) => {
        dialogRef = this.dialog.open(DialogTypeStaffRequestComponent, {
          width: "720px",
          disableClose: true,
          data: { title: title, payload: res.data },
        });
      });
    }
    
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        // If user press cancel
        return;
      }
      
      if (isNew) {
        this.typeStaffRequestService.add(res).subscribe(
          (res) => {
            if (res.stateCode == 200) {
              this.snack.open("¡Registro Agregado!", "OK", { duration: 4000 });
              this.load();
            } else if (res.stateCode == 2) {
              this.snack.open(res.messageError[0], "OK", { duration: 4000 });
            } else {
              this.snack.open("Ocurrio un error en el servidor", "Error", { duration: 4000 });
            }
          },
          (err) => {},
          () => {
            this.load();
          }
        );
      } else {
        this.typeStaffRequestService.update(res).subscribe(
          (res) => {
            if (res.stateCode == 200) {
              this.snack.open("¡Registro Actualizado!", "OK", { duration: 4000 });
              this.load();
            } else {
              this.snack.open("Ocurrio un error en el servidor", "Error", { duration: 4000 });
            }
          },
          (err) => {},
          () => {
            this.load();
          }
        );
      }
    });
  }

  load() {
    this.Filtrar();
  }

  pageChanged(event: PageEvent) {
    
    if (this.pageSize !== event.pageSize){
      this.pageSize = event.pageSize;  
      this.typeStaffRequestFilter.pagination.itemsPerPage= this.pageSize;
      this.typeStaffRequestFilter.pagination.currentPage = 1;
      this.currentPage=0;
    }else{
      this.typeStaffRequestFilter.pagination.currentPage = event.pageIndex+1;
      this.currentPage =event.pageIndex;

    }

    this.load();
  }

  Filtrar() {
    
    this.typeStaffRequestService.getAll(this.typeStaffRequestFilter).subscribe(res => {
      this.dataSource.data = res.data.list;
      setTimeout(() => {
        this.paginator.pageIndex = this.currentPage;
        this.paginator.length =  res.data.totalItems;
      });
    });
  }

  lettersOnly(event) {
    if (event.charCode > 32 && event.charCode < 65 
        || event.charCode > 90 && event.charCode < 97 
        || event.charCode > 122) 
        {
          
          return false;
        }
  }
}
