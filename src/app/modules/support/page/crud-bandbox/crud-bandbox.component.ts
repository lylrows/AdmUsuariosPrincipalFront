import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { BandBoxQueryFilter } from '@app/data/schema/salaryband/BandBoxQueryFilter';
import { SalaryBandService } from '@app/data/service/salaryband.service';
import { AppConfirmService } from '@app/shared/services/app-confirm/app-confirm.service';
import { DialogBandBoxComponent } from './dialog-band-box/dialog-band-box.component';

@Component({
  selector: 'app-crud-bandbox',
  templateUrl: './crud-bandbox.component.html',
  styleUrls: ['./crud-bandbox.component.scss']
})
export class CrudBandboxComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  totalRows = 0;
  pageSize = 10;
  currentPage= 0;
  
  pageSizeOptions: number[] = [5, 10, 25, 100];
  Filter= <BandBoxQueryFilter>{pagination:{
    currentPage:1,
    itemsPerPage:10,
    totalItems:0,
    totalPages:1,
    totalRows:0
  }};
  dsgrid1: MatTableDataSource<any> = new MatTableDataSource([]);
  displayedColumns: string[] = [
    'option'
    ,'nameGroup'
    ,'categoryName'
    ,'points'
    ,'minimunPoint'
    ,'middlePoint'
    ,'maximunPoint'
    ,'bandhWidth'
    ,'positions'
    ,'people'
    ,'inband'
    ,'lower'
    ,'higher'
    ,'active'
  ];



  constructor(private salaryBandService: SalaryBandService,
    private dialog: MatDialog,
    private confirmService: AppConfirmService,
    private snack: MatSnackBar,
    ) { }

  ngOnInit(): void {
    this.load();
  }



  pageChanged(event: PageEvent) {
    
    if (this.pageSize !== event.pageSize){
      this.pageSize = event.pageSize;  
      this.Filter.pagination.itemsPerPage= this.pageSize;
      this.Filter.pagination.currentPage = 1;
      this.currentPage=0;
    }else{
      this.Filter.pagination.currentPage = event.pageIndex+1;
      this.currentPage =event.pageIndex;

    }

    this.load();
  }

  load() {
    this.salaryBandService.getListPaginationBandBox(this.Filter).subscribe((res) => {
      
      this.dsgrid1.data = res.data.list;
      setTimeout(() => {
        this.paginator.pageIndex = this.currentPage;
        this.paginator.length =  res.data.totalItems;
      });

    });
  }
  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? "Agregar Banda Salarial" : "Actualizar Banda Salarial";
    let dialogRef: MatDialogRef<any> = this.dialog.open(DialogBandBoxComponent, {
      width: "720px",
      disableClose: true,
      data: { title: title, payload: data },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        // If user press cancel
        this.load();
        return;
      }
    
    
    });
  }

  deleteItem(row) {
    this.confirmService.confirm({message: `Desea eliminar el registro seleccionado?`})
    .subscribe(res => {
      if (res) {
        
        this.salaryBandService.delete(row.idBandBox).subscribe((res) => {
          if (res.stateCode == 0) {
            this.snack.open(res.messageError[0], "Error", { duration: 4000 });
          } else {
            this.snack.open("Registro eliminado correctamente", "Ok", { duration: 4000 });
            this.load();
          }
        });
      }
    })
  }

}
