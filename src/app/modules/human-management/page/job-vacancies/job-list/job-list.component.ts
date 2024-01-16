import { egretAnimations } from '@shared/animations/egret-animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { Component, OnInit, ViewChild } from '@angular/core';
import { JobDto } from '@app/data/schema/Job/job';
import { JobInternalQueryFilter } from '@app/data/schema/Job/JobInternalQueryFilter';
import { JobInternalService } from '@app/data/service/jobs-internal.service';
import { MastertableService } from '@app/data/service/mastertable.service';
import { Areas } from '@app/data/schema/areas';
import { Empresa } from '@app/data/schema/empresa';
import { EmpresaService } from '@app/data/service/empresa.service';
import { AreaService } from '@app/data/service/areas.service';

@Component({
    selector: 'app-job-list',
    templateUrl: 'job-list.component.html',
    styleUrls: ['./job-list.component.scss'],
    animations: egretAnimations, 
})

export class JobListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  totalRows = 0;
  pageSize = 10;
  currentPage= 0;

  pageSizeOptions: number[] = [5, 10, 25, 100];
  lstJob: JobDto[];
  lstAreas: any[] = [];
  lstTypeJob: any[] = [];
  
  public empresas: Empresa[];
  gerencias: Areas[];

  filter= <JobInternalQueryFilter>{pagination:{
    currentPage:1,
    itemsPerPage:10,
    totalItems:0,
    totalPages:1,
    totalRows:0
  }, idEmpresa: 0, idGerencia: 0,idArea: 0, idJobType: 0};

    constructor(private jobService: JobInternalService, 
                private masterService: MastertableService,
                private router: Router,
                private areaService: AreaService,
                private empresaService: EmpresaService,
                private snack: MatSnackBar) { }

    ngOnInit() {
        this.loadEmpresas();
        this.loadJobs();
        // this.loadAreas();
        this.loadTypesJob();
    }

    loadEmpresas() {
      this.empresas = [];
      this.empresaService.getAll().subscribe(res =>{
        this.empresas = res;
      });
    }

    changeEmpresa(): void {
      this.gerencias = [];
      this.lstAreas = [];
      this.areaService.getByCompany(this.filter.idEmpresa).subscribe((res) => {
        this.gerencias = res.data;
      });
    }

    changeGerencia(): void {  
      this.lstAreas = [];
      this.areaService.getByManagement(this.filter.idGerencia).subscribe((res) => {
        this.lstAreas = res.data;
      });
    }

    loadJobs() {
          this.jobService.getPagination(this.filter).subscribe(res => {
              this.lstJob = res.data.list;

              setTimeout(() => {
                this.paginator.pageIndex = this.currentPage;
                this.paginator.length =  res.data.totalItems;
              });
          })
    }

    loadTypesJob() {
        this.masterService.getByIdFather(66).subscribe(res => {
            this.lstTypeJob = res;
        })
    }

    search() {
        this.loadJobs();
    }

    pageChanged(event: PageEvent) {
    
        if (this.pageSize !== event.pageSize){
          this.pageSize = event.pageSize;  
          this.filter.pagination.itemsPerPage= this.pageSize;
          this.filter.pagination.currentPage = 1;
          this.currentPage=0;
        }else{
          this.filter.pagination.currentPage = event.pageIndex+1;
          this.currentPage =event.pageIndex;
    
        }
    
        this.loadJobs();
      }


      loadDetail(idjob) {
        this.router.navigate([`/humanmanagement/job-detail/${idjob}`], {
          skipLocationChange: true
        });
      }
}