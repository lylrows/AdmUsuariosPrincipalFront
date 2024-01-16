import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Areas } from '@app/data/schema/areas';
import { AreasByUser } from '@app/data/schema/areas';
import { Empresa } from '@app/data/schema/empresa';
import { AreaService } from '@app/data/service/areas.service';
import { EmpresaService } from '@app/data/service/empresa.service';
import { PerformanceService } from '@app/data/service/performance.service';
import { StylePaginatorDirective } from '@app/shared/directives/style-paginator.directive';
import { AppConfirmService } from '@app/shared/services/app-confirm/app-confirm.service';
import { CommentComponent } from './comment/comment.component';
import { CampaignEvaluationQueryFilter } from '@app/data/schema/Campaign/CampaignEvaluationQueryFilter';
@Component({
  selector: 'app-campaign-evaluation',
  templateUrl: './campaign-evaluation.component.html',
  styleUrls: ['./campaign-evaluation.component.scss']
})
export class CampaignEvaluationComponent implements OnInit {

  @ViewChild(StylePaginatorDirective, { static: true }) paginatorx: StylePaginatorDirective;
  evaluationoDT: MatTableDataSource<any> = new MatTableDataSource([]);
  evaluatedDeletedDT: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('deleted') deleted;

  id: number = 0;
  campaign;
  form: FormGroup;
  evaluations: any[] = [];
  evaluationsDeleted: any[] = [];
  listnumberAction: any[] = [];
  displayedColumns: string[] = ["view", "evaluatedName", "chargerEvaluated", "evaluatorName", "chargerEvaluator", "timePart", "numberaction"];
  displayedColumnsDeleted: string[] = ["evaluatedName", "chargerEvaluated", "scommentdelete"];
  inputFiler = new FormControl('');

  public empresas: Empresa[];
  public empresasSel: Array<any> = [];

  gerencias: Areas[];
  areas: Areas[];
  subAreas: Areas[];
  areasByUser: AreasByUser;

  bussineFC = new FormControl("");
  gerenciaFC = new FormControl("");
  areaFC = new FormControl("");
  subAreaFC = new FormControl("");

  disabledGerencia: boolean = true;
  disabledArea: boolean = true;
  disabledSubArea: boolean = true;

  totalRows = 0;
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 25, 100];
  anchoPopup: number = 100;
  campaignFilter = <CampaignEvaluationQueryFilter>{
    pagination: {
      currentPage: 1,
      itemsPerPage: this.pageSize,
      totalItems: 0,
      totalPages: 1,
      totalRows: 0
    }, nidCampana: 0,
    CompanyId: 0,
    GerenciaId: 0,
    AreaId: 0,
    SubAreaId: 0,
    numberAction: 0,
    statusetapa:0
  };

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _fs: FormBuilder,
    private _service: PerformanceService,
    private snack: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private confirmService: AppConfirmService,
    private dialog: MatDialog,
    private empresaService: EmpresaService,
    private areaService: AreaService,
    
  ) {
    this.id = this._route.snapshot.params.id;

    this.getListNumberAction();
  }

  ngOnInit(): void {
    let screenWidth = window.innerWidth;
    
    if (screenWidth <= 700 )
      this.anchoPopup = 100;
    else if (screenWidth > 700 && screenWidth <= 1000)
      this.anchoPopup = 70;
    else if (screenWidth > 1000)
      this.anchoPopup = 50;

    this.evaluationoDT.paginator = this.paginatorx.matPag;

    this.load();
    this.getCampaign();
    this.loadEmpresas();

  }

  getListNumberAction(): void {
    this.listnumberAction = this._service.getListNumberAction();
  }

  getCampaign(): void {
    this._service.getCampaign(this.id).subscribe((resp) => {
      this.campaign = resp;
    });
  }

  changeEmpresa(): void {

    this.loadGerencia();
    this.disabledGerencia = false;
  }

  loadEmpresas() {

    let idUser = 0;
    const payload = {
      IdUser: idUser

    }
    this.areaService.getCompanyByUser(payload).subscribe((res) => {
      this.empresas = res.data;
    });


  }

  getListEvaluations(): void {
    this.campaignFilter.nidCampana = Number(this.id);
    
    this.campaignFilter.CompanyId = Number(this.bussineFC.value);
    this.campaignFilter.GerenciaId = Number(this.gerenciaFC.value);
    this.campaignFilter.AreaId = Number(this.areaFC.value);
    this.campaignFilter.SubAreaId = Number(this.subAreaFC.value);
    
    if(this.inputFiler.value==""){
      this.campaignFilter.numberAction=0;
      this.campaignFilter.statusetapa=0;
    }else
    {
      this.campaignFilter.numberAction=Number(this.inputFiler.value.code);
      this.campaignFilter.statusetapa=Number(this.inputFiler.value.bisapproved);
    }

    const payload = {
      nidCampana: this.campaignFilter.nidCampana,
      numberAction: this.campaignFilter.numberAction,
      statusEtapa: this.campaignFilter.statusetapa,
      CompanyId: this.campaignFilter.CompanyId,
      GerenciaId: this.campaignFilter.GerenciaId,
      AreaId: this.campaignFilter.AreaId,
      SubAreaId: this.campaignFilter.SubAreaId,
      CurrentPage: this.campaignFilter.pagination.currentPage,
      ItemsPerPage: this.campaignFilter.pagination.itemsPerPage,
      TotalItems: this.campaignFilter.pagination.totalItems,
      TotalPages: this.campaignFilter.pagination.totalPages,
      TotalRows:this.campaignFilter.pagination.totalRows,

    }

    this.getListEvaluationsDeleted();
    
      this._service.GetCampaingListEvaluations(payload).subscribe(resp => {
      this.evaluations = resp.list; 
      
      setTimeout(() => {
        this.paginator.pageIndex = this.currentPage;
        this.paginator.length = resp.totalItems;
      });
    }, (err) => { },
      () => {
        this.evaluationoDT = new MatTableDataSource(this.evaluations);
        
        setTimeout(() => {
          this.paginatorx.initPageRange();
        });
        this.ngAfterViewInit();
      });
  }

  getListEvaluationsDeleted(): void {
    this.campaignFilter.nidCampana = Number(this.id);

    this._service.GetCampaingListEvaluationsDeleted(this.campaignFilter).subscribe(resp => {
      this.evaluationsDeleted = resp.list; 
    }, (err) => {
       console.log("ERROR",err );
    },
      () => {
        this.evaluatedDeletedDT = new MatTableDataSource(this.evaluationsDeleted);
      });
  }

  ngAfterViewInit(): void {
    this.evaluationoDT.sort = this.sort;
    this.evaluationoDT.paginator = this.paginator;
  }

  detail(row): void {
    this._router.navigate(['/humanmanagement/campaing-evaluation-detail', row.idEvaluation], {
      skipLocationChange: true
    })
  }
  resume(row): void {
    this._router.navigate(['/humanmanagement/evaluation-resume', row.idEvaluation], {
      skipLocationChange: true
    })
  }

  search(): void {
 
    this.load();
  }

  resetFilter(): void {

    this.campaignFilter.numberAction = 0;
    this.campaignFilter.CompanyId = 0;
    this.campaignFilter.AreaId = 0;

    this.inputFiler.setValue('');
    this.bussineFC.setValue('');
    this.gerenciaFC.setValue('');
    this.areaFC.setValue('');
    this.subAreaFC.setValue('');
    
    this.campaignFilter = <CampaignEvaluationQueryFilter>{
      pagination: {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 1,
        totalRows: 0
      }, nidCampana: 0,
      CompanyId: 0,
      AreaId: 0,
      numberAction: 0
    };
    this.load();

  }

  delete(row): void {

    this.confirmService
      .confirm({
        title: "Confirmación",
        message: "¿Esta seguro de eliminar este empleado?",
      })
      .subscribe((result) => {
        if (result) {

          let dialogRef: MatDialogRef<any>;

          dialogRef = this.dialog.open(CommentComponent, {
            width: "720px",
            maxHeight: '650px',
            disableClose: true,
            data: { evaluation: Number(row.idEvaluation), name: row.evaluatedName, receptor: row.idChargeEvaluated, area: row.idAreaEvaluated, campaign: this.campaign.nameCampaign, nid_evaluated: row.idEvaluated },
          });

          dialogRef.afterClosed().subscribe(r => {
            this.getCampaign();
            this.getListEvaluations();
          })
        }
        this.cdr.markForCheck();
      });
  }

  load() {
    this.paginatorx._rangeStart = 0;
    this.paginatorx._rangeEnd = 2;
    this.changedPageNumber(0);
  }

  changedPageSize(event: PageEvent) {
    this.setPage(event.pageSize, event.pageIndex);
  }

  changedPageNumber(pagina: number) {
    this.setPage(this.pageSize, pagina);
  }

  setPage(pageSize: number, pageIndex: number) {
    if (this.pageSize !== pageSize) {
      this.pageSize = pageSize;
      this.campaignFilter.pagination.itemsPerPage = this.pageSize;
      this.campaignFilter.pagination.currentPage = 1;
      this.currentPage = 0;
    } else {
      this.campaignFilter.pagination.currentPage = pageIndex + 1;
      this.currentPage = pageIndex;
    }
    this.evaluationoDT.paginator = this.paginatorx.matPag;
    this.getListEvaluations();

  }

  loadGerencia() {
    const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    let idUser = storage.id;
    const payload = {
      IdUser: idUser,
      IdCompany: Number(this.bussineFC.value)

    }
    this.areaService.getGerenciasByUser(payload).subscribe((res) => {
      this.gerencias = res.data;
    });
  }

  changeGerencia(): void {
    this.loadAreas();
    this.disabledArea = false;
  }

  loadAreas() {
 
    const payload = {
      IdArea: Number(this.gerenciaFC.value)

    }
    this.areaService.getSubAreasByArea(payload).subscribe((res) => {
      this.areas = res.data;
    });

  }

  changeArea(): void {
    this.loadSubAreas();
    this.disabledSubArea = false;
  }
  OpenDeleted() {
    this.deleted.toggle();
  }
  closeDeletebar() {
    this.deleted.close();
  }
  loadSubAreas() {
    const payload = {
      IdArea: Number(this.areaFC.value)

    }
    this.areaService.getSubAreasByArea(payload).subscribe((res) => {
      this.subAreas = res.data;
      if (this.subAreas.length == 0) {
        this.disabledSubArea = true;

      }
      else {
        this.disabledSubArea = false;

      }

    });

  }
  printXlsProgress():void{
    


    this.campaignFilter.nidCampana = Number(this.id);
    
    this.campaignFilter.CompanyId = Number(this.bussineFC.value);
    this.campaignFilter.GerenciaId = Number(this.gerenciaFC.value);
    this.campaignFilter.AreaId = Number(this.areaFC.value);
    this.campaignFilter.SubAreaId = Number(this.subAreaFC.value);
    
    if(this.inputFiler.value==""){
      this.campaignFilter.numberAction=0;
      this.campaignFilter.statusetapa=0;
    }else
    {
      this.campaignFilter.numberAction=Number(this.inputFiler.value.code);
      this.campaignFilter.statusetapa=Number(this.inputFiler.value.bisapproved);
    }

    const payload = {
      IdCampaign: Number(this.id) ,

      
      numberAction: this.campaignFilter.numberAction,
      statusEtapa: this.campaignFilter.statusetapa,
      CompanyId: this.campaignFilter.CompanyId,
      GerenciaId: this.campaignFilter.GerenciaId,
      AreaId: this.campaignFilter.AreaId,
      SubAreaId: this.campaignFilter.SubAreaId
      

    }
    this._service.getcampaignprogressxls(payload).subscribe((resp) => {
      
      try {
        

        const contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        const b64Data = resp.data;
        
        const blob = this.b64toBlob(b64Data, contentType);
        const blobUrl = URL.createObjectURL(blob);
        
        const _afile = document.getElementById('afile') as HTMLAnchorElement;
        _afile.href = blobUrl;
        _afile.download = 'Resumen de Avance Evaluación de Desempeño '+ this.campaign.nameCampaign +'.xlsx'
        _afile.click();
        window.URL.revokeObjectURL(blobUrl);

      } catch (e) {
        console.log(e);
      }
    
    });
  }
  b64toBlob = (b64Data, contentType='', sliceSize=512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
  
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }


}
