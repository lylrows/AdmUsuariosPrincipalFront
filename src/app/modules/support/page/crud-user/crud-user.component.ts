import { UserService } from "./../../../../data/service/user.service";
import { DialogUserComponent } from "./dialog-user/dialog-user.component";
import { DialogUserResetPasswordComponent } from "./dialog-user/dialog-resetpassword.component";
import { AppLoaderService } from "./../../../../shared/services/app-loader/app-loader.service";
import { AppConfirmService } from "./../../../../shared/services/app-confirm/app-confirm.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSort } from "@angular/material/sort";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { Empresa } from "@app/data/schema/empresa";
import { UserQueryFilter } from "@app/data/schema/user/UserQueryFIlter";
import { Areas } from "@app/data/schema/areas";
import { UserList } from "@app/data/schema/user/UserList";
import { FilterCargo } from "@app/data/schema/cargo";
import { EmpresaService } from "@app/data/service/empresa.service";
import { AreaService } from "@app/data/service/areas.service";
import { MatTableDataSource } from "@angular/material/table";
import { StylePaginatorDirective } from "@app/shared/directives/style-paginator.directive";

@Component({
  selector: "app-crud-user",
  templateUrl: "crud-user.component.html",
  styleUrls: ['crud-user.components.scss']
})
export class CrudUserComponent implements OnInit {
  @ViewChild(StylePaginatorDirective, { static: true }) paginatorx: StylePaginatorDirective;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public items: UserList[];
  contactDataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  public empresas: Empresa[];
  areas: Areas[];
  lstAreas: Areas[];

  totalRows = 0;
  pageSize = 10;
  currentPage= 0;

  pageSizeOptions: number[] = [5, 10, 25, 100];

  userFilter= <UserQueryFilter>{pagination:{
    currentPage:1,
    itemsPerPage:this.pageSize,
    totalItems:0,
    totalPages:1,
    totalRows:0,
  }, idCompany: 0, idArea:0, chargeName: '', userName: '',nsituation:-1};

  displayedColumns: string[] = [
    'option',
    'userName',
    'fullName',
    'nameCompany',
    'nameArea',
    'nameCharge',
    'profile',
    'active',
    'blocked'
  ];

  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private userService: UserService,
    private empresaService: EmpresaService,
    private areaService: AreaService
  ) {}

  ngOnInit() {
    this.contactDataSource.paginator = this.paginatorx.matPag;
    this.load();
    this.loadEmpresas();
    this.loadAreas();
  }

  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? "Agregar Usuario" : "Actualizar Usuario";
    let dialogRef: MatDialogRef<any> = this.dialog.open(DialogUserComponent, {
      width: "720px",
      disableClose: true,
      data: { title: title, payload: data },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        // If user press cancel
        return;
      }
      
      if (isNew) {
        this.userService.add(res).subscribe(
          (res) => {
            // this.loader.close();
            if (res.stateCode == 200) {
              this.snack.open("¡Registro Agregado!", "OK", { duration: 4000 });
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
        
        this.userService.update(res).subscribe(
          (res) => {
            
            if (res.stateCode == 200) {
              this.snack.open("¡Registro Actualizado!", "OK", { duration: 4000 });
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

  openPopUpResetPassword(data: any = {}) {
    let title = "Reestablecer Contraseña";
    let dialogRef: MatDialogRef<any> = this.dialog.open(DialogUserResetPasswordComponent, {
      width: "720px",
      disableClose: true,
      data: { title: title, payload: data },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        // If user press cancel
        return;
      }
      // this.loader.open();
      
      this.userService.resetpassword(res).subscribe(
        (data) => {
          //this.items = data;
          // this.loader.close();
          this.snack.open("¡Registro Actualizado!", "OK", { duration: 4000 });
        },
        (err) => {},
        () => {
          this.load();
        }
      );
    });
  }

  load() {
    this.paginatorx._rangeStart = 0;
    this.paginatorx._rangeEnd = 2;
    this.changedPageNumber(0);
    // this.Filtrar();
  }

  deleteItem(row) {
    this.confirmService.confirm({message: `Desea desbloquear al usuario seleccionado?`})
    .subscribe(res => {
      if (res) {
        // this.loader.open();
        this.userService.unblocked(row.id).subscribe((res) => {
          // this.loader.close();
          if (res.stateCode == 0) {
            this.snack.open(res.messageError[0], "Error", { duration: 4000 });
          } else {
            this.snack.open("Usuario ha sido desbloqueado correctamente", "Ok", { duration: 4000 });
            this.load();
          }
        });
      }
    })
  }


  
  changedPageSize(event: PageEvent) {
    this.setPage(event.pageSize, event.pageIndex);
  }

  changedPageNumber(pagina: number) {
    this.setPage(this.pageSize, pagina);
  }

  setPage(pageSize: number, pageIndex: number) {
    if (this.pageSize !== pageSize){
      this.pageSize = pageSize;  
      this.userFilter.pagination.itemsPerPage = this.pageSize;
      this.userFilter.pagination.currentPage = 1;
      this.currentPage = 0;
    }else{
      this.userFilter.pagination.currentPage = pageIndex + 1;
      this.currentPage = pageIndex;
    }
    this.contactDataSource.paginator = this.paginatorx.matPag;
    
    this.Filtrar();
  }

  Filtrar() {
    this.userService.getAll(this.userFilter).subscribe(res => {
      this.items = res.data.list;
      setTimeout(() => {
        this.paginator.pageIndex = this.currentPage;
        this.paginator.length =  res.data.totalItems;
      });
    },
      (err) => {},
      () => {
        this.contactDataSource = new MatTableDataSource<any>(this.items);
        setTimeout(() => {
          this.paginatorx.initPageRange();
        });
        this.ngAfterViewInit();
      });
  }

  ngAfterViewInit() {
    // this.contactDataSource.paginator = this.paginator;
    this.contactDataSource.paginator = this.paginatorx.matPag;
  }

  lettersOnly(event) {
    if (event.charCode > 32 && event.charCode < 65 || event.charCode > 90 && event.charCode < 97 || event.charCode > 122) return false;
  }

  changeEmpresa(event) {
    if (event.value != 0) {
      this.areas = this.lstAreas.filter(x => x.idEmpresa == event.value);
    }
  }

  loadEmpresas() {
    this.empresaService.getAll().subscribe(res => this.empresas = res);
  }

  loadAreas() {
    this.areaService.getAll().subscribe((res) => {
      this.lstAreas = res.data;
      this.areas = this.lstAreas;
    });
  }

}
