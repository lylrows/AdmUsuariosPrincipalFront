  import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
  import { FormBuilder, FormGroup } from '@angular/forms';
  import { MatPaginator, PageEvent } from '@angular/material/paginator';
  import { MatSnackBar } from '@angular/material/snack-bar';
  import { MatSort } from '@angular/material/sort';
  import { MatTableDataSource } from '@angular/material/table';
  import { Router } from '@angular/router';
  import { PerformanceService } from '@app/data/service/performance.service';
  import { AppConfirmService } from '@app/shared/services/app-confirm/app-confirm.service';
  import { StylePaginatorDirective } from '@app/shared/directives/style-paginator.directive';
import { CampaignQueryFilter } from '@app/data/schema/Campaign/CampaignQueryFilter';


  @Component({
    selector: 'app-performance-evaluation',
    templateUrl: './performance-evaluation.component.html',
    styleUrls: ['./performance-evaluation.component.scss'],
    encapsulation: ViewEncapsulation.None,
    
  })
  export class PerformanceEvaluationComponent implements OnInit {

    @ViewChild(StylePaginatorDirective, { static: true }) paginatorx: StylePaginatorDirective;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    bellDT: MatTableDataSource<any> = new MatTableDataSource([]);
    public list: any[] = [];
    public listmonth: any[] = [];
    public listcampaign: any[] = [];
    public liststatus: any[] = [];

    totalRows = 0;
    pageSize = 10;
    currentPage = 0;
    nidPerson: number = 0;

    pageSizeOptions: number[] = [5, 10, 25, 100];

    campaignFilter= <CampaignQueryFilter>{pagination:{
      currentPage:1,
      itemsPerPage:this.pageSize,
      totalItems:0,
      totalPages:1,
      totalRows:0
    }, nidCampana: 0,
      snamecampaign: '',
      nstatus: 0,
      nyear:  0,
      nmonth: 0
    };

    displayedColumns: string[] = [
      'option',
      'year',
      'month',
      'name',
      'cantemployee',
      't0',
      't1',
      't2',
      'createdate',
      'state',
    ];

    constructor(
      private _service: PerformanceService,
      private _fs: FormBuilder,
      private _router: Router,
      private confirmService: AppConfirmService,
      private cdr: ChangeDetectorRef,
      private snack: MatSnackBar,
    ) {
      const user = JSON.parse(localStorage.getItem('GRUPOFE_USER'));
      this.nidPerson = user.nid_person;
      this.campaignFilter.nyear = new Date().getFullYear(),
      this.getMonth();
    }

    
  
    ngOnInit(): void {
      this.bellDT.paginator =this.paginatorx.matPag;
      this.load();
      this.getListCampaign();
      this.getListStatus();

    }

    getMonth(): void {
      this.listmonth = this._service.getListMonth();
    }

    getListStatus(): void {
      this.liststatus = this._service.getListStatus();
    }

    getListCampaign(): void {
      this._service.getListCampaign().subscribe(resp => {

        this.listcampaign = resp;
      })
    }

    load() {
      this.paginatorx._rangeStart = 0;
      this.paginatorx._rangeEnd = 2;
      this.changedPageNumber(0);
    }


    getList(): void {
      this._service.getListRecognition(this.campaignFilter).subscribe(resp => {
        this.list = resp.list;
        this.list.map(e => {
          const mounth = this.listmonth.find(v => v.code === e.month)
          e.monthName = mounth.name;
        })
        setTimeout(() => {
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = resp.totalItems;
        })
      }, (err) => { },
        () => {
          this.bellDT = new MatTableDataSource<any>(this.list);
          setTimeout(() => {
            this.paginatorx.initPageRange();
          });
          this.ngAfterViewInit();
        }
      )

    }

    ngAfterViewInit(): void {
      this.bellDT.paginator = this.paginatorx.matPag;
    }

    addcampaign(): void {
      this._router.navigate(['/humanmanagement/add-campaign', 0], {
        skipLocationChange: true
      })
    }

    resetFilter(): void {
      this.campaignFilter= <CampaignQueryFilter>{pagination:{
        currentPage:1,
        itemsPerPage:10,
        totalItems:0,
        totalPages:1,
        totalRows:0
      }, nidCampana: 0,
      snamecampaign: '',
      nstatus: 0,
      nyear:  0,
      nmonth: 0};
      this.load();
    }

    asignEmployee(row): void {
      this._router.navigate(['/humanmanagement/asign-employee', row.id_Campaign], {
        skipLocationChange: true
      })
    }

    editCampaign(row): void {
      this._router.navigate(['/humanmanagement/add-campaign', row.id_Campaign], {
        skipLocationChange: true
      })
    }

    viewevalutions(row): void {
      this._router.navigate(['/humanmanagement/campaing-evaluation', row.id_Campaign], {
        skipLocationChange: true
      })
    }

    generate(row): void {
      
      if (row.cantidadColaboradores > 0) {
        this.confirmService
          .confirm({
            title: "Confirmación",
            message: "¿Esta seguro de generar las evaluaciones de los empleados?",
          })
          .subscribe((result) => {
            if (result) {

              const payload = {
                nIdCampaign: Number(row.id_Campaign),
                nIdPerson: Number(this.nidPerson)
              }

              this._service.GenerateEvaluations(payload).subscribe(resp => {
                this.getList()
                this.snack.open(resp.messageError, "OK", { duration: 4000 });
              })

            }
            this.cdr.markForCheck();
          });
      } else {
        this.snack.open(
          "Es necesario tener almenos un empleado asignado para poder generar las evaluaciones",
          "OK",
          {
            duration: 4000,
          }
        );
      }
    }

    reiniciarT0(row): void {
      if (row.cantidadColaboradores > 0) {
        this.confirmService
        .confirm({
          title: "Confirmación",
          message: "¿Esta seguro de reiniciar la campaña?",
        })
        .subscribe((result) => {
          if (result) {
            const payload = {
              nIdCampaign: Number(row.id_Campaign)
            }

            this._service.ReInit(payload).subscribe(resp => {
              this.getList()
              this.snack.open(resp.messageError, "OK", { duration: 4000 });
            })
          }
        })
      } else {
        this.snack.open(
          "Es necesario tener almenos un empleado asignado para poder generar las evaluaciones",
          "OK",
          {
            duration: 4000,
          }
        );
      }
    }

    ResetT1(row): void {
      if (row.cantidadColaboradores > 0) {
        this.confirmService
        .confirm({
          title: "Confirmación",
          message: "¿Esta seguro de reiniciar la campaña?",
        })
        .subscribe((result) => {
          if (result) {
            const payload = {
              nIdCampaign: Number(row.id_Campaign)
            }

            this._service.ResetT1(payload).subscribe(resp => {
              this.getList()
              this.snack.open(resp.messageError, "OK", { duration: 4000 });
            })
          }
        })
      } else {
        this.snack.open(
          "Es necesario tener almenos un empleado asignado para poder generar las evaluaciones",
          "OK",
          {
            duration: 4000,
          }
        );
      }
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
        this.campaignFilter.pagination.itemsPerPage = this.pageSize;
        this.campaignFilter.pagination.currentPage = 1;
        this.currentPage = 0;
      }else{
        this.campaignFilter.pagination.currentPage = pageIndex + 1;
        this.currentPage = pageIndex;
      }
      this.bellDT.paginator = this.paginatorx.matPag;
      this.getList();
    }

    

  }
