import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { IPositionList } from '@app/data/schema/cargo';
import { IDetailEmployee, IEmployeeFile } from '@app/data/schema/employee';
import { IUpdateEmploye } from '@app/data/schema/employee/employe-query';
import { ICompanyList } from '@app/data/schema/empresa';
import { IListPhone, IPerson } from '@app/data/schema/person';
import { EmployeeService } from '@app/data/service/employee.service';
import { PerformanceService } from '@app/data/service/performance.service';
import { UtilService } from '@app/data/service/util.service';
import { AppConfirmService } from '@app/shared/services/app-confirm/app-confirm.service';
import { ModalRequestDocumentComponent } from '../modal-request-document/modal-request-document.component';
import { ModalRequestComponent } from '../modal-request/modal-request.component';
import { ModalRequestByEmployeeComponent } from './modal-request/modal-request.component';


import { StaffRequestQueryFilter } from "@app/data/schema/StaffRequest/StaffRequestFQueryFilter";
import { StaffRequestService } from "@app/data/service/staff-request.service";
import { TypeStaffRequestService } from "@app/data/service/typestaffrequest.service";
import { StaffRequestDownloadPdfService } from "@app/data/service/staff-request-download-pdf.service";

import { RequestQueryFilter } from '@app/data/schema/Request/RequestQueryFilter';
import { Areas } from 'app/data/schema/areas';
import { AreaService } from '@app/data/service/areas.service';
import { ModalBossComponent } from './modal-boss/modal-boss.component';
import { PostulantFileService } from '@app/data/service/PostulantFileService';
import { CargoService } from '@app/data/service/cargo.service';
import { InformationPostulantService } from '@app/data/service/information-postulant.service';
import { MastertableService } from '@app/data/service/mastertable.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  person: IPerson;
  employee: IDetailEmployee;
  employeeFile: IEmployeeFile;
  idEmployee: number = 0;
  IdPerson: number = 0;
  isNewPhone: boolean = false;
  isNewAddress: boolean = false;
  isNewStuden: boolean = false;
  isNewSon: boolean = false;
  isNewJob: boolean = false;
  isedit: boolean = true;
  idPhone: number = null;
  idAddress: number = null;
  idStuden: number = null;
  idSon: number = null;
  idJob: number = null;
  blockProvince: boolean = false;
  blockDistrict: boolean = false;
  bExistEmployeeFile: boolean = false;
  idPosition: number = 0;
  textSaveSon: string = 'Guardar';
  idBoss:number;

  timePart: number = 0;
  numberAction: number = 0;
  idEvaluated: number = 0;
  idEvaluator: number = 0;

  haveFirma: boolean = false;
  previewFirma: string = null;
  nameFileFirma: string = null;

  haveCarnet: boolean = false;
  previewCarnet: string = null;
  nameFileCarnet: string = null;

  
  company: ICompanyList[] = [];

  gerencias:[]; 
  areas: Areas[];
  subAreas: Areas[];

  gerenciaFC = new FormControl("");
  areaFC = new FormControl("");
  subAreaFC = new FormControl("");

  disabledGerencia: boolean = true;
  disabledArea: boolean = true;
  disabledSubArea: boolean = true;


  position: IPositionList[] = [];
  constCenter: any[] = [];
  area: any[] = [];
  state: any[] = [];
  payroll: any[] = [];
  sex: any[] = [];
  nacionality: any[] = [];
  civil: any[] = [];
  active: any[] = [];
  departament: any[] = [];
  province: any[] = [];
  district: any[] = [];
  listphone: IListPhone[] = [];
  address: any[] = [];
  studen: any[] = [];
  instruccion: any[] = [];
  afp: any[] = [];
  sctr: any[] = [];
  eps: any[] = [];
  fsalud: any[] = [];
  planpracticas: any[] = [];
  jobs: any[] = [];
  sons: any[] = [];

  header: any = null;
  object: any[] = [];
  competencias: any[] = [];
  detail: any[] = [];
  idCampaign: number = 0;
  
  bosslist:any[] =[];
  vidaleylist:any[]=[];
  //#endregion

  fileName: string = '';
  file: File = null;

  fileNameFirma: string = '';
  fileFirma: File = null;

  collaborators: string = '';

  //#region FormCoontrol Header
  inputFullname = new FormControl('');
  inputArea = new FormControl('');
  inputPuesto = new FormControl('');
  inputJefe = new FormControl('');
  inputPhone = new FormControl('', [Validators.required, Validators.pattern(/^[0-9]\d*$/), Validators.minLength(9), Validators.maxLength(9)]);

  inputNameJob = new FormControl('', [Validators.required]);
  inputTimeJob = new FormControl('', [Validators.required]);
  inputPositionJob = new FormControl('', [Validators.required]);
  inputFunctionJob = new FormControl('', [Validators.required]);

  inputNameSon = new FormControl('', [Validators.required]);
  inputDateSon = new FormControl('', [Validators.required]);
  inputLastnameSon = new FormControl('', [Validators.required]);
  inputLastmotherSon = new FormControl('', [Validators.required]);
  //#endregion

  isNewRequest: boolean = false;

  sede: any[] = [];
  idSection: Number = 1;
  lstStateStudy: any[] = [];

  //Solicitudes Administrativas
  //@ViewChild(StylePaginatorDirective, { static: true }) paginatorx: StylePaginatorDirective;
  @ViewChild(MatPaginator) paginatorSA: MatPaginator;
  @ViewChild(MatSort) sortSA: MatSort;
  dataSourceSA: MatTableDataSource<any> = new MatTableDataSource([]);


  public itemsSA: any[];
  totalRowsSA = 0;
  pageSizeSA = 10;
  currentPageSA = 0;
  pageSizeOptionsSA: number[] = [5, 10, 25, 100];
  staffRequestFilterSA = <StaffRequestQueryFilter>{
    idEmployee: 0, 
    idUser: 0,
    idCompany: 0,
    idArea: 0,
    idStatus: 0,
    pagination: {
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
      totalPages: 1,
      totalRows: 0
    }, idTypeStaffRequest: 0
  };
  displayedColumnsSA: string[] = [
    'requestNumber',
    'typeStaffRequest',
    
    'dateIssue',
    'charge',
    'area',
    'company',
    'stateName',
    'scomment',
    'download'
  ];

  requestDT: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild(MatPaginator) paginatorSD: MatPaginator;
  @ViewChild(MatSort) sortSD: MatSort;
  
  listSD: any[] = [];
  requestListSD: any[] = [];
  pageSizeOptionsSD: number[] = [5, 10, 25, 100];
  totalRowsSD = 0;
  pageSizeSD = 10;
  currentPageSD= 0;

  requestFilterSD= <RequestQueryFilter>{pagination:{
    currentPage:1,
    itemsPerPage:this.pageSizeSD,
    totalItems:0,
    totalPages:1,
    totalRows:0,
  }, id: 0, idbussines:0, idarea: 0, nstate: 0, dateStart: '', dateEnd: '', nid_typerequest: 0, ntypeseccion: 0, nid_employee: 0 };
  displayedColumnsSD: string[] = [
    
    'styperequest',
    'fecha',
    'section',
    'accion',
    'sapprover',
    'scomment',
    'sstate',
    'download'
  ];
  //Solicitud de Documentos

  initPhoneArray(): FormGroup {
    return new FormGroup({
      nid_phone: new FormControl(''),
      phone: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]\d*$/)])
    })
  }

  //#region Tablas
  phoneDT: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [
    'option',
    'phone',
    'state'
  ];

  adressDT: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild('paginatoraddress') paginatoraddress: MatPaginator;
  @ViewChild(MatSort) sortaddress: MatSort;
  displayedColumnsphone: string[] = [
    'option',
    'address',
    'distric',
    'province',
    'departament',
    'state'
  ];

  studenDT: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild('paginatorstudent') paginatorstudent: MatPaginator;
  @ViewChild(MatSort) sortstudent: MatSort;
  displayedColumnstudent: string[] = [
    'option',
    'instruccion',
    'scarreer',
    'sstudy_center',
    'scurrent_cycle',
    'dateStart',
    'dateEnd',
    'state'
  ];

  sonDT: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild('paginatorson') paginatorson: MatPaginator;
  @ViewChild(MatSort) sortson: MatSort;
  displayedColumnson: string[] = [
    'option',
    'sfamilytypedescription',
    'name',
    'lastname',
    'smotherslastname',
    'ddateofbirth'
    
  ];

  jobDT: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild('paginatorjob') paginatorjob: MatPaginator;
  @ViewChild(MatSort) sortjob: MatSort;
  displayedColumnjob: string[] = [
    'option',
    'namejob',
    'timejob',
    'positionjob',
    'function',
    'state'
  ];

  objectDT: MatTableDataSource<any> = new MatTableDataSource([]);
  competenciasDT: MatTableDataSource<any> = new MatTableDataSource([]);

  displayedColumnsobject: string[] = ["object", "indicador", "meta", "peso", "fechainicio", "fechafin"];

  displayedColumnsCompetencias: string[] = ["competencias", 'descripcion', 'nivel', 'definicion_nivel', 'calificacion', 'acciones', 'indicador', 'fechainicio', 'fechafin']
  //#endregion

  //#region Creacion de Formularios
  formPerson: FormGroup;
  formAddress: FormGroup;
  formEmployee: FormGroup;
  formEmployeeFile: FormGroup;
  formStuden: FormGroup;
  flexnum = 43;

  public listDocumentos: any[] = [];
  public familytypelist: any[];
  public lstInstruction: any[] = [];

  initForm(): void {
    this.formPerson = this._fs.group({
      nid_person: [''],
      scodperson: [''],
      sfirstname: ['', [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*')]],
      ssecondname: [''],
      slastname: ['', [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ \s]+')]],
      smotherlastname: ['', [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ \s]+')]],
      semail: ['', [Validators.email]],
      nid_sex: ['', [Validators.required]],
      sbloodtype: [''],
      sidentification: ['', [Validators.required, Validators.pattern(/^[0-9]\d*$/)]],
      spassport: [''],
      dbirthdate: ['', [Validators.required]],
      nid_nationality: ['', [Validators.required]],
      nid_civilstatus: ['', [Validators.required]],
      bitisnotdomiciled: [false, [Validators.required]],
      sdrivinglicense: [''],
      sheavymachinerylicense: [''],
      duniversitygraduationdate: [''],
      dcountryentrydate: [''],
      smedicalstaff: [''],
      nid_active: ['', [Validators.required]],
      simg: [''],
      phones: this._fs.array([]),
      email: ['', [Validators.email]],
      semergency_contact_name: [''],
      semergency_contact_phone: ['', [Validators.pattern(/^[0-9]\d*$/), Validators.minLength(9), Validators.maxLength(9)]],
      sddriverlicense:['']
    })
  }

  initAddress(): void {
    this.formAddress = this._fs.group({
      nid_address: [''],
      saddress: ['', [Validators.required],Validators.pattern('[A-Za-z0-9-.#ÁÉÍÓÚáéíóúñÑ ]*')],
      nid_district: ['', [Validators.required]],
      nid_province: ['', [Validators.required]],
      nid_departament: ['', [Validators.required]],
      state: [''],
      nid_person: [''],
      flat: [''],
    })
  }

  initFormEmployee(): void {
    this.formEmployee = this._fs.group({
      nid_employee: [''],
      scodemployee: [''],
      nid_person: [''],
      nid_position: ['', [Validators.required]],
      nid_area: ['', [Validators.required]],
      nid_company: ['', [Validators.required]],
      plaza: [''],
      nid_costcenter: ['', [Validators.required]],
      ddateoffirstadmission: [''],
      dadmissiondate: ['', [Validators.required]],
      ddeparturedate: [''],
      nid_payroll: ['', [Validators.required]],
      bdependents: [''],
      snit: [''],
      scodsede: [''],
      dcompanyseniority: [''],
      dgovernmentseniority: [''],
      nid_state: ['', [Validators.required]],
      sinsurednumbers: [''],
      stypeinsurance: [''],
      shealthpermit: [''],
      nid_boss: ['0'],
      snameboss: [''],
      dregister: [''],
      scorporatemail:  ['', [Validators.email]],
      sannexed:  [''],
      sheavymachinerylicense:  [''],
      sddriverlicense:  [''],
      snamewife_partner:  [''],
      slastname_partner: [''],
      smotherlastname_partner: [''],
      ddateofmarriage:  [''],
      scovidcard:  [''],
      nid_boss_real:['0'],
      idGerencia:['0'],
      idArea:['0'],
      idSubArea:['0'],
      sname_boss_real:[''],
      safp_code:[''],
      su_entsegvida:[''],
      su_planeps:[''],
      su_plansegpri:[''],
      su_sctrsalud:[''],
      su_entsegpract:[''],
      scentercost:['']
    })
  }

  initFormEmployeeFile(): void {
    this.formEmployeeFile = this._fs.group({
      nid_employee_file: [''],
      nid_employee: [''],
      nvacationdays: ['', [Validators.required, Validators.pattern(/^[0-9]\d*$/)]],
      npendingvacations: ['', [Validators.required, Validators.pattern(/^[0-9]\d*$/)]],
      bsalarycurrency: ['', [Validators.required]],
      bctscurrency: ['', [Validators.required]],
      bitsray: ['', [Validators.required]],
      nid_safeplan: ['', [Validators.required, Validators.pattern(/^[0-9]\d*$/)]],
      bdoesnotapplyqta: ['', [Validators.required]],
      bmixedafp: ['', [Validators.required]],
      nid_sctrpensionentity: [''],
      nid_afp: [''],
      id_epsplan: [''],
      slifelaw: [''],
      nFesaludPlan: [''],
      nInternPlan: [''],
    })
  }

  initFormStuden(): void {
    this.formStuden = this._fs.group({
      nid_employee: [''],
      nid_instruction: ['', [Validators.required]],
      nid_district: ['', [Validators.required]],
      nid_province: ['', [Validators.required]],
      nid_departament: ['', [Validators.required]],
      sstudy_center: ['', [Validators.required,Validators.pattern('[A-Za-zÁÉÍÓÚáéíóúñÑ ]*')]],
      scurrent_cycle: ['', [Validators.required]],
      dateStart: ['', [Validators.required]],
      dateEnd: ['', [Validators.required]],
      scarreer: ['', [Validators.required,Validators.pattern('[A-Za-zÁÉÍÓÚáéíóúñÑ ]*')]],
    })
  }
  //#endregion

  constructor(
    private _serviceEmployee: EmployeeService,
    private _serviceUtil: UtilService,
    private _route: ActivatedRoute,
    private _fs: FormBuilder,
    private confirmService: AppConfirmService,
    private snack: MatSnackBar,
    public _dialog: MatDialog,
    private _service: PerformanceService,
    private sanitizer: DomSanitizer,
    private _router: Router,
    private staffRequestService: StaffRequestService,
    private typestaffRequestService: TypeStaffRequestService,
    private staffRequestDownloadPdfService: StaffRequestDownloadPdfService,
    private areaService: AreaService,
    private postulantFileService: PostulantFileService,
    private cargoService:CargoService,
    private personService: InformationPostulantService,
    private masterService: MastertableService
  ) {
    this.getexactusfamilytype();
    this.loadTypesInstruction();

    this.idEmployee = this._route.snapshot.params.id;
    this.initForm();
    this.initAddress();
    this.getDetailtEmployee();
    this.initFormEmployee();
    this.initFormEmployeeFile();
    this.initFormStuden();

    const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    const employeeLogin = storage.nid_employee;
    this.idPosition = storage.nid_profile;
    if ( this.idPosition === 4 || this.idPosition === 20 || this.idPosition === 21 || this.idPosition === 25) {
      this.isedit= true;
      this.flexnum = 43;
    } else {
      this.isedit= false;
      this.flexnum = 50;
    }
    
    if ( employeeLogin === Number(this.idEmployee) ) {
      this.isNewRequest = true;
    } else {
      this.isNewRequest = false;
    }

  }

  getInfoAllByPerson(idperson) {
    this.personService.getInfoAllByPerson(idperson).subscribe((res) => {
      let lstDocumentos = res.data.listaDocumentos;
      let infoDocumentosAdicionales = res.data.listaDocumentosAdicionales;
      let infoDatosFamiliares = res.data.informationFamilyDtos;
      let infoFormacionAcademica = res.data.informationEducationDtos;
      let infoExperienciaLaboral = res.data.informationWorkDtos;

      if(lstDocumentos)
      {
        lstDocumentos.forEach(item => {
          let tipoArchivo = "";
          if(item.tipo_archivo == "DOCUMENTO_DISCAPACIDAD")
          {
            tipoArchivo = "Sustento de Discapacidad";
          }
          else if(item.tipo_archivo == "DOCUMENTO_CASADO")
          {
            tipoArchivo = "Documento de Partida";
          }
          else if(item.tipo_archivo == "DOCUMENTO_COPIA_DNI")
          {
            tipoArchivo = "Copia de DNI";
          }
          else if(item.tipo_archivo == "DOCUMENTO_COPIA_RECIBO_SERVICIO")
          {
            tipoArchivo = "Copia de Recibo de Servicio";
          }
          else{
            tipoArchivo = item.tipo_archivo;
          }
  
          this.listDocumentos.push(
            {
              document: `<b>Datos Personales: </b> ${tipoArchivo}`,
              idMaster: 1,
              indicadorFile: true,
              indicadorPlantilla: false,
              nombreFile: item.filename,
              pathFile: item.ruta_archivo,
              pathPlantilla: ""
            }
          );
        });
      }
      
      if(infoDatosFamiliares)
      {
        infoDatosFamiliares.forEach(item => {
          if(item.idEvaluation != 0)
          {
            let familitype = this.familytypelist.find(p => p.code == item.familyType);
            this.listDocumentos.push(
              {
                document: `<b>Datos Familiares:</b> ${familitype ? familitype.description : item.familyType} - ${item.fullName}`,
                idMaster: 1,
                indicadorFile: true,
                indicadorPlantilla: false,
                nombreFile: item.informationFile?.snamefile,
                pathFile: item.informationFile?.path_complete,
                pathPlantilla: ""
              }
            );
          }        
        });
      }
      
      if(infoFormacionAcademica)
      {
        infoFormacionAcademica.forEach(item => {
          if(item.idEvaluation != 0)
          {
            let instruction = this.lstInstruction.find(p => p.id == item.idInstruction);
            this.listDocumentos.push(
              {
                document: `<b>Formación Académica:</b> ${instruction ? instruction.descriptionValue : item.idInstruction} - ${item.carrer}`,
                idMaster: 1,
                indicadorFile: true,
                indicadorPlantilla: false,
                nombreFile: item.informationFile?.snamefile,
                pathFile: item.informationFile?.path_complete,
                pathPlantilla: ""
              }
            );
          }    
        });
      }
      
      if(infoExperienciaLaboral)
      {
        infoExperienciaLaboral.forEach(item => {
          if(item.idEvaluation != 0)
          {
            this.listDocumentos.push(
              {
                document: `<b>Experiencia Laboral:</b> ${item.company} - ${item.lastPosition}`,
                idMaster: 1,
                indicadorFile: true,
                indicadorPlantilla: false,
                nombreFile: item.informationFile?.snamefile,
                pathFile: item.informationFile?.path_complete,
                pathPlantilla: ""
              }
            );
          }
        });
      }
      
      if(infoDocumentosAdicionales)
      {
        infoDocumentosAdicionales.forEach(item => {
          this.listDocumentos.push(
            {
              document: `<b>Documento Requerido: </b> ${item.document}`,
              idMaster: item.idMaster,
              indicadorFile: item.indicadorFile,
              indicadorPlantilla: item.indicadorPlantilla,
              nombreFile: item.nombreFile,
              pathFile: item.pathFile,
              pathPlantilla: item.pathPlantilla
            }
          );
        });
      }
      
    });
  }
  descargarPlantilla(item) {
    const _ext = this.GetFileExtension(item.pathPlantilla);
    let contentType = '';
    switch(_ext) {
      case 'pdf':
        contentType = 'application/pdf';
        break;
      case 'doc':
      case 'docx':
        contentType = 'application/octet-stream';
        break;
      case 'png':
        contentType = 'image/png';
        break;
      case 'jpg':
        contentType = 'image/jpg';
        break;
      case 'xlsx':
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
    }

    this._serviceUtil.downloadDocumentByPath({
      path_file: item.pathPlantilla
    }).subscribe(res => {
          const b64Data = res.data;          
          const blob = this.b64toBlob(b64Data, contentType);          
          const blobUrl = URL.createObjectURL(blob);          
          const _afile = document.getElementById('afile') as HTMLAnchorElement;
          _afile.href = blobUrl;
          _afile.download = item.document + '.' + _ext;
          _afile.click();
          window.URL.revokeObjectURL(blobUrl);
    });
  }
  GetFileExtension(filename: string) {
    const _lastIndex = filename.lastIndexOf('.');
    const _ext = filename.substring(_lastIndex + 1);
    return _ext;
  };
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
  isDisabledRow(row: any){
    if (row == null || typeof row == 'undefined') return true;
    if (row.disabled == null || typeof row.disabled == 'undefined') return true;
    return row.disabled;
  }
  getexactusfamilytype(): void {
    this._serviceUtil.getexactusfamilytype().subscribe((resp) => {
      this.familytypelist = resp.data;//code-description
    });
  }
  loadTypesInstruction() {
    this.masterService.getByIdFather(932).subscribe(res => {
      this.lstInstruction = res;//id-descriptionValue
    })
  }




  ngOnInit(): void {
    this.getDepartament();
    this.getListCompany();
    this.getListPayroll();
    this.getSex();
    this.getNationality();
    this.getCivil();
    this.getActive();
    this.getConstcenter();
    this.getState();
    this.ListInstruccion();
    this.ListSon();
    this.ListJobs();
    this.getLastCampaignByEmployee();
    this.ListAfp();
    this.ListEPS();
    this.ListFsalud();
    this.ListPracticante();
    this.getSede();
    this.loadStateStudy();
    this.ListVidaLey();
    
    this.formAddress.get('nid_departament').valueChanges.subscribe(() => {
      const id: number = this.formAddress.get('nid_departament').value;
      if (id > 0) {
        this.getProvince(id);
        this.blockProvince = true;
      }
    })

    this.formAddress.get('nid_province').valueChanges.subscribe(() => {
      const id: number = this.formAddress.get('nid_province').value;
      if (id > 0) {
        this.getDistrict(id)
        this.blockDistrict = true;
      }
    })

    this.formStuden.get('nid_departament').valueChanges.subscribe(() => {
      const id: number = this.formStuden.get('nid_departament').value;
      
      if (id > 0) {
        this.getProvince(id);
        this.blockProvince = true;
      }
    })

    this.formStuden.get('nid_province').valueChanges.subscribe(() => {
      const id: number = this.formStuden.get('nid_province').value;
      if (id > 0) {
        this.getDistrict(id)
        this.blockDistrict = true;
      }
    })

    this.formEmployee.get('nid_company').valueChanges.subscribe(() => {
      const id: number = this.formEmployee.get('nid_company').value;
      this.getListPosition(id);
    })

    
    this.load();
    
    this.getListRequest();

    
  }
  
  loadStateStudy() {
    this._serviceEmployee.ListGeneric(110).subscribe((res) => {
      this.lstStateStudy = res;
    });
  }

  load() {
    this.staffRequestFilterSA.idEmployee = Number(this.idEmployee);
    this.staffRequestFilterSA.idUser = 0;
    this.staffRequestFilterSA.idTypeStaffRequest = 0;
    this.staffRequestFilterSA.idArea = 0;
    this.staffRequestFilterSA.idCompany = 0;
    this.staffRequestFilterSA.idStatus = 0;
    
    this.loadDateCurrent();
    this.FiltrarSA();
  }

  pageChangedSA(event: PageEvent) {

    if (this.pageSizeSA !== event.pageSize) {
      this.pageSizeSA = event.pageSize;
      this.staffRequestFilterSA.pagination.itemsPerPage = this.pageSizeSA;
      this.staffRequestFilterSA.pagination.currentPage = 1;
      this.currentPageSA = 0;
    } else {
      this.staffRequestFilterSA.pagination.currentPage = event.pageIndex + 1;
      this.currentPageSA = event.pageIndex;

    }

    this.FiltrarSA();
  }

  changedPageNumberSA(pagina: number) {
    this.setPageSA(this.pageSizeSA, pagina);
  }

  changedPageSizeSA(event: PageEvent) {
    this.setPageSA(event.pageSize, event.pageIndex);
  }

  setPageSA(pageSize: number, pageIndex: number) {
    if (this.pageSizeSA !== pageSize){
      this.pageSizeSA = pageSize;  
      this.staffRequestFilterSA.pagination.itemsPerPage = this.pageSizeSA;
      this.staffRequestFilterSA.pagination.currentPage = 1;
      this.currentPageSA = 0;
    }else{
      this.staffRequestFilterSA.pagination.currentPage = pageIndex + 1;
      this.currentPageSA = pageIndex;
    }
    //this.dataSourceSA.paginator = this.paginatorx.matPag;
    this.FiltrarSA();
  }

  FiltrarSA() {
    this.staffRequestFilterSA.idArea = this.staffRequestFilterSA.idArea == 0 ? 0 : this.staffRequestFilterSA.idArea;
    
      this.staffRequestService.getAllByUser(this.staffRequestFilterSA).subscribe(res => {
        
        if (res.data !== null){
          this.itemsSA = res.data.list;
          setTimeout(() => {
            this.paginatorSA.pageIndex = this.currentPageSA;
            this.paginatorSA.length =  res.data.totalItems;
          });
        }
      
    },
      (err) => {},
      () => {
        this.dataSourceSA = new MatTableDataSource<any>(this.itemsSA);
        
      });
  }

  loadDateCurrent() {
    let currentDate = new Date();
    let initialIssueDate = new Date(currentDate.getFullYear() - 1, 0, 1)
    let finalIssueDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
    this.staffRequestFilterSA.initialIssueDate = initialIssueDate;
    this.staffRequestFilterSA.finalIssueDate = finalIssueDate;
  }

  downloadFile(id) {
    
    this.staffRequestService.downloadFile(id).subscribe((res) => {
      console.log("🚀 ~ this.staffRequestService.downloadFile ~ res:", res)
      if (res.stateCode == 200) {
        let file = res.data;
        this.downLoad(file.file, file.contentType, file.fileName);
      }
    });
  }

  downloadPdf(data) {
    if ( data.idTypeStaffRequest === 17 ) {

      this.typestaffRequestService.getCampañaNuevabyid(data.id).subscribe(resp => {
        if (resp.data != null) {
          this.staffRequestDownloadPdfService.getPdf(data.id, data.idTypeStaffRequest, true).subscribe((res) => {
            if (res.stateCode == 200) {
              let file = res.data;
              this.downLoad(file.file, file.contentType, file.fileName);
            }
          });
       } else {
        this.staffRequestDownloadPdfService.getPdf(data.id, data.idTypeStaffRequest, false).subscribe((res) => {
          if (res.stateCode == 200) {
            let file = res.data;
            this.downLoad(file.file, file.contentType, file.fileName);
          }
        });
       }
      })

    } else {
      this.staffRequestDownloadPdfService.getPdf(data.id, data.idTypeStaffRequest).subscribe((res) => {
        if (res.stateCode == 200) {
          let file = res.data;
          this.downLoad(file.file, file.contentType, file.fileName);
        }
      });


      
    }

    
  }

  downLoad(archivo, contentType, name) {
    let link = document.createElement("a");
    let blobArchivo = this.base64ToBlob(archivo, contentType);
    let blob = new Blob([blobArchivo], { type: contentType });
    link.href = URL.createObjectURL(blob);
    link.download = name;
    link.click();
  }

  getListRequest(): void
  {
    this.requestFilterSD.id = 0;
    this.requestFilterSD.idbussines = 0;
    this.requestFilterSD.idarea = 0;
    this.requestFilterSD.nstate = 0;
    this.requestFilterSD.dateStart = "";
    this.requestFilterSD.dateEnd = "";
    this.requestFilterSD.nid_typerequest = 0;
    this.requestFilterSD.ntypeseccion = 0;
    this.requestFilterSD.nid_employee = Number(this.idEmployee);
    
    
    this._serviceEmployee.ListRequestByUserpagination(this.requestFilterSD).subscribe(resp => {
      
      if (resp!== null){
        this.listSD= resp.list;
        setTimeout(() => {
          this.paginatorSD.pageIndex = this.currentPageSD;
          this.paginatorSD.length =  resp.totalItems;
        });
      }
      
      
      
    }
    
    );
  }

  ngAfterViewInit(): void {
    
  }

  pageChangedSD(event: PageEvent) {
    if (this.pageSizeSD !== event.pageSize) {
      this.pageSizeSD = event.pageSize;
      this.requestFilterSD.pagination.itemsPerPage = this.pageSizeSD;
      this.requestFilterSD.pagination.currentPage = 1;
      this.currentPageSD = 0;
    } else {
      this.requestFilterSD.pagination.currentPage = event.pageIndex + 1;
      this.currentPageSD = event.pageIndex;
    }
    this.getListRequest();
  }



  getSede(): void {
    this.postulantFileService.getexactuslocation().subscribe(resp => {

      if (resp.stateCode===200){
        this.sede = resp.data;
      }
      
    })
  }

  GetDateFormat(value): Date {
    const fecha = value.split('/');

    const day = Number(fecha[0]);
    const month = Number(fecha[1]);
    const year = Number(fecha[2]);
    const fechaDate = new Date(year, month - 1, day);
    return fechaDate
  }

  showRequestModal(): void {
    const config = new MatDialogConfig();
    config.disableClose = true,
    config.width = '1100px',
    config.height = '90%',
    config.data = { employee: this.idEmployee, colaborador: this.collaborators }

    const modal = this._dialog.open(ModalRequestByEmployeeComponent, config);
  }

  showRequestDocument(): void {
    const config = new MatDialogConfig();
    config.disableClose = true,
    config.width = '550px'
    config.data = { employee: this.idEmployee, person: this.IdPerson }

    const modal = this._dialog.open(ModalRequestDocumentComponent, config);
  }

  getLastCampaignByEmployee(): void {
    this._service.getLastCampaignByEmployee(this.idEmployee).subscribe(resp => {
      this.idCampaign = resp.nid_campaign;
      
      if ( this.idCampaign > 0 ) {
        this.getEvaluationDetail(this.idCampaign);
      }
    })
  }

  onFileSelected(event: any) {

    const pddf = event.target.files[0] as File;
    
    if (['application/pdf'].includes(pddf.type)) {
      
      this.file = pddf;
      this.fileName = this.file.name;

      const payload = {
        nid_employee: this.idEmployee
      };

      const formData = new FormData();
      formData.append('files', this.file);
      formData.append('request', JSON.stringify(payload));

      this._serviceEmployee.UpdateCovidCard(formData).subscribe((resp: any) => {
        this.getDetailtEmployee()
        this.file = null;
        this.fileName = null;
        this.snack.open(resp.data, "OK", {
          duration: 4000,
        });
      })

    } else {
      this.snack.open('Solo es permitido pdf', "OK", {
        duration: 4000,
      });

    }
  }

  onFileSelectedFirma(event: any): void {
    const pddf = event.target.files[0] as File;
    if (['image/jpeg', 'image/jpg', 'image/png'].includes(pddf.type)) {
      
      this.fileFirma = pddf;
      this.fileNameFirma = this.fileFirma.name;

      const payload = {
        nid_employee: this.idEmployee
      };

      const formData = new FormData();
      formData.append('files', this.fileFirma);
      formData.append('request', JSON.stringify(payload));

      this._serviceEmployee.UpdateFirma(formData).subscribe((resp: any) => {
        this.getDetailtEmployee()
        this.file = null;
        this.fileName = null;
        this.snack.open(resp.data, "OK", {
          duration: 4000,
        });
      })

    } else {
      this.snack.open('Solo es permitido imagenes', "OK", {
        duration: 4000,
      });

    }
  }

  ViewAdjuntoFirma(): void {
    const urlFile = this.employee.ssignature;

    if ( urlFile != null ) {

      const payload = {
        FileName: '',
        FileUrl: urlFile,
        ContentType: '',
        File: ''
      }
      this._serviceEmployee.GetByFile(payload).subscribe(resp => {
  
        if (resp.data !== null){
          let link = document.createElement('a');
          let blobArchivo = this.base64ToBlob(resp.data.file, resp.data.contentType);
          let blob = new Blob([blobArchivo], { type: resp.data.contentType })
          link.href = URL.createObjectURL(blob);
          link.download = resp.data.fileName;
          link.click();

        }

        
  
      })

    } else {
      this.snack.open('No tiene archivo adjunto de su firma de empleado', "OK", {
        duration: 4000,
      });
    }

    
  }

  ViewAdjunto(): void {
    const urlFile = this.employee.scovidcard;

    if ( urlFile != null ) {

      const payload = {
        FileName: '',
        FileUrl: urlFile,
        ContentType: '',
        File: ''
      }
  
      this._serviceEmployee.GetByFile(payload).subscribe(resp => {
        
  
        let link = document.createElement('a');
        let blobArchivo = this.base64ToBlob(resp.data.file, resp.data.contentType);
        let blob = new Blob([blobArchivo], { type: resp.data.contentType })
        link.href = URL.createObjectURL(blob);
        link.download = resp.data.fileName;
        link.click();
  
      })

    } else {
      this.snack.open('No tiene archivo adjunto de su tarjeta de covid', "OK", {
        duration: 4000,
      });
    }

    
  }

  extraerBase64 = async ($event: any) => new Promise((resolve, reject) => {
    const unsafeImg = window.URL.createObjectURL($event);
    const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
    const reader = new FileReader();
    reader.readAsDataURL($event)
    reader.onload = () => {
      resolve({
        base: reader.result
      })
    };
    reader.onerror = error => {
      resolve({
        base: null
      })
    }
  })

  
  public base64ToBlob(b64Data, contentType='', sliceSize=512) {
    b64Data = b64Data.replace(/\s/g, ''); //IE compatibility...
    let byteCharacters = atob(b64Data);
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        let slice = byteCharacters.slice(offset, offset + sliceSize);

        let byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        let byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, {type: contentType});
  }

  getEvaluationDetail(idCampaign): void {
    this.object = [];
    this.competencias = [];
    this._service.getEvaluationDetail(idCampaign).subscribe(resp => {
      
      this.header = resp.header;
      if ( this.header != null ) {
        this.timePart = this.header.timePart;
        this.numberAction = this.header.numberAction;
        this.idEvaluated = this.header.idUserEvaluated;
        this.idEvaluator = this.header.idUserEvaluator;
  
        let arrayDelete = [];
        resp.details.map((e,i) => {
          if ( e.idGroup === 1 ) {
            if ( e.jobObjectives === null ) {
              arrayDelete.push(e);
            }
          }
        })
        arrayDelete.map(e => {
          const index = resp.details.findIndex(v => v === e);
          resp.details.splice(index,1);
        })
  
        resp.details.map((e,i) => {
          //#region Transformar 0 a null
          if ( e.idGroup === 1 ) {
            if (e.goal > 0 ) {
              e.goal = e.goal
            } else {
              e.goal = null;
            }
  
            if ( e.weight > 0 ) {
              e.weight = e.weight
            } else {
              e.weight = null;
            }
          }
          //#endregion
  
          //#region Transformando Fecha Start and End
          if (e.startDate != null) {
            const fechaDate = this.GetDateFormat(e.startDate)
            e.startDate = fechaDate;
          }
  
          if (e.endDate != null) {
            const fechaDate = this.GetDateFormat(e.endDate)
            e.endDate = fechaDate;
          }
          //#endregion
  
          switch (this.header.numberAction) {
            case 1:
              if ( e.numberAction === 1 ) {
                if (e.idGroup === 1) {
                  this.object.push(e);
                } else {
                  this.competencias.push(e);
                }
              }
              break;
            case 2:
              if ( e.numberAction === 2 ) {
                if (e.idGroup === 1) {
                  this.object.push(e);
                } else {
                  this.competencias.push(e);
                }
              }
              break;
            case 3:
              if ( e.numberAction === 3 ) {
                if (e.idGroup === 1) {
                  this.object.push(e);
                } else {
                  this.competencias.push(e);
                }
              }
              break;
            case 4:
              if ( e.numberAction === 4 ) {
                if (e.idGroup === 1) {
                  this.object.push(e);
                } else {
                  this.competencias.push(e);
                }
              }
              break;
            case 5:
              if ( e.numberAction === 5 ) {
                if (e.idGroup === 1) {
                  this.object.push(e);
                } else {
                  this.competencias.push(e);
                }
              }
              break;
            case 6:
              if ( e.numberAction === 6 ) {
                if (e.idGroup === 1) {
                  this.object.push(e);
                } else {
                  this.competencias.push(e);
                }
              }
              break;
            case 7:
              if ( e.numberAction === 7 ) {
                if (e.idGroup === 1) {
                  this.object.push(e);
                } else {
                  this.competencias.push(e);
                }
              }
              break;
            case 8:
              if ( e.numberAction === 8 ) {
                if (e.idGroup === 1) {
                  this.object.push(e);
                } else {
                  this.competencias.push(e);
                }
              }
              break;
            case 9:
              if ( e.numberAction === 9 ) {
                if (e.idGroup === 1) {
                  this.object.push(e);
                } else {
                  this.competencias.push(e);
                }
              }
              break;
            case 10:
              if ( e.numberAction === 10 ) {
                if (e.idGroup === 1) {
                  this.object.push(e);
                } else {
                  this.competencias.push(e);
                }
              }
              break;
              case 11:
                if ( e.numberAction === 11 ) {
                  if (e.idGroup === 1) {
                    this.object.push(e);
                  } else {
                    this.competencias.push(e);
                  }
                }
                break;
            default:
              break;
          }
        })
      }

      this.detail = resp.details;
      this.objectDT = new MatTableDataSource(this.object);
      this.competenciasDT = new MatTableDataSource(this.competencias);
    })
  }

  addPhone(): void {
    const refPhones = this.formPerson.get('phones') as FormArray;
    refPhones.push(this.initPhoneArray())
  }

  ListJobs(): void {
    this._serviceEmployee.ListJobs(this.idEmployee).subscribe(resp => {
      this.jobs = resp;
      
      this.jobDT = new MatTableDataSource(this.jobs);
      if (this.jobDT.data != null) {
        this.jobDT.paginator = this.paginatorjob;
        this.jobDT.sort = this.sortjob;
      }
    })
  }

  ListSon(): void {
    this._serviceEmployee.ListSon(this.idEmployee).subscribe(resp => {
      this.sons = resp;
      this.sonDT = new MatTableDataSource(this.sons);
      
      if (this.sonDT.data != null) {
        this.sonDT.paginator = this.paginatorson;
        this.sonDT.sort = this.sortson;
      }
    })
  }

  showRequest(): void {
    const config = new MatDialogConfig();
    config.disableClose = true,
    config.data = { employee: this.idEmployee, person: this.IdPerson }

    const modal = this._dialog.open(ModalRequestComponent, config);
  }

  downloadCV(): void {
    let payload=
    {
      idEmployee:Number(this.idEmployee),
      inputFullname:this.inputFullname.value
    }
    
    this._serviceEmployee.downloadCV(payload).subscribe(resp => {
      if (resp){
        let link = document.createElement('a');
        let blobArchivo = this.base64ToBlob(resp.file, resp.contentType);
        let blob = new Blob([blobArchivo], { type: resp.contentType })
        link.href = URL.createObjectURL(blob);
        link.download = resp.fileName;
        link.click();
       }
    })
  }


  add(): void {
    this.isNewPhone = true;
    this.idPhone = null;
  }

  addjob(): void {
    this.isNewJob = true;
    this.idJob = null;
  }

  addson(): void {
    this.isNewSon = true;
    this.idSon = null;
  }

  addaddress(): void {
    this.isNewAddress = true;
    this.idAddress = null;
  }

  addstuden(): void {
    this.isNewStuden = true;
    this.idStuden = null;
  }

  ListStudenEmployee(IdEmployee: number): void {
    this._serviceEmployee.getListStuden(IdEmployee).subscribe(resp => {
      this.studen = resp;
      this.studenDT = new MatTableDataSource(this.studen);
      if (this.studenDT.data != null) {
        this.studenDT.paginator = this.paginatorstudent;
        this.studenDT.sort = this.sortstudent;
      }
    })
  }

  cancelAddress(): void {
    this.formAddress.reset({
      nid_address: '',
      saddress: '',
      nid_district: '',
      nid_province: '',
      nid_departament: '',
      state: '',
      nid_person: '',
      flat: '',
    })
    this.formAddress.updateValueAndValidity();
    this.isNewAddress = false;
    this.idAddress = null;
  }

  cancelStuden(): void {
    this.formStuden.reset({
      nid_employee: '',
      nid_instruction: '',
      nid_district: '',
      sstudy_center: '',
      scurrent_cycle: '',
      dateStart: '',
      dateEnd: '',
      scarreer: ''
    })
    this.formStuden.updateValueAndValidity();
    this.isNewStuden = false;;
    this.idStuden = null;
  }

  saveStuden(): void {
    if ( this.formStuden.invalid ) {
      return Object.values(this.formStuden.controls).forEach((controls) => {
        controls.markAllAsTouched();
      });
    }
    let payload;
    
    if ( this.idStuden === null ) {
      payload = {
        nid_employee: Number(this.idEmployee),
        nid_instruction: Number(this.formStuden.get('nid_instruction').value),
        nid_district: Number(this.formStuden.get('nid_district').value),
        sstudy_center: this.formStuden.get('sstudy_center').value,
        scurrent_cycle: this.formStuden.get('scurrent_cycle').value.toString(),
        dateStart: this.formStuden.get('dateStart').value,
        dateEnd: this.formStuden.get('dateEnd').value,
        scarreer: this.formStuden.get('scarreer').value,
      }
      this._serviceEmployee.InsertStuden(payload).subscribe(resp => {
        
        this.cancelStuden();
        this.ListStudenEmployee(this.idEmployee);
      })

    } else {
      payload = {
        nid_education: this.idStuden, 
        nid_employee: Number(this.idEmployee),
        nid_instruction: Number(this.formStuden.get('nid_instruction').value),
        nid_district: Number(this.formStuden.get('nid_district').value),
        sstudy_center: this.formStuden.get('sstudy_center').value,
        scurrent_cycle: this.formStuden.get('scurrent_cycle').value,
        dateStart: this.formStuden.get('dateStart').value,
        dateEnd: this.formStuden.get('dateEnd').value,
        scarreer: this.formStuden.get('scarreer').value,
      }

      this._serviceEmployee.UpdateStuden(payload).subscribe(resp => {
        
        this.cancelStuden();
        this.ListStudenEmployee(this.idEmployee);
      })
    }
  }

  cancelphone(): void {
    this.inputPhone.setValue('');
    this.isNewPhone = false;
    this.idPhone = null;
  }

  cancelJob(): void {
    this.inputNameJob.setValue('');
    this.inputTimeJob.setValue('');
    this.inputPositionJob.setValue('');
    this.inputFunctionJob.setValue('');
    this.isNewJob = false;
    this.idJob = null;
  }

  cancelSon(): void {
    this.inputNameSon.setValue('');
    this.inputDateSon.setValue('');
    this.inputLastnameSon.setValue('');
    this.inputLastmotherSon.setValue('');
    this.isNewSon = false;
    this.idSon = null;
    this.textSaveSon = 'Guardar';
  }

  editphone(row): void {
    this.isNewPhone = true;
    this.inputPhone.setValue(row.phone);
    this.idPhone = row.nid_phone;
  }

  gotobell(): void {
    this._router.navigate(['/humanmanagement/mis-bell'], {
      skipLocationChange: true
    })
  }

  addGetPhone(id: number, value: string): FormGroup {
    return new FormGroup({
      nid_phone: new FormControl(id),
      phone: new FormControl(value, [Validators.required, Validators.pattern(/^[0-9]\d*$/)])
    })
  }

  getDetailtEmployee(): void {
    this._serviceEmployee.getDetailtEmployee(this.idEmployee).subscribe(resp => {
      
      this.employee = resp;
      
      

      const nameBoss = this.employee.snameboss === null ? 'No tiene jefe inmediato' : this.employee.snameboss;

      if ( this.employee.ssignature === null ) {
        this.haveFirma = false;
        this.previewFirma = null
      } else {
        this.haveFirma = true;

        const payload = {
          FileName: '',
          FileUrl: this.employee.ssignature,
          ContentType: '',
          File: ''
        }

        this._serviceEmployee.GetByFile(payload).subscribe(resp => {
          
          if (resp.data !== null){
            let blobArchivo = this.base64ToBlob(resp.data.file, resp.data.contentType);
            let blob = new Blob([blobArchivo], { type: resp.data.contentType })
            this.extraerBase64(blob).then((imagen: any) => {
              
              this.nameFileFirma = resp.data.fileName; 
            } );

          }

          
          
    
        })
      }

      if ( this.employee.scovidcard != null ) {

        this.haveCarnet = true;

        const payload = {
          FileName: '',
          FileUrl: this.employee.scovidcard,
          ContentType: '',
          File: ''
        }

        this._serviceEmployee.GetByFile(payload).subscribe(resp => {
          
          if (resp.data !== null){
            this.nameFileCarnet = resp.data.fileName;
          }
          
        })

      } else {
        this.haveCarnet = false;
        this.previewCarnet = null;
      }

      if (this.employee.nid_boss === null) 
        this.employee.nid_boss=0;

      this.IdPerson = this.employee.nid_person;
      this.inputArea.setValue(this.employee.nid_area);
      this.inputPuesto.setValue(this.employee.snamecharge);
      this.inputJefe.setValue(nameBoss)
      this.formEmployee.patchValue(this.employee);
      


      if (this.employee.safp_code=== null){
        this.employee.safp_code='';
      }

      this.formEmployee.get('safp_code').setValue(this.employee.safp_code.toString());

      
      if (this.employee.su_planeps ===null)
      {
        this.employee.su_planeps=0;
      }

      this.formEmployee.get('su_planeps').setValue(this.employee.su_planeps.toString());

      if (this.employee.su_entsegpract ===null)
      {
        this.employee.su_entsegpract=0;
      }
      this.formEmployee.get('su_entsegpract').setValue(this.employee.su_entsegpract.toString());

      if (this.employee.su_sctrsalud ===null){
        this.employee.su_sctrsalud=0;
      }
      this.formEmployee.get('su_sctrsalud').setValue(this.employee.su_sctrsalud.toString());


      if (this.employee.su_entsegvida ===null){
        this.employee.su_entsegvida=0;
      }
      this.formEmployee.get('su_entsegvida').setValue(this.employee.su_entsegvida.toString()); 

      if (this.employee.su_plansegpri ===null){
        this.employee.su_plansegpri=0;
      }
      this.formEmployee.get('su_plansegpri').setValue(this.employee.su_plansegpri.toString()); 

      
      this.getPerson(this.IdPerson);
      this.ListStudenEmployee(this.idEmployee);
      this.getEmployeeFile(this.IdPerson);
      this.getListPhone(this.IdPerson);
      this.getListAddress(this.IdPerson);
      
      this.getListBoss(this.formEmployee.get('nid_position').value);
      
      this.getGerencia(this.employee.nid_company);
      this.getAreas(this.employee.idGerencia);
      this.getSubAreas(this.employee.idArea);
      
    })
  }

  ListInstruccion(): void {
    this._serviceEmployee.getListInstruccion().subscribe(resp => {
      this.instruccion = resp;
    })
  }

  getEmployeeFile(IdPerson): void {
    this._serviceEmployee.getEmployeeFile(IdPerson).subscribe(resp => {
      this.employeeFile = resp;
      
      if (this.employeeFile != null) {
        this.bExistEmployeeFile = true;
        this.formEmployeeFile.patchValue(this.employeeFile);
      } else {
        this.bExistEmployeeFile = false;
        this.formEmployeeFile.reset({
          nid_employee_file: 0,
          nid_employee: this.idEmployee,
          nvacationdays: '',
          npendingvacations: '',
          bsalarycurrency: false,
          bctscurrency: false,
          bitsray: false,
          nid_safeplan: false,
          bdoesnotapplyqta: false,
          bmixedafp: false,
        })
      }
      
      
    });
  }

  getListAddress(IdPerson: number): void {
    this._serviceEmployee.getListAddress(IdPerson).subscribe(resp => {
      this.address = resp;
      
      this.adressDT = new MatTableDataSource(this.address);
      if (this.adressDT.data != null) {
        this.adressDT.paginator = this.paginatoraddress;
        this.adressDT.sort = this.sortaddress;
      }
    })
  }

  ListAfp(): void {
    // this._serviceEmployee.ListGeneric(940).subscribe(resp => {
    //   this.afp = resp;
    // })
    this._serviceUtil.getexactusemptable({
      Scheme:'E_ALL',
      TableName:'AFP'
    }).subscribe(resp => {
      
      this.afp = resp.data;
      
    });

  }

  ListEPS(): void {
    this._serviceUtil.getexactusemptable({
      Scheme:'E_ALL',
      TableName:'U_PLANEPS'
    }).subscribe(resp => {
      this.eps = resp.data;
      
      

    })
  }
  ListVidaLey(): void {
    this._serviceUtil.getexactusemptable({
      Scheme:'E_ALL',
      TableName:'U_CIAS_SEGUROS'
    }).subscribe(resp => {
      this.vidaleylist = resp.data;
      
    })
  }
  
  ListFsalud(): void {

    this._serviceUtil.getexactusemptable({
      Scheme:'E_ALL',
      TableName:'U_PLANSEGUROPRIV'
    }).subscribe(resp => {
      this.fsalud = resp.data;

    })
  }

  ListPracticante(): void {
    this._serviceEmployee.ListGeneric(953).subscribe(resp => {
      this.planpracticas = resp;
    })
  }

  getDepartament(): void {
    this._serviceUtil.getDepartament().subscribe(resp => {
      this.departament = resp;
    })
  }

  getProvince(id: number): void {
    this._serviceUtil.getProvince(id).subscribe(resp => {
      this.province = resp;
    })
  }

  getDistrict(id: number): void {
    this._serviceUtil.getDistrit(id).subscribe(resp => {
      this.district = resp;
    })
  }

  getListCompany(): void {
    this._serviceEmployee.getListCompany().subscribe(resp => this.company = resp);
  }

  getListPosition(id_company: number): void {
    this._serviceEmployee.getListPosition(id_company).subscribe(resp => this.position = resp);
  }

  getListPayroll(): void {
    this._serviceUtil.getPayroll().subscribe(resp => this.payroll = resp);
  }

  getSex(): void {
    this._serviceUtil.getSex().subscribe(resp => this.sex = resp);
  }

  getNationality(): void {
    this._serviceUtil.getNationality().subscribe(resp => this.nacionality = resp);
  }

  getCivil(): void {
    this._serviceUtil.getCivil().subscribe(resp => this.civil = resp);
  }

  getActive(): void {
    this._serviceUtil.getActive().subscribe(resp => this.active = resp);
  }

  getConstcenter(): void {
    this._serviceUtil.getCostCenter(4).subscribe(resp => this.constCenter = resp);
  }

  getArea(): void {
    this._serviceUtil.getArea().subscribe(resp => {
      this.area = resp
      const areaData = this.area.find(e => e.nid_area === this.employee.nid_area);
      this.inputArea.setValue(areaData.snamearea);

    })
    
    
  }
  getAreas(idGerencia): void {
    if (idGerencia>0){
      const payload = {
        IdArea: idGerencia
  
      }
      this.areaService.getSubAreasByArea(payload).subscribe((res) => {
        this.areas= res.data;
        
        
      });
      
    }
    
  }

  getSubAreas(idArea) {
    if(idArea>0){
      const payload = {
        IdArea: idArea
  
      }
      this.areaService.getSubAreasByArea(payload).subscribe((res) => {
        
        this.subAreas= res.data;
        this.getChargesByCompanyArea();
      });
    }
   
  }
  getState(): void {
    this._serviceUtil.getStateEmployee().subscribe(resp => this.state = resp)
  }

  getPerson(IdPerson: number): void {
    this._serviceEmployee.getPerson(IdPerson).subscribe(resp => {
      this.person = resp;
      console.log("🚀 ~ this._serviceEmployee.getPerson ~ this.person:", this.person)
      let ssecondname = '';
      if ( this.person.ssecondname != null  ) {
        ssecondname = this.person.ssecondname;
      }
      this.inputFullname.setValue(this.person.sfirstname + ' ' + ssecondname  + ' ' + this.person.slastname + ' ' + this.person.smotherlastname)
      this.collaborators = this.person.sfirstname + ' ' + ssecondname  + ' ' + this.person.slastname + ' ' + this.person.smotherlastname
      this.formPerson.patchValue(this.person);
      
      if(this.person.nid_postulant != null)
      {
        this.getInfoAllByPerson(this.person.nid_postulant);
      }
    })
  }

  removeSpacesPerson(controlName: string): void {
    let value = this.formPerson.get(controlName).value;
    if (value == null) return;
    this.formPerson.get(controlName).setValue(value.trimLeft());
  }

  getListPhone(IdPerson: number): void {
    this._serviceEmployee.getListPhone(IdPerson).subscribe(resp => {
      
      this.listphone = resp;
      this.phoneDT = new MatTableDataSource(this.listphone);
      if (this.phoneDT.data != null) {
        this.phoneDT.paginator = this.paginator;
        this.phoneDT.sort = this.sort;
      }
    })
  }

  savePhone(): void {
    let payload;

    if (this.inputPhone.invalid) {
      return this.inputPhone.markAllAsTouched();
    }
    if (this.idPhone != null) {
      payload = {
        nid_phone: this.idPhone,
        nid_person: this.IdPerson,
        phone: this.inputPhone.value,
        flat: 2
      }
    } else {
      payload = {
        nid_phone: 0,
        nid_person: this.IdPerson,
        phone: this.inputPhone.value,
        flat: 1
      }
    }
    this._serviceEmployee.managementPhone(payload).subscribe(resp => {
      this.cancelphone();
      this.getListPhone(this.IdPerson);
    })
  }

  deletephone(row): void {
    this.confirmService.confirm({ message: `Desea eliminar el Teléfono seleccionado?` })
      .subscribe(res => {
        if (res) {
          const payload = {
            nid_phone: row.nid_phone,
            nid_person: this.IdPerson,
            phone: row.phone,
            flat: 3
          }
          this._serviceEmployee.managementPhone(payload).subscribe((res) => {
            this.cancelphone();
            this.getListPhone(this.IdPerson);
          });
        }
      })
  }

  saveJob(): void {
    let payload;

    if (this.inputNameJob.invalid) {
      this.inputNameJob.markAllAsTouched();
      this.inputTimeJob.markAllAsTouched();
      this.inputPositionJob.markAllAsTouched();
      this.inputFunctionJob.markAllAsTouched();
      return
    }

    if (this.inputTimeJob.invalid) {
     this.inputTimeJob.markAllAsTouched();
     this.inputPositionJob.markAllAsTouched();
      this.inputFunctionJob.markAllAsTouched();
      return;
    }

    if (this.inputPositionJob.invalid) {
      this.inputPositionJob.markAllAsTouched();
      this.inputFunctionJob.markAllAsTouched();
      return;
    }

    if ( this.inputFunctionJob.invalid ) {
      return this.inputFunctionJob.markAllAsTouched();
    }

    if (this.idJob != null) {

      payload = {
        nid_employee: Number(this.idEmployee),
        namejob: this.inputNameJob.value,
        timejob: this.inputTimeJob.value,
        positionjob: this.inputPositionJob.value,
        nid_employee_job: Number(this.idJob),
        sfunction: this.inputFunctionJob.value
      }

      this._serviceEmployee.UpdateJob(payload).subscribe(resp => {
        this.cancelJob();
        this.ListJobs();
      })

    } else {

      payload = {
        nid_employee: Number(this.idEmployee),
        namejob: this.inputNameJob.value,
        timejob: this.inputTimeJob.value,
        positionjob: this.inputPositionJob.value,
        sfunction: this.inputFunctionJob.value
      }

      this._serviceEmployee.InsertJob(payload).subscribe(resp => {
        this.cancelJob();
        this.ListJobs();
      })

      
    }
  }

  saveSon(): void {
    let payload;

    if (this.inputNameSon.invalid) {
      return this.inputNameSon.markAllAsTouched();
    }

    if (this.inputDateSon.invalid) {
      return this.inputDateSon.markAllAsTouched();
    }

    if (this.inputLastnameSon.invalid) {
      return this.inputLastnameSon.markAllAsTouched();
    }

    if ( this.inputLastmotherSon.invalid ) {
      return this.inputLastmotherSon.markAllAsTouched();
    }

    if (this.idSon != null) {

      payload = {
        nid_son: Number(this.idSon),
        nid_employee: Number(this.idEmployee),
        sfullname: this.inputNameSon.value,
        slastname: this.inputLastnameSon.value,
        smotherslastname: this.inputLastmotherSon.value,
        ddateofbirth: new Date(this.inputDateSon.value),
        
      }

      this._serviceEmployee.UpdateSon(payload).subscribe(resp => {
        this.cancelSon();
        this.ListSon();
      })

    } else {

      payload = {
        nid_employee: Number(this.idEmployee),
        sfullname: this.inputNameSon.value,
        ddateofbirth: this.inputDateSon.value,
        slastname: this.inputLastnameSon.value,
        smotherslastname: this.inputLastmotherSon.value,
      }

      this._serviceEmployee.InsertSon(payload).subscribe(resp => {
        this.cancelSon();
        this.ListSon();
      })

    }
  } 

  saveAddress(): void {
    let payload;
    
    if (this.formAddress.invalid) {
      return Object.values(this.formAddress.controls).forEach((controls) => {
        controls.markAllAsTouched();
      });
    }

    if (this.idAddress != null) {
      payload = {
        nid_address: this.formAddress.get('nid_address').value,
        saddress: this.formAddress.get('saddress').value,
        nid_district: this.formAddress.get('nid_district').value,
        state: this.formAddress.get('state').value,
        nid_person: this.IdPerson,
        flat: 2
      }
    } else {
      payload = {
        nid_address: 0,
        saddress: this.formAddress.get('saddress').value,
        nid_district: this.formAddress.get('nid_district').value,
        state: true,
        nid_person: this.IdPerson,
        flat: 1
      }
    }

    this._serviceEmployee.managementAddress(payload).subscribe(resp => {
      this.cancelAddress();
      this.getListAddress(this.IdPerson);
    })

  }

  editSon(row): void {
    this.textSaveSon = 'Actualizar';
    this.isNewSon = true;
    this.inputNameSon.setValue(row.sfullname);
    this.inputDateSon.setValue(row.ddateofbirth);
    this.inputLastnameSon.setValue(row.slastname);
    this.inputLastmotherSon.setValue(row.smotherslastname);
    this.idSon = row.nid_son;
  }

  editjob(row): void {
    this.isNewJob = true;
    this.inputNameJob.setValue(row.namejob);
    this.inputTimeJob.setValue(row.timejob);
    this.inputPositionJob.setValue(row.positionjob);
    this.inputFunctionJob.setValue(row.sfunction);
    this.idJob = row.nid_employee_job;
  }

  editadress(row): void {
    this.isNewAddress = true;
    this.formAddress.reset({
      nid_address: row.nid_address,
      saddress: row.saddress,
      nid_departament: row.nid_department,
      nid_province: row.nid_province,
      nid_district: row.nid_district,
      state: row.state,
      nid_person: this.IdPerson,
      flat: 2
    })
    this.idAddress = row.nid_address;
  }

  editStuden(row): void {
    
    this.isNewStuden = true;
    this.formStuden.reset({
      nid_employee: row.nid_employee,
      nid_instruction: row.nid_instruction,
      nid_district: row.nid_district,
      nid_province: row.nid_province,
      nid_departament: row.nid_department,
      sstudy_center: row.sstudy_center,
      scurrent_cycle: row.scurrent_cycle,
      dateStart: row.dateStart,
      dateEnd: row.dateEnd,
      scarreer: row.scarreer
    })
    this.idStuden = row.nid_education
  }

  deleteadress(row): void {
    this.confirmService.confirm({ message: `Desea eliminar esta Dirección seleccionado?` })
      .subscribe(res => {
        if (res) {
          const payload = {
            nid_address: row.nid_address,
            saddress: this.formAddress.get('saddress').value,
            nid_district: row.nid_address,
            state: row.state,
            nid_person: this.IdPerson,
            flat: 3
          }

          this._serviceEmployee.managementAddress(payload).subscribe(resp => {
            this.cancelAddress();
            this.getListAddress(this.IdPerson);
          })
        }
      })
  }

  deletejob(row): void {
    this.confirmService.confirm({ message: `Desea eliminar este Trabajo seleccionado?` })
      .subscribe(res => {
        if (res) {
          const payload = {
            nid_employee_job: row.nid_employee_job,
            
          }

          this._serviceEmployee.DeleteJob(payload).subscribe(resp => {
            this.cancelJob();
            this.ListJobs();
          })
        }
      })
  }

  deleteStuden(row): void {
    this.confirmService.confirm({ message: `Desea eliminar este Estudio seleccionado?` })
      .subscribe(res => {
        if (res) {
          const payload = {
            nid_education: row.nid_education
          }

          this._serviceEmployee.deleteStuden(payload).subscribe(resp => {
            
            this.cancelStuden();
            this.ListStudenEmployee(this.idEmployee);
          })
        }
      })
  }

  changecompany(): void {
    
    this.formEmployee.get('nid_position').setValue('');
    this.formEmployee.get('nid_position').updateValueAndValidity();
    this.formEmployee.get('nid_position').markAllAsTouched();

    this.formEmployee.get('idGerencia').setValue('');
    this.formEmployee.get('idGerencia').updateValueAndValidity();
    this.formEmployee.get('idGerencia').markAllAsTouched();


    this.formEmployee.get('idArea').setValue('');
    this.formEmployee.get('idArea').updateValueAndValidity();
    this.formEmployee.get('idArea').markAllAsTouched();


    this.formEmployee.get('idSubArea').setValue('');
    this.formEmployee.get('idSubArea').updateValueAndValidity();
    this.formEmployee.get('idSubArea').markAllAsTouched();
    this.areas=[];

    
    this.loadGerencia(this.formEmployee.get('nid_company').value);
    this.disabledGerencia=false;
  }
  changeCargo(itemselected):void{
    
    let selectedBook = itemselected.value;
    this.getListBoss(selectedBook);
    
  }

  save(): void {
    
    // if (this.formPerson.invalid) {
    //   return Object.values(this.formPerson.controls).forEach((controls) => {
    //     controls.markAllAsTouched();
    //   });
    // }

    if (this.formEmployee.invalid) {
      return Object.values(this.formEmployee.controls).forEach((controls) => {
        controls.markAllAsTouched();
      });
    }
    
    if (this.formEmployeeFile.invalid) {
      
      return Object.values(this.formEmployeeFile.controls).forEach((controls) => {
        controls.markAllAsTouched();
      });
    }

    
    const payload: IUpdateEmploye = {
      sddriverlicense:this.formPerson.get('sddriverlicense').value,
      nid_person: this.formPerson.get('nid_person').value,
      scodperson: this.formPerson.get('scodperson').value,
      sfirstname: this.formPerson.get('sfirstname').value,
      ssecondname: this.formPerson.get('ssecondname').value,
      slastname: this.formPerson.get('slastname').value,
      smotherlastname: this.formPerson.get('smotherlastname').value,
      semail: this.formPerson.get('semail').value,
      nid_sex:  this.formPerson.get('nid_sex').value,
      sbloodtype: this.formPerson.get('sbloodtype').value,
      sidentification: this.formPerson.get('sidentification').value,
      spassport: this.formPerson.get('spassport').value,
      dbirthdate: this.formPerson.get('dbirthdate').value,
      nid_nationality: this.formPerson.get('nid_nationality').value,
      nid_civilstatus: this.formPerson.get('nid_civilstatus').value,
      bitisnotdomiciled: this.formPerson.get('bitisnotdomiciled').value,
      sdrivinglicense: this.formPerson.get('sdrivinglicense').value,
      duniversitygraduationdate: this.formPerson.get('duniversitygraduationdate').value,
      dcountryentrydate: this.formPerson.get('dcountryentrydate').value,
      smedicalstaff: this.formPerson.get('smedicalstaff').value,
      nid_active: this.formPerson.get('nid_active').value,
      simg: this.formPerson.get('simg').value,

      email: this.formPerson.get('semail').value,
      semergency_contact_name: this.formPerson.get('semergency_contact_name').value,
      semergency_contact_phone: this.formPerson.get('semergency_contact_phone').value,


      nid_employee:  this.formEmployee.get('nid_employee').value,
      scodemployee: this.formEmployee.get('scodemployee').value,
      nid_position: this.formEmployee.get('nid_position').value,
      nid_company: this.formEmployee.get('nid_company').value,
      plaza: this.formEmployee.get('plaza').value,
      nid_costcenter: this.formEmployee.get('nid_costcenter').value,
      ddateoffirstadmission: this.formEmployee.get('ddateoffirstadmission').value,
      dadmissiondate: this.formEmployee.get('dadmissiondate').value,
      ddeparturedate: this.formEmployee.get('ddeparturedate').value,
      nid_payroll: this.formEmployee.get('nid_payroll').value,
      bdependents: this.formEmployee.get('bdependents').value,
      snit: this.formEmployee.get('snit').value,
      dcompanyseniority: this.formEmployee.get('dcompanyseniority').value,
      dgovernmentseniority: this.formEmployee.get('dgovernmentseniority').value,
      nid_state: this.formEmployee.get('nid_state').value,
      sinsurednumbers: this.formEmployee.get('sinsurednumbers').value,
      stypeinsurance: this.formEmployee.get('stypeinsurance').value,
      shealthpermit: this.formEmployee.get('shealthpermit').value,

      smerit: null,
      sdemerit: null,
      scorporatemail: this.formEmployee.get('scorporatemail').value,
      sannexed: this.formEmployee.get('sannexed').value,

      sheavymachinerylicense: this.formEmployee.get('sheavymachinerylicense').value,
      snamewife_partner: this.formEmployee.get('snamewife_partner').value,
      slastname_partner: this.formEmployee.get('slastname_partner').value,
      smotherlastname_partner: this.formEmployee.get('smotherlastname_partner').value,
      ddateofmarriage: this.formEmployee.get('ddateofmarriage').value,
      scovidcard: this.formEmployee.get('scovidcard').value,
      


      nid_employee_file: this.formEmployeeFile.get('nid_employee_file').value,
      nvacationdays: this.formEmployeeFile.get('nvacationdays').value,
      npendingvacations: this.formEmployeeFile.get('npendingvacations').value,
      bsalarycurrency: this.formEmployeeFile.get('bsalarycurrency').value,
      bctscurrency: this.formEmployeeFile.get('bctscurrency').value,
      bitsray: this.formEmployeeFile.get('bitsray').value,
      nid_safeplan: this.formEmployeeFile.get('nid_safeplan').value,
      bdoesnotapplyqta: this.formEmployeeFile.get('bdoesnotapplyqta').value,
      bmixedafp: this.formEmployeeFile.get('bmixedafp').value,
      
      nid_sctrpensionentity: Number(this.formEmployeeFile.get('nid_sctrpensionentity').value) === 0  ? null : Number(this.formEmployeeFile.get('nid_sctrpensionentity').value) ,
      nid_afp: Number(this.formEmployeeFile.get('nid_afp').value) === 0 ? null : Number(this.formEmployeeFile.get('nid_afp').value),
      id_epsplan: Number(this.formEmployeeFile.get('id_epsplan').value) === 0 ? null : Number(this.formEmployeeFile.get('id_epsplan').value),
      slifelaw: this.formEmployeeFile.get('slifelaw').value,
      nFesaludPlan: this.formEmployeeFile.get('nFesaludPlan').value,
      nInternPlan: this.formEmployeeFile.get('nInternPlan').value,
      scodsede: this.formEmployee.get('scodsede').value,
      sname_boss_real:  this.formEmployee.get('sname_boss_real').value,
      bemployee_file_exist: this.bExistEmployeeFile,
      nid_boss_real: this.idBoss,
      idGerencia:  Number(this.formEmployee.get('idGerencia').value),
      idArea: Number(this.formEmployee.get('idArea').value),
      idSubArea: Number(this.formEmployee.get('idSubArea').value),

    }

    this._serviceEmployee.updateEmploye(this.IdPerson, payload).subscribe(resp => {
      this.snack.open(resp.data, "OK", {
        duration: 4000,
      });
      this.getDetailtEmployee();
    })
    
  }

  //nuevo diseño
  selectedSection(id: Number): void {
    this.idSection = id;
  }
  getListBoss(idposition:number): void {
    
    this._serviceEmployee.getListBoss(idposition).subscribe(resp => {
      
      if (resp.stateCode== 200){
        this.bosslist =resp.data;
      }
      
    })
  }
  getGerencia(idCompany){
   
    const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    let idUser = storage.id;

    const payload = {
      IdCompany:idCompany,
      IdUser:idUser

    }
    this.areaService.getGerenciasByCompany(payload).subscribe((res) => {
      this.gerencias = res.data;
      
    });

    // this.areaService.getGerenciasByUser(payload).subscribe((res) => {
    //   this.gerencias = res.data;
    // });

  }
  
  loadGerencia(idCompany) {

    const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    let idUser = storage.id;

    const payload = {
      IdCompany:idCompany,
      IdUser:idUser

    }
    this.areaService.getGerenciasByCompany(payload).subscribe((res) => {
      this.gerencias = res.data;
    });

    // this.areaService.getGerenciasByUser(payload).subscribe((res) => {
    //   this.gerencias = res.data;
    //   this.getChargesByCompanyArea();
    // });


  }

  changeGerencia(): void {
    
    this.loadAreas();
    this.disabledArea = false;
    
    this.areaFC.setValue('');
    this.subAreaFC.setValue('');
    
    this.disabledSubArea = true;
  }

  loadAreas() {
    const payload = {
      IdArea:this.formEmployee.get('idGerencia').value

    }
    
    this.areaService.getSubAreasByArea(payload).subscribe((res) => {
      this.areas= res.data;
      this.getChargesByCompanyArea();
    });

  }

  changeArea(): void {
    this.loadSubAreas();
    this.disabledSubArea = false;
    this.formEmployee.get('idSubArea').setValue('0');
    this.getChargesByCompanyArea();
  }

  loadSubAreas() {
    const payload = {
      IdArea:Number(this.formEmployee.get('idArea').value)  

    }
    this.areaService.getSubAreasByArea(payload).subscribe((res) => {
      //IdArea:this.formEmployee.get('idArea').value 
      this.subAreas= res.data;
      this.getChargesByCompanyArea();
    });
  }



  
  message: string;
 resultConfirm: boolean;
  textoBoton: string;

  
  openDialogAssignBoss(): void {


    this.message="Asignar Jefe";
    this.resultConfirm=true;
    this.textoBoton="Aceptar";
    const dialogRef = this._dialog.open(ModalBossComponent, {
      width: '656px',
      height:'420px',
      data:{message: this.message, result: this.resultConfirm,idBossArea:0,textButton:this.textoBoton,nameBoss:''},
    });

    dialogRef.afterClosed().subscribe(resp => {
      if(resp.result){
        this.idBoss=resp.idBossArea;
        

        if (resp.nameBoss !==''){
          this.formEmployee.get('sname_boss_real').setValue(resp.nameBoss);
        }
      }
      

    });

  }

  getChargesByCompanyArea(){
    const payload = {
      nidcompany: Number(  this.formEmployee.get('nid_company').value ),
      nidgerencia: Number(this.formEmployee.get('idGerencia').value)  ,
      nidarea :  Number(this.formEmployee.get('idArea').value ) ,
      nidsubarea: Number( this.formEmployee.get('idSubArea').value)
      
      
    }

    this.cargoService.GetChargesByCompanyAreav2(payload).subscribe((res) => {
      this.position = res;
    });
  }
  changeSubArea(){
    this.getChargesByCompanyArea();    
  }



}
