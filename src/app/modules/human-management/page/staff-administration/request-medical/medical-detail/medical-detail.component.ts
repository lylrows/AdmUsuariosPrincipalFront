import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '@app/data/service/employee.service';
import { StaffRequestService } from '@app/data/service/staff-request.service';
import { UtilService } from '@app/data/service/util.service';
import * as _moment from "moment";
import { MatDialog } from '@angular/material/dialog';
import { ModalCommentComponent } from './../../modal-comment/modal-comment.component';

import { ConfirmDialogSolicitudComponent } from './confirm-dialog-solicitud/confirm-dialog-solicitud.component';



interface ListDocument {
  nid_mastertable: number,
  sdescription_value: string,
  file: any,
  filename: string,
  required: boolean,
  bbreak_requiredfile:boolean,
};

interface ListDocumentById {
  ndocument: number,
  nid_document_medical: number,
  nid_medical: number,
  nstate: number,
  ntype_doc: number,
  sdocument: string,
  sfile: any,
  nameFile: string,
  file: any,
  required: boolean,
  bbreak_requiredfile:boolean,
  scommentobserve:string
}
interface ListObservedDocument{
  nid_document_medical:number;
  scomment:string;

}

@Component({
  selector: 'app-medical-detail',
  templateUrl: './medical-detail.component.html',
  styleUrls: ['./medical-detail.component.scss']
})

export class MedicalDetailComponent implements OnInit {

  selectedTerms: boolean = false;

  title: string = '';
  sfullname: string = '';
  form: FormGroup;
  listorigin: any[] = [];
  listtype: any[] = [];
  id: number;
  isEdit: boolean = false;
  isDraft = false;
  listdocument: ListDocument[] = []

  listObservedDocument:ListObservedDocument[]=[];

  listdocumentbyId: ListDocumentById[] = [];
  listdocumentbyIdInitial: ListDocumentById[] = [];
  _objDocument: ListDocumentById;
  isUpdateFile: boolean = true;

  fileName: string = '';
  file: File = null;
  days: number = 0;
  isSendExactus: boolean = false;

  firstChange: boolean = false;
  isApproved: boolean = false;

  listfile: any[] = [];
  nid_postion: number = 0;
  nid_person: number = 0;
  nid_employee: number = 0;
  nid_profile: number = 0;

  nstatedocument: number = 0;
  ndaysdocument: number = null;
  scolordocument: string = '';

  nstateregisterviva: boolean = null;
  ndaysregisterviva: number = null;
  scolorregisterviva: string = '';

  nstateCIT: boolean = null;
  ndaysCIT: number = null;
  scolorCIT: string = '';

  nstateAmount: boolean = null;
  ndaysAmount: number = null;
  scolorAmount: string = '';

  nstate: number = 0;

  isEditFile: boolean = false;
  listDocumentValid: any[] = [];

  listfileedit: any[] = [];

  bregisterviva: any = null;
  operationnumber = new FormControl('', [Validators.required]);
  fileRegisterVIVA: any = null;
  fileRegisterVIVAname: string = '';


  codigonitt = new FormControl('', [Validators.required]);
  codigocitt = new FormControl('', [Validators.required]);
  dateCIT = new FormControl('', [Validators.required]);
  observacion = new FormControl('');
  fileRegisterCITT: any = null;
  fileRegisterCITTName: string = '';

  montoAmount = new FormControl('', [Validators.required]);
  montoUnreturnAmount = new FormControl('', [Validators.required]);
  sobservationamount = new FormControl('');

  ntype : number = 0;
  nidmaternidad : number = 0;
  sfileVIVAR: string = '';
  sfileCITT: string = '';
  typeactionexactuslist:[];
  absenceexactuslist:[];
  nid_originmedical:number=0;

  currentPeriod:Date;
  previousPeriod:Date;

  disabledtypeaction:boolean=false;
  disabledtypeabsence:boolean=false;

  validFilesComplete:boolean=true;
  initForm(): void {
    this.form = this._fs.group({
      ntype: ['', [Validators.required]],
      nid_collaborator: ['', [Validators.required]],
      dregisterdm: ['', [Validators.required]],
      dissuedm: ['', [Validators.required]],
      ddateinitdm: ['', [Validators.required]],
      ddateenddm: ['', [Validators.required]],
      smedicaldiagnostic: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      srucclinic: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(11), Validators.maxLength(11)]],
      tuitiondoctor: ['', [Validators.required, Validators.pattern('[A-Za-z0-9]*')]],
      noriginmedical: ['', [Validators.required]],
      ntypedm: ['', [Validators.required]],
      scommitment: ['', [Validators.required]], //, Validators.pattern('[a-zA-Z ]*')
      nid_person: [''],
      idCharge: [''],
      lastName: [''],
      motherLastName: [''],
      names: [''],
      charge: [''],
      area: [''],
      idArea: [''],
      dni: [''],
      dateAdmission: [''],
      company: [''],
      sfullname: [''],
      sruc: [''],
      ssede: [''],
      smanagement: [''],
      scodtypeaction: ['DO01', [Validators.required]],
      scodtypeabsence: ['20', [Validators.required]],
      bisDraft:[false]

    })
  }

  constructor(
    private _fs: FormBuilder,
    private snack: MatSnackBar,
    private _serviceEmployee: EmployeeService,
    private _router: Router,
    private staffRequestService: StaffRequestService,
    private _route: ActivatedRoute,
    private _utilService:UtilService,

     public dialog: MatDialog,

   public _dialog: MatDialog

  ) {
    this.initForm()
    const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    this.nid_postion = storage.nid_position;
    this.nid_person = storage.nid_person;
    this.nid_employee = storage.nid_employee;
    this.nid_profile=storage.nid_profile;
    if (this.nid_profile === 10 || this.nid_profile ===22){
      this.bCanSendToExactus = true;
    }

    this.init();

  }
  bCanSendToExactus=false;

  ngOnInit(): void {

  }

  init() {
    this.getexactusactiontype();
    this.getexactusabsencetype();

    this.form.get('dregisterdm').setValue(new Date())
    this.ListOrigin();
    this.id =  Number( this._route.snapshot.params.id);
    
    
    // Obtiene la Fecha de Aprobacion
    this.getApprovalDate();
    if (this.id != 0) {
      console.log("🚀 ~ CUMPLE ~ init ~ this.id:", this.id)
      
      this.getAprroved()
      this.isEdit = true;
      this.getDetail();
    } else {
      this.getemployee();
      this.getDays();
      this.isEdit = false;
    }
  }
  getApprovalDate():void{
      this.staffRequestService.getApprovalDate(this.nid_employee ).subscribe(resp => {
      // Seteamos los valor del Periodo Aprobado
      this.currentPeriod=resp.data.approvalcurrentperiod  ;
      this.previousPeriod=resp.data.approvalpreviousperiod;

    });

  }
  getDays(): void {
    this.staffRequestService.getDays(this.nid_employee).subscribe(resp => {
      this.days = resp.data.ndays;
      if (this.days > 20) {
        this.changeSubsidio();
      } else {
        this.changeMedical();
      }
    })
  }

  getAprroved(): void {
    this.staffRequestService.getlistapproved().subscribe(resp => {
      
      const list: any[] = resp.data;
      const findUser = list.find(e => e.nid_profile === this.nid_profile);

      if (findUser != undefined) {
        this.isApproved = true;
      }

    })
  }

  getemployee(): void {
    this.staffRequestService.getemployee().subscribe(resp => {

      this.form.get('nid_person').setValue(resp.data.idPerson)
      this.form.get('nid_collaborator').setValue(resp.data.idEmployee)
      this.form.get('idCharge').setValue(resp.data.idCharge)
      this.form.get('charge').setValue(resp.data.charge)
      this.form.get('lastName').setValue(resp.data.lastName)
      this.form.get('motherLastName').setValue(resp.data.motherLastName)
      this.form.get('names').setValue(resp.data.names)
      this.form.get('area').setValue(resp.data.area)
      this.form.get('idArea').setValue(resp.data.idArea)
      this.form.get('dni').setValue(resp.data.dni)
      this.form.get('dateAdmission').setValue(resp.data.dateAdmission)
      this.form.get('company').setValue(resp.data.company)
      this.sfullname = resp.data.names + ' ' + resp.data.lastName + ' ' + resp.data.motherLastName;
      this.form.get('sfullname').setValue(this.sfullname);
      this.form.get('sruc').setValue(resp.data.ruc);
      this.form.get('ssede').setValue(resp.data.sede);
      this.form.get('smanagement').setValue('');

      const person_id = Number(this.form.get('nid_person').value);
      this.staffRequestService.getBoss(person_id).subscribe(respa => {
        const boss = respa.data;
        let bossname = '';
        if ( boss != null ) {
          bossname = boss.sfullname;
        } else {
          bossname = 'No tiene jefe actualmente'
        }

        this.form.get('smanagement').setValue(bossname)
      })

    })
  }

  getDetail(): void {
    this.staffRequestService.getmedicalbyId(this.id).subscribe(resp => {
     // Obtener documento resp.data.ntypedm
     
     // Resp  EXACTUS
     this.isSendExactus= resp.data.bexistexatus;

     let idtypedescanso=resp.data.ntypedm;

      if (resp.data.ntype === 1006) {
        if(resp.data.ntypedm===3016){
          this.ListDocumentMedico();
        }else{
          this.ListDocumentSubsidio();
        }
      } else {
        this.ListDocumentMedico();
      }

      this.staffRequestService.getemployeeChildrenById(resp.data.nid_collaborator).subscribe(r => {
        if (r.data.idPerson === this.nid_person) {
          this.isEditFile = true;
        }

        this.form.get('nid_person').setValue(r.data.idPerson)
        this.form.get('nid_collaborator').setValue(resp.data.nid_collaborator)
        this.form.get('idCharge').setValue(r.data.idCharge)
        this.form.get('charge').setValue(r.data.charge)
        this.form.get('lastName').setValue(r.data.lastName)
        this.form.get('motherLastName').setValue(r.data.motherLastName)
        this.form.get('names').setValue(r.data.names)
        this.form.get('area').setValue(r.data.area)
        this.form.get('idArea').setValue(r.data.idArea)
        this.form.get('dni').setValue(r.data.dni)
        this.form.get('dateAdmission').setValue(r.data.dateAdmission)
        this.form.get('company').setValue(r.data.company)
        this.sfullname = r.data.names + ' ' + r.data.lastName + ' ' + r.data.motherLastName;
        this.form.get('sfullname').setValue(this.sfullname);
        this.form.get('sruc').setValue(r.data.ruc);
        this.form.get('ssede').setValue(r.data.sede);
        this.form.get('smanagement').setValue('');

      })


      this.form.get('dregisterdm').setValue(resp.data.dregisterdm)
      this.form.get('dissuedm').setValue(resp.data.dissuedm)
      this.form.get('ddateinitdm').setValue(resp.data.ddateinitdm)
      this.form.get('ddateenddm').setValue(resp.data.ddateenddm)
      this.form.get('smedicaldiagnostic').setValue(resp.data.smedicaldiagnostic)
      this.form.get('srucclinic').setValue(resp.data.srucclinic)
      this.form.get('tuitiondoctor').setValue(resp.data.tuitiondoctor)
      this.form.get('noriginmedical').setValue(resp.data.noriginmedical)
      this.form.get('ntypedm').setValue(resp.data.ntypedm)
      this.nid_originmedical=resp.data.noriginmedical;

      this.form.get('scodtypeabsence').setValue(resp.data.scodtypeabsence)
      this.form.get('scodtypeaction').setValue(resp.data.scodtypeaction)

      this.form.get('ntype').setValue(resp.data.ntype)
      this.form.get('scommitment').setValue(resp.data.scommitment)
      if(resp.data.scommitment=='1'){
        this.selectedTerms=true;
      }else{
        this.selectedTerms=false;
      }

      this.title = 'Mantenimiento de ' + resp.data.stype;
      this.nstatedocument = resp.data.nstatedocument;
      this.ndaysdocument = resp.data.ndaysdocument;
      this.scolordocument = resp.data.scolordocument;

      this.ntype = resp.data.ntype;

      this.nstateregisterviva = resp.data.bregisterviva;
      this.ndaysregisterviva = resp.data.ndaysregisterviva;
      this.scolorregisterviva = resp.data.scolorregisterviva;

      this.nstateCIT = resp.data.bhaveCIT;
      this.ndaysCIT = resp.data.ndaysCIT;
      this.scolorCIT = resp.data.scolorCIT;

      this.nstateAmount = resp.data.bhaveamount;
      this.ndaysAmount = resp.data.ndaysAmount;
      this.scolorAmount = resp.data.scolorAmount;

      this.bregisterviva = resp.data.bregisterviva;
      this.sfileVIVAR = resp.data.sfileregisterviva;
      this.operationnumber.setValue(resp.data.soperationnumber);

      this.montoAmount.setValue(resp.data.namount)
      this.montoUnreturnAmount.setValue(resp.data.nunreturnamount)
      this.sobservationamount.setValue(resp.data.sobservationamount)

      this.codigocitt.setValue(resp.data.snumberCIT);
      this.codigonitt.setValue(resp.data.snitt)
      this.observacion.setValue(resp.data.sobervationscitt)
      this.dateCIT.setValue(resp.data.ddateCIT)

      this.sfileCITT = resp.data.sfilecitt;

      this.nstate = resp.data.nstate;

      if (this.sfileVIVAR != null) {
        const payload = {
          FileName: '',
          FileUrl: this.sfileVIVAR,
          ContentType: '',
          File: ''
        }

        this._serviceEmployee.GetByFile(payload).subscribe(respu => {
          this.fileRegisterVIVAname = respu.data.fileName;
        })
      }

      if (this.sfileCITT != null) {
        const payload = {
          FileName: '',
          FileUrl: this.sfileCITT,
          ContentType: '',
          File: ''
        }

        this._serviceEmployee.GetByFile(payload).subscribe(respu => {
          this.fileRegisterCITTName = respu.data.fileName;
        })
      }

      this.staffRequestService.getlistdocument(this.id).subscribe(rep => {
        this.listdocumentbyIdInitial = rep.data;
        
        this.listdocumentbyIdInitial.map(e => {
          const payload = {
            FileName: '',
            FileUrl: e.sfile,
            ContentType: '',
            File: ''
          }

          this._serviceEmployee.GetByFile(payload).subscribe(respu => {
            
            e.nameFile = respu.data === null ?  "": respu.data.fileName;
          })
        });
         //this.listdocumentbyId = this.listdocumentbyIdInitial;
       this.getDocumentsRequired(idtypedescanso);
      })

      const person_id = Number(this.form.get('nid_person').value);
      this.staffRequestService.getBoss(person_id).subscribe(respa => {
        const boss = respa.data;
        let bossname = '';
        if ( boss != null ) {
          bossname = boss.sfullname;
        } else {
          bossname = 'No tiene jefe actualmente'
        }

        this.form.get('smanagement').setValue(bossname)
      })
    })
  }

  ListOrigin(): void {
    this._serviceEmployee.ListGeneric(1035).subscribe(resp => {
      this.listorigin = resp;
    })
  }
  ListDocumentMedico(): void {
    this._serviceEmployee.ListGeneric(991).subscribe(resp => {
      this.listtype = resp;
    })
  }

  ListDocumentSubsidio(): void {
    this._serviceEmployee.ListGeneric(992).subscribe(resp => {
      this.listtype = resp;
      
    })
  }

  validDateActual(): void {
    let valueStart = _moment();
    valueStart = _moment(valueStart).add(-1, 'M');
    valueStart.set({
      hour:0,
      minute:0,
      second:0,
      millisecond:0
    });
    const valueEnd = this.form.get('dissuedm').value;

    // const valueEndDate = new Date(valueEnd);
    const valueEndDate = _moment(valueEnd);

    const valid = valueEndDate >= valueStart;

    if (!valid) {
      this.snack.open("¡Es necesario que la fecha sea mayor o igual a la fecha de hace un mes!", "OK", { duration: 4000 });
      this.form.get('dissuedm').setValue(null)
    }
  }

  validDateStart(): void {
    let valueStart = _moment();
    valueStart = _moment(valueStart).add(-1, 'M');
    valueStart.set({
      hour:0,
      minute:0,
      second:0,
      millisecond:0
    });
    const valueEnd = this.form.get('ddateinitdm').value;
    const fechaEmision = this.form.get('dissuedm').value;
    if(fechaEmision == '' || fechaEmision == null){
      this.snack.open("¡Es necesario que ingrese la fecha de emision!", "OK", { duration: 4000 });
      this.form.get('ddateinitdm').setValue(null);
      return;
    }

    if(_moment(valueEnd).format("DD/MM/YYYY") != _moment(fechaEmision).format("DD/MM/YYYY")) {
      this.snack.open("¡Es necesario que la fecha de inicio y emisión sean las mismas!", "OK", { duration: 4000 });
      this.form.get('ddateinitdm').setValue(null);
      return;
    }


    const valueEndDate = _moment(valueEnd);

    const valid = valueEndDate >= valueStart;

    if (!valid) {
      this.snack.open("¡Es necesario que la fecha sea mayor o igual a la fecha de hace un mes!", "OK", { duration: 4000 });
      this.form.get('ddateinitdm').setValue(null);
    }
  }

  validDateEnd(): void {
    const valueStart = this.form.get('ddateinitdm').value;
    const valueEnd = this.form.get('ddateenddm').value;

    if (valueStart != null) {
      const valueStartDate = new Date(valueStart);
      const valueEndDate = new Date(valueEnd);
      const valid = valueEndDate >= valueStartDate;

      if (!valid) {
        this.snack.open("¡Es necesario que la fecha fin sea mayor a la fecha inicio!", "OK", { duration: 4000 });
        this.form.get('ddateenddm').setValue(null)
      } else {
        //Si el tipo es maternidad, no se valida las fechas
        if (Number(this.form.get('ntypedm').value)==3016) return;

        let valuestartmoment = _moment(valueStart);
        let valueEndmoment = _moment(valueEnd);
        const daysAsign = valueEndmoment.diff(valuestartmoment, 'days') + 1;
        let diasAcum=this.days;
        let totalDias=this.days+daysAsign;
        if(this.days<20){
          if (totalDias>20){
            let diasFaltantes=20-this.days;
            let diasExcedentes=daysAsign-(20-this.days);
            this.snack.open("ERROR: La cantidad de dias del rango de Fechas seleccionadas superan a 20 dias, favor de registrar [ "+diasFaltantes +" dias como Descanso Médico] y registrar ["+diasExcedentes+" dias como Subsidio]", "OK", { duration: 6000 });
            this.form.get('ddateenddm').setValue(null);
            return;
          }

        }
        
        // Para seleccionar por defecto Tipo de Exactus
          if(totalDias<=20){
            this.form.get('scodtypeabsence').setValue("20");
          }else{
            this.form.get('scodtypeabsence').setValue("21");
          }


        if (this.days <= 20) {
          const days = valueEndmoment.diff(valuestartmoment, 'days')+1;

          if ((this.days + days) > 20) {
            this.firstChange = true;
            this.changeSubsidio();
          } else {
            if (this.firstChange) {
              this.changeMedical();
            }
          }
        }

        // VALIDA 2 PERIODOS
        const fromDate=new Date(this.form.get('ddateinitdm').value);
        const toDate=new Date(this.form.get('ddateenddm').value);

        let dateIni = fromDate.toLocaleDateString('sv').replace('-', '').substring(0,6);
        let dateEnd = toDate.toLocaleDateString('sv').replace('-', '').substring(0,6);
        if(Number(dateEnd)>Number(dateIni)){
          this.snack.open("ERROR: No puede seleccionar Fecha de 2 Periodos (Meses).", "OK", { duration: 4000 });
          this.form.get('ddateenddm').setValue(null);
          return ;
        }

      }

    } else {
      this.snack.open("¡Es necesario primero seleccionar una fecha inicio!", "OK", { duration: 4000 });
      this.form.get('ddateend').setValue(null)
    }
  }

  changeSubsidio(): void {
    this.snack.open('Cuando los dias superan los 20 se pasa el estado de descanso medico a subsidio', "OK", {
      duration: 4000,
    });
    this.form.get('ntype').setValue(1006)
    // Comenta luego
    this.ListDocumentSubsidio();

    //this.getNameFilesSubsidios();
    this.title = 'Nuevo Registro de Subsidio';
  }

  changeMedical(): void {
    this.snack.open('La solicitud esta configurada para un descanso medico', "OK", {
      duration: 4000,
    });
    this.form.get('ntype').setValue(1005)
    // Comenta luego
    this.ListDocumentMedico();

     //this.getNameFilesMedical();
    this.title = 'Nuevo Registro de Descanso medico';
  }

  getNameFilesMedical(): void {
    this._serviceEmployee.ListGeneric(1007).subscribe(resp => {

      this.listdocument = resp;
      this.listdocument.map(e => {
        e.file = null,
        e.filename = null,
        e.required = true
      })
    })
  }

  changetipodm(event): void {
    const value = event.value;
    const type = this.form.get('ntype').value;
    
    this.getDocumentsRequired(value);
    switch (value) {
      case 997:// SI ES ACCIDENTE COMUN - DM
        this.form.get('scodtypeaction').setValue("DO01");
        this.validDateEnd();
        this.disabledtypeaction=true;
        this.disabledtypeabsence=true;
        break;

      case 998:// SI ES ACCIDENTE DE TRABAJO
        this.form.get('scodtypeaction').setValue("DO02");
        this.validDateEnd();
        this.disabledtypeaction=true;
        this.disabledtypeabsence=true;
        break;

      case 996:// SI ES ENFERMEDAD - DM
        this.form.get('scodtypeaction').setValue("DO03");
        this.validDateEnd();
        this.disabledtypeaction=true;
        this.disabledtypeabsence=true;
        break;

      case 3016:// SI ES MATERNIDAD - DM
        this.form.get('scodtypeaction').setValue("S002");
        this.form.get('scodtypeabsence').setValue("22");
        this.disabledtypeaction=true;
        this.disabledtypeabsence=true;
        break;
      case 999:// SI ES ENFERMEDAD - SUBSIDIO
        this.form.get('scodtypeaction').setValue("S004");
        this.validDateEnd();
        this.disabledtypeaction=true;
        this.disabledtypeabsence=true;
        break;
      case 1000:// SI ES ACCIDENTE COMÙN - SUBSIDIO
        this.form.get('scodtypeaction').setValue("S001");
        // this.form.get('scodtypeabsence').setValue("20");
        this.validDateEnd();
        this.disabledtypeaction=true;
        this.disabledtypeabsence=true;
        break;
      
      case 1001:// SI ES ACCIDENTE COMÙN (POR ACCIDENTE TRANSITO) - SUBSIDIO
        this.form.get('scodtypeaction').setValue("S003");
        this.validDateEnd();
        this.disabledtypeaction=true;
        this.disabledtypeabsence=true;
        break;      
      case 1002:// SI ES ACCIDENTE DE TRABAJO CON SCTR - SUBSIDIO
        this.form.get('scodtypeaction').setValue("S003");
        this.validDateEnd();
        this.disabledtypeaction=true;
        this.disabledtypeabsence=true;
        break;
      case 1003:// SI ES MATERNIDAD - SUBSIDIO
        this.form.get('scodtypeaction').setValue("S002");
        this.form.get('scodtypeabsence').setValue("22");
        this.disabledtypeaction=true;
        this.disabledtypeabsence=true;
        break;
      default:
        this.validDateEnd();
        this.disabledtypeaction=false;
        this.disabledtypeabsence=false;
        break;
    }


  }

  getDocumentsRequired(id:number):void{
    const value = id;
    let newarray: any[] = [];
    switch (value) {
      case 996:

        this._serviceEmployee.ListGeneric(1007).subscribe(resp => {
          newarray = resp;
          
          newarray.map(e => {
              e.file = null,
              e.filename = null,
              e.required = true
          })

          const arrayindex = [1017, 1018]

          arrayindex.map(v => {
            const index = newarray.findIndex(e => e.nid_mastertable === v)
            newarray.splice(index, 1);
          })
          this.listdocument = newarray;
          this.consolidarListas();
        })

        break;
      case 997:

        this._serviceEmployee.ListGeneric(1007).subscribe(resp => {
          newarray = resp;
          
          newarray.map(e => {
            e.file = null,
            e.filename = null,
            e.required = true
          })

          const arrayindex = [1017, 1018]

          arrayindex.map(v => {
            const index = newarray.findIndex(e => e.nid_mastertable === v)
            newarray.splice(index, 1);
          })
          this.listdocument = newarray;
          this.consolidarListas();
        })

        break;
      case 998:

        this._serviceEmployee.ListGeneric(1007).subscribe(resp => {
          newarray = resp;
          
          newarray.map(e => {
            e.file = null,
            e.filename = null,
            e.required = true
          })
          //1011
          const arrayindex = [1011]

          arrayindex.map(v => {
            const index = newarray.findIndex(e => e.nid_mastertable === v)
            newarray.splice(index, 1);
          })
          this.listdocument = newarray;
          this.consolidarListas();
        })

        break;
      case 999:
        this._serviceEmployee.ListGeneric(1019).subscribe(resp => {
          newarray = resp;
          
          newarray.map(e => {
            e.file = null,
            e.filename = null,
            e.required = true
          })
          const arrayindex = [1028, 1029, 1030, 1031, 1032]

          arrayindex.map(v => {
            const index = newarray.findIndex(e => e.nid_mastertable === v)
            newarray.splice(index, 1);
          })

          this.listdocument = newarray;
          this.consolidarListas();
        })

        break;
      case 1000:

        this._serviceEmployee.ListGeneric(1019).subscribe(resp => {
          newarray = resp;
          
          newarray.map(e => {
            e.file = null,
            e.filename = null,
            e.required = true
          })
          const arrayindex = [1028, 1029, 1030, 1031, 1032]

          arrayindex.map(v => {
            const index = newarray.findIndex(e => e.nid_mastertable === v)
            newarray.splice(index, 1);
          })

          this.listdocument = newarray;
          this.consolidarListas();
        })
        break;
      case 1001:

        this._serviceEmployee.ListGeneric(1019).subscribe(resp => {
          newarray = resp;
          
          newarray.map(e => {
            e.file = null,
            e.filename = null,
            e.required = true
          })

          const arrayindex = [1028, 1029, 1030, 1031, 1032]

          arrayindex.map(v => {
            const index = newarray.findIndex(e => e.nid_mastertable === v)
            newarray.splice(index, 1);
          })

          this.listdocument = newarray;
          this.consolidarListas();
        })
        break;
      case 1002:

        this._serviceEmployee.ListGeneric(1019).subscribe(resp => {
          newarray = resp;
          
          newarray.map(e => {
            e.file = null,
            e.filename = null,
            e.required = true
          })

          const arrayindex = [1021, 1030, 1031, 1032, 1033]

          arrayindex.map(v => {
            const index = newarray.findIndex(e => e.nid_mastertable === v)
            newarray.splice(index, 1);
          })

          this.listdocument = newarray;
          this.consolidarListas();
        })
        break;
      case 1003:

        this._serviceEmployee.ListGeneric(1019).subscribe(resp => {
          newarray = resp;
          
          newarray.map(e => {
            e.file = null,
            e.filename = null,
            e.required = true
          })

          const arrayindex = [1022, 1023, 1024, 1025, 1026, 1028, 1029, 1032, 1033]

          arrayindex.map(v => {
            const index = newarray.findIndex(e => e.nid_mastertable === v)
            newarray.splice(index, 1);
          })

          this.listdocument = newarray;
          this.consolidarListas();  
          
        })
        break;
        case 3016:

          this._serviceEmployee.ListGeneric(1019).subscribe(resp => {
            newarray = resp;
            newarray.map(e => {
              e.file = null,
              e.filename = null,
              e.required = true
            })

            const arrayindex = [1022, 1023, 1024, 1025, 1026, 1028, 1029, 1032, 1033]
            
            arrayindex.map(v => {
              const index = newarray.findIndex(e => e.nid_mastertable === v)
              newarray.splice(index, 1);
            })
            this.listdocument = newarray;
            this.consolidarListas();
            
            
          })
          break;
      default:
        break;
    }


  }

  consolidarListas() {
    //match con existentes
    this.listdocument.forEach(res => {
      const index = this.listdocumentbyIdInitial.findIndex(x => x.ndocument == res.nid_mastertable);
      if(index == -1) {
        this.listdocumentbyIdInitial.push({
          ndocument: res.nid_mastertable,
          nid_document_medical: 0,
          nid_medical: 0,
          nstate: 0,
          ntype_doc: 0,
          sdocument: res.sdescription_value,
          sfile: '',
          nameFile: 'Ningun Archivo Cargado',
          file: null,
          required: true,
          bbreak_requiredfile:res.bbreak_requiredfile,
          scommentobserve:''
        });
      }
    });
    this.listdocumentbyId = this.listdocumentbyIdInitial;

  }

  getNameFilesSubsidios(): void {
    this._serviceEmployee.ListGeneric(1019).subscribe(resp => {
      this.listdocument = resp;
      this.listdocument.map(e => {
        e.file = null,
          e.filename = null,
          e.required = true
      })
    })
  }

  onFileSelected(event: any, id: number, type: number) {
    const pddf = event.target.files[0] as File;
    if (['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'].includes(pddf.type)) {
    // if (['application/pdf'].includes(pddf.type)) {

      if(pddf.size>5242880){
        this.snack.open('El tamaño maximo permitido es 5MB', "OK", {
          duration: 4000,
        });
      }else{
        if (type == 1) {
          const index = this.listdocument.findIndex(e => e.nid_mastertable === id)
          let detail = this.listdocument.find(e => e.nid_mastertable === id);
          detail.file = pddf;
          detail.filename = pddf.name;
          this.listdocument.splice(index,1,detail);
         
        } else if (type == 2) {
          const index = this.listdocumentbyId.findIndex(e => e.ndocument === id);
          let detalle = this.listdocumentbyId.find(e => e.ndocument === id);
          detalle.file = pddf;
          detalle.nameFile = pddf.name;
          detalle.nstate = 0;
          this.listdocumentbyId.splice(index,1,detalle);
          this.listfileedit.push(detalle);
          

          const index2 = this.listdocument.findIndex(e => e.nid_mastertable === id)
          let detail2 = this.listdocument.find(e => e.nid_mastertable === id);
          detail2.file = pddf;
          detail2.filename = pddf.name;
          this.listdocument.splice(index,1,detail2);
        }
        
      }
    } else {
      this.snack.open('Solo es permitido imágenes o archivos pdf', "OK", {
        duration: 4000,
      });

    }
  }

  onFileSelectedVIVA(event: any) {

    const pddf = event.target.files[0] as File;
    // if (['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'].includes(pddf.type)) {
    if ([ 'application/pdf'].includes(pddf.type)) {
      if(pddf.size>5242880){
        this.snack.open('El tamaño maximo permitido es 5MB', "OK", {
          duration: 4000,
        });
      }else{
        this.fileRegisterVIVA = pddf;
        this.fileRegisterVIVAname = pddf.name;
      }


    } else {
      this.snack.open('Solo es permitido archivos pdf', "OK", {
        duration: 4000,
      });

    }
  }

  onFileSelectedCITT(event: any) {

    const pddf = event.target.files[0] as File;
    // if (['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'].includes(pddf.type)) {
    if (['application/pdf'].includes(pddf.type)) {
      if(pddf.size>5242880){
        this.snack.open('El tamaño maximo permitido es 5MB', "OK", {
          duration: 4000,
        });
      }else{
        this.fileRegisterCITT = pddf;
        this.fileRegisterCITTName = pddf.name;

      }

    } else {
      this.snack.open('Solo es permitido archivos pdf', "OK", {
        duration: 4000,
      });

    }
  }

  onFileSelectedEdit(event: any, id: number) {



    const pddf = event.target.files[0] as File;
    if (['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'].includes(pddf.type)) {
    //if (['application/pdf'].includes(pddf.type)) {
      if(pddf.size>5242880){
        this.snack.open('El tamaño maximo permitido es 5MB', "OK", {
          duration: 4000,
        });
      }else{
        const index = this.listdocumentbyId.findIndex(e => e.nid_document_medical === id);

        this.listdocumentbyId[index].nstate = 2;

        this.listfileedit.push({
          id: id,
          file: pddf,
          filename: pddf.name
        });
      }


    } else {
      this.snack.open('Solo es permitido imágenes o archivos pdf', "OK", {
        duration: 4000,
      });

    }
  }

  ViewAdjunto(url: string): void {
    const urlFile = url
    if (urlFile != null) {

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
      this.snack.open('No tiene archivo adjunto', "OK", {
        duration: 4000,
      });
    }


  }

  ViewAdjuntoCITT(): void {
    const urlFile = this.sfileCITT;

    if (urlFile != null) {

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
      this.snack.open('No tiene archivo adjunto', "OK", {
        duration: 4000,
      });
    }


  }

  ViewAdjuntoviva(): void {
    const urlFile = this.sfileVIVAR;

    if (urlFile != null) {

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
      this.snack.open('No tiene archivo adjunto', "OK", {
        duration: 4000,
      });
    }


  }

  public base64ToBlob(b64Data, contentType = '', sliceSize = 512) {
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
    return new Blob(byteArrays, { type: contentType });
  }


  save(): void {
    if (this.form.invalid) {
      this.snack.open('Es necesario completar todos los campos obligatorios ', "OK", {
        duration: 4000,
      });
      return Object.values(this.form.controls).forEach((controls) => {
        controls.markAllAsTouched();
      });
    }
    
    let nMissingFiles =0;
    if (this.isEdit){
      this.listdocumentbyId.forEach(element => {
        if (element.bbreak_requiredfile && element.file === null){
          nMissingFiles++;
        }
      });
    }else{
      this.listdocument.forEach(element => {
        if (element.bbreak_requiredfile && element.file === null){
          nMissingFiles++;
        }
      });
    }

    if (nMissingFiles>0 && !this.isDraft){
        this.snack.open('Para enviar debe cargar todos los documentos obligatorios', "Advertencia", {
          duration: 4000,
        });
        return;
    }

    // if (this.isEdit) {



    // } else {

      if(Number(this.form.get('ntypedm').value)==3016){
        this.form.get('ntype').setValue(1006)
      }

      // return;
      this.staffRequestService.registerMedical(this.form.value).subscribe(resp => {
        if(resp.stateCode == 200){
          this.listdocument.map(e => {
            if(e.file != null && typeof e.file != 'undefined'){
              const formData = new FormData();
              formData.append('files', e.file);

              const payload = {
                nid_medical: resp.data,
                ntype_doc: Number(this.form.get('ntypedm').value),
                ndocument: e.nid_mastertable
              }

              formData.append('request', JSON.stringify(payload));

              this.staffRequestService.registerDocument(formData).subscribe(resp => {
              }, err => {
                console.log(err);
              })
            }
          })
          this.cancel();
          this.snack.open('Se registró correctamente la solicitud', "OK", {
            duration: 4000,
          });
        } else {

          if(resp.stateCode == 500){
            this.snack.open(resp.messageError[0], "OK", {
              duration: 4000,
            });
          }else{
            this.snack.open(resp.data, "OK", {
              duration: 4000,
            });
          }
          
        }

      })
    //}
  }

  approvedDocument(id: number, name: string): void {

    const index = this.listdocumentbyId.findIndex(e => e.nid_document_medical === id);

    this.listdocumentbyId[index].nstate = 2;

    this.snack.open('Acepto Correctamente ' + name, "OK", {
      duration: 4000,
    });

    // && e.nid_mastertable === 1020
    const searchDocument = this.listdocumentbyId.find(e => e.nid_document_medical === id );

    let list: any[] = [];
    list.push({
          nid: searchDocument.nid_document_medical,
          nstate: searchDocument.nstate
    })

    this.medicalDocumentApproved(id);

  }

  rejectedDocument(id: number, name: string): void {
   

    
    this.titleMessage="¿Estás seguro que deseas continuar?";
    
      this.bodyMessage="Se está agregando a la lista de observados.";
    

    
    this.resultConfirm=true;
    this.textoBoton="Aceptar";
    
    const dialogRef = this.dialog.open(ConfirmDialogSolicitudComponent, {
      width: '656px',
      height:'300px',
      data:{titlemessage: this.titleMessage,bodymessage: this.bodyMessage, result:this.resultConfirm,
        textButton:this.textoBoton,
        brequirecomment:true
      }
    });

    dialogRef.afterClosed().subscribe(resp => {
      if(resp.result){
        const index = this.listdocumentbyId.findIndex(e => e.nid_document_medical === id);
        this.listdocumentbyId[index].nstate = 3;
        this.listdocumentbyId[index].scommentobserve = resp.textComment;

        this.listObservedDocument.push({
          nid_document_medical: id, 
          scomment: resp.textComment 
        });


      }

    });



    
    /*
    const index = this.listdocumentbyId.findIndex(e => e.nid_document_medical === id);
    this.staffRequestService.requestdocumentobserver(id).subscribe(rep => {
      let resultado  = rep.data;

      if (rep.stateCode===200){
        this.listdocumentbyId[index].nstate = 3;
        this.snack.open('Observo el documento ' + name, "OK", {
          duration: 4000,
        });

      }else{
        this.snack.open('No se pudo observar el documento ' + name, "Error", {
          duration: 4000,
        });
      }
    });
    */


  }


  existdocumentobserved(){

    let bReturn= false;

    this.listdocumentbyId.forEach(element => {

      if (element.nstate===3){

          bReturn= true;
      }  

    });

    return bReturn;

  }

  SendDumentExactus(id: number, name: string): void {

    let valid: boolean = true;
    this.listdocumentbyId.map(e => {
      if (e.nstate === 1 && ( e.ndocument===1008 || e.ndocument===1020)) {//&& e.ndocument===1020
        valid = false;
        this.snack.open('ERROR: Primero debe aprobar el documento ' + name, "OK", {
          duration: 4000,
        });
        return;
      }
    })

    if (valid) {

      const searchDocument = this.listdocumentbyId.find(e => e.nid_document_medical === id );


      let list: any[] = [];

      list.push({
          nid: searchDocument.nid_document_medical,
          nstate: searchDocument.nstate
      })

      const payload = {
        nid_medical: Number(this.id),
        sfullname: this.sfullname,
        idArea: this.form.get('idArea').value,
        receptorId: this.form.get('nid_person').value,
        emisorId: this.nid_person,
        ntype: this.ntype,
        list: list
      };


      this.staffRequestService.sendMedicalCertificateExactus(payload).subscribe(resp => {
        if (resp.stateCode == 200) {
          // this.snack.open('Se envió correctamente a Exactus.', "OK", {
          //   duration: 4000,
          // });
          switch (resp.data) {
            case 1:
              this.isSendExactus=true;
              this.snack.open('Se envió correctamente a Exactus.', "OK", {
                duration: 4000,
              });
              break;
            case 2:
              this.isSendExactus=true;
              this.snack.open('No se puede enviar la solicitud a Exactus, ya se envío previamente.', "OK", {
                duration: 4000,
              });
              break;
            default:
              break;
          }
          
        } else {
          this.snack.open(resp.messageError[0], "Advertencia", { duration: 4000 });
          
         }


      })

    } else {
      this.snack.open('ERROR: Es necesario que el documento Certificado Médico este APROBADO.', "OK", {
        duration: 4000,
      });
    }

  }

  validDocument(): void {


    let bExistDocumentObserved = this.existdocumentobserved();
    

    if (bExistDocumentObserved === true){

      this.snack.open('ERROR: No puede aprobar la solicitud si hay documentos observados.', "OK", {
        duration: 4000,
      });
      return ;

    }
    
  

    this.validFilesComplete=true;
    this.listdocumentbyId.forEach(res => {
      // res.ntype_doc==0
       if(res.bbreak_requiredfile === true && res.file === null ) {
          this.validFilesComplete=false;
          this.snack.open('ERROR: Falta Subir y/o Actualizar archivo: '+res.sdocument, "OK", {
            duration: 4000,
          });
          return;
       }
    });
    
    if(!this.validFilesComplete){
      this.snack.open('ERROR: Es necesario que adjuntar los documentos obligatorios.', "OK", {
        duration: 4000,
      });
      return;
    } 
    
    // // Verifica si los documentos requeridos estan cargados
    // const validFilesComplete = this.listdocumentbyId.find(e => e.bbreak_requiredfile = true && e.file === null);

    // if (validFilesComplete != undefined) {
    //   this.snack.open('Falta adjuntar adjuntar ' + validFilesComplete.sdocument, "OK", {
    //     duration: 4000,
    //   });
    //   return;
    // }
    let valid: boolean = true;
    this.listdocumentbyId.map(e => {
      // if (e.nstate === 1) {
        // e.bbreak_requiredfile === true && 
      if (e.nstate === 1) {
        valid = false;
        return;
      }
    })

    if (valid) {

      let list: any[] = [];

      this.listdocumentbyId.map(e => {
        list.push({
          nid: e.nid_document_medical,
          nstate: e.nstate
        })
      })

      const payload = {
        nid_medical: Number(this.id),
        sfullname: this.sfullname,
        idArea: this.form.get('idArea').value,
        receptorId: this.form.get('nid_person').value,
        emisorId: this.nid_person,
        ntype: this.ntype,
        nid_originmdical:this.nid_originmedical,
        list: list
      };


      this.staffRequestService.validDocument(payload).subscribe(resp => {

        if (resp.stateCode == 200) {
          this.snack.open('Se realizo la validacion correctamente de los ', "OK", {
            duration: 4000,
          });

          this.cancel();
         } else {
          this.snack.open(resp.messageError[0], "Advertencia", { duration: 4000 });
         }


      })

    } else {
      this.snack.open('Es necesario que aprueba o observe todos los documentos', "OK", {
        duration: 4000,
      });
    }

  }

  cancel(): void {
    this._router.navigate(['humanmanagement/request-medical'], {
      skipLocationChange: true
    })
  }


  editFiles(): void {

    
    

    let valid: boolean = true;
    this.listdocumentbyId.map(e => {
      if (e.nstate === 3) {
        valid = false;
        return;
      }
    })

    if (valid) {

      this.listfileedit.map(e => {
        const formData = new FormData();
        formData.append('files', e.file);

        
        

        const payload = {
          nid: e.nid_document_medical
        }

        formData.append('request', JSON.stringify(payload));

        this.staffRequestService.updateDocument(formData).subscribe(resp => {

        })

      })

      this.snack.open('Archivos actualizado correctamente', "OK", {
        duration: 4000,
      });
      this.cancel();

    } else {
      this.snack.open('Es necesario que verifique y corriga los archivos incorrectos', "OK", {
        duration: 4000,
      });
    }


  }

  changeviva(event: MatSlideToggleChange): void {
    this.bregisterviva = event.checked;
  }

  updateCITT(): void {
    if (this.codigonitt.valid && this.codigocitt.valid) {

      const payload = {
        nid_medical: Number(this.id),
        snumberCITT: this.codigocitt.value,
        // MOD:23/08/2022 sniit yano se usa en paso 3
        snitt: this.codigonitt.value,
        sobervationscitt: this.observacion.value,
        ddateCIT: this.dateCIT.value
        
      }

      if (this.fileRegisterCITT != null) {

        const formData = new FormData();
        formData.append('files', this.fileRegisterCITT);

        formData.append('request', JSON.stringify(payload));

        this.staffRequestService.updateCITTFile(formData).subscribe(resp => {
          this.cancel();
          this.snack.open('Se actualizado correctamente la solicitud', "OK", {
            duration: 4000,
          });
        })

      } else {
        this.staffRequestService.updateCITT(payload).subscribe(resp => {
          this.cancel();
          this.snack.open('Se actualizado correctamente la solicitud', "OK", {
            duration: 4000,
          });
        })
      }

    } else {
      this.codigocitt.markAllAsTouched();
      this.codigonitt.markAllAsTouched();
      this.snack.open('Es necesario que la solicitud tengo los datos obligatorios para poder continuar con el proceso', "OK", {
        duration: 4000,
      });

    }
  }

  updateVIVA(): void {

    

    if (this.bregisterviva && this.operationnumber.valid) {

      const payload = {
        nid_medical: Number(this.id),
        soperationnumber: this.operationnumber.value,
        // Se agregò 23/08/2022 NITT
        snitt: this.codigonitt.value
      }

      if (this.fileRegisterVIVA != null) {

        const formData = new FormData();
        formData.append('files', this.fileRegisterVIVA);
        formData.append('request', JSON.stringify(payload));

        this.staffRequestService.updateVIVAFile(formData).subscribe(resp => {
          this.cancel();
          this.snack.open('Se actualizado correctamente la solicitud', "OK", {
            duration: 4000,
          });
        })

      } else {
        this.staffRequestService.updateVIVA(payload).subscribe(resp => {
          this.cancel();
          this.snack.open('Se actualizado correctamente la solicitud', "OK", {
            duration: 4000,
          });
        })
      }

    } else {

      this.snack.open('Es necesario que la solicitud este registrado en la plataforma viva para poder continuar con el proceso', "OK", {
        duration: 4000,
      });

    }

  }

  updateAmount(): void {

    if ( this.montoAmount.valid ) {

      const payload = {
        nid_medical: Number(this.id),
        namount: this.montoAmount.value,
        nunreturnamount: this.montoUnreturnAmount.value,
        sobservationamount: this.sobservationamount.value
      }

      this.staffRequestService.updateAmount(payload).subscribe(resp => {
        this.cancel();
        this.snack.open('Accion completada correctamente', "OK", {
          duration: 4000,
        });
      })

    } else {
      this.montoAmount.markAllAsTouched();
      this.snack.open('Es necesario que ingrese el monto para terminar con el proceso', "OK", {
        duration: 4000,
      });
    }

  }

  reject(): void {
    const payload = {
      form: 'MedicalDetailComponent',
      nid_medical: Number(this.id),
      sfullname: this.sfullname,
      idArea: this.form.get('idArea').value,
      receptorId: this.form.get('nid_person').value,
      emisorId: this.nid_person,
      lectura: false,
      scomment: ''
    }

    const config = new MatDialogConfig();
    config.disableClose = true,
    config.width = '700px'
    config.data = { request: payload }

    const modal = this._dialog.open(ModalCommentComponent, config);

    modal.afterClosed().subscribe(resp => {
      this.cancel();
    })
  }

  getexactusabsencetype(): void {
    this._utilService.getexactusabsencetype().subscribe((resp) => {
      this.absenceexactuslist = resp.data;
    });
  }
  getexactusactiontype(): void {
    this._utilService.getexactusactiontype().subscribe((resp) => {
      this.typeactionexactuslist = resp.data;
    });
  }

  OnChange($event){
    this.selectedTerms = !this.selectedTerms;
    if (this.isEdit==false){
      if(this.selectedTerms){
        this.form.get('scommitment').setValue("1")

      }else{
        this.form.get('scommitment').setValue("")
      }
    }

   }

  titleMessage: string;
  bodyMessage: string;
  resultConfirm: boolean;
  textoBoton: string;

  openDialogGuardar(bIsDraft=false): void {
    this.isDraft = true;
    
    this.form.get('bisDraft').setValue(bIsDraft)

    
    
    // Verifica si esta Aprobado
    if(this.currentPeriod!=null){
      //- Fecha Aprobacion ['+this.currentPeriod+"]"
      this.snack.open('ERROR: No se puede registrar una nueva solicitud, la planilla para este periodo ya se encuentra APROBADO.' , "OK", {
        duration: 4000,
      });

      return;
    }



    if (this.form.invalid) {
      this.snack.open('ERROR: Es necesario completar todos los campos obligatorios ', "OK", {
        duration: 4000,
      });
      return Object.values(this.form.controls).forEach((controls) => {
        controls.markAllAsTouched();
      });
    }

    
    if (!bIsDraft){
      const fileinvalid = this.listdocument.find(e => e.bbreak_requiredfile = true && e.file === null && e.nid_mastertable === 1020);

      if (fileinvalid != undefined) {
        this.snack.open('Es necesario adjuntar ' + fileinvalid.sdescription_value, "OK", {
          duration: 4000,
        });
        return;
      }
      
    }
   




    let dFechaInicio = new Date(this.form.get('ddateinitdm').value);
    let dFechaFin = new Date(this.form.get('ddateenddm').value);


    let nanioInicio = dFechaInicio.getFullYear();
    let nanioFin = dFechaFin.getFullYear();

    let nmesInicio = dFechaInicio.getMonth();
    let nmesFin = dFechaFin.getMonth();


    if (nanioInicio !== nanioFin  ||  nmesInicio !== nmesFin){

      this.snack.open('Solo puede generar solicitudes por fechas para un mismo periodo. Si desea seleccionar fechas de meses distintos, debe crear dos solicitudes respectivamente.', "OK", {
        duration: 4000,
      });
      return;
    }

    

    if (!bIsDraft){
      const index = this.listdocument.findIndex(res => res.sdescription_value.indexOf('Certificado médico') > -1);
    
      if (this.listdocument[index].file == null || typeof this.listdocument[index].file == 'undefined') {
        this.snack.open('El Certificado médico es obligatorio', "OK", {
          duration: 4000,
        });
        return;
      }
    }
    

    this.titleMessage="¿Estás seguro que deseas continuar?";
    if (bIsDraft){
      this.bodyMessage="Estás guardando la  solicitud como borrador. Luego deberás completar y enviar para continuar con el flujo.";
    }else{
      this.bodyMessage="Recuerda, que debes de entregar estos  de manera fisica para completar tu solicitud.";
    }

    
    this.resultConfirm=true;
    this.textoBoton="Aceptar";

    const dialogRef = this.dialog.open(ConfirmDialogSolicitudComponent, {
      width: '656px',
      height:'240px',
      data:{titlemessage: this.titleMessage,bodymessage: this.bodyMessage, result:this.resultConfirm,textButton:this.textoBoton}
    });

    dialogRef.afterClosed().subscribe(resp => {
      if(resp.result){

        this.save();
      }

    });

  }

  valideKey(evt) {
    // code is the decimal ASCII representation of the pressed key.
    var code = evt.which ? evt.which : evt.keyCode;

     if (code >= 48 && code <= 57) {
        // is a number.
        return true;
    } else {
        // other keys.
        return false;
    }
  }


  getFormValidationErrors() {
  
    let totalErrors = 0;
  
    Object.keys(this.form.controls).forEach(key => {
      const controlErrors: ValidationErrors = this.form.get(key).errors;
      if (controlErrors != null) {
         totalErrors++;
         Object.keys(controlErrors).forEach(keyError => {
           console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          });
      }
    });
  }

  updateMissingArchives():void{

    this.listdocumentbyId.forEach(e => {
      if(e.file != null && typeof e.file != 'undefined') {
        const formData = new FormData();
        formData.append('files', e.file);

        const payload = {
          nid_medical:this.id,
          ntype_doc: Number(this.form.get('ntypedm').value),
          // ndocument: e.nid_mastertable
          ndocument: e.ndocument
        }

        formData.append('request', JSON.stringify(payload));
        this.staffRequestService.registerDocument(formData).subscribe(resp => {
        }, (err) => console.log('Error', err))
      }
    });

    this.snack.open('Se actualizó correctamente la solicitud', "OK", {
      duration: 4000,
    });
    this.cancel();
  }

  updateMissingArchivesDraft():void{
    this.listdocumentbyId.forEach(e => {
      if(e.file != null && typeof e.file != 'undefined') {
        const formData = new FormData();
        formData.append('files', e.file);

        const payload = {
          nid_medical:this.id,
          ntype_doc: Number(this.form.get('ntypedm').value),
          // ndocument: e.nid_mastertable
          ndocument: e.ndocument
        }

        formData.append('request', JSON.stringify(payload));
        this.staffRequestService.registerdocumentdraft(formData).subscribe(resp => {
        }, (err) => console.log('Error', err))
      }
    });

    this.snack.open('Se actualizó correctamente la solicitud', "OK", {
      duration: 4000,
    });
    this.cancel();
  }


  SendMissingArchivesDraft():void{
    let nMissingFiles =0;
      this.listdocumentbyId.forEach(element => {
        if (element.bbreak_requiredfile && element.file === null){
          nMissingFiles++;
        }
      });


      if (nMissingFiles>0){
          this.snack.open('Para enviar debe cargar todos los documentos obligatorios', "Advertencia", {
            duration: 4000,
          });
          return;
      }


    console.log("okei");


    this.staffRequestService.updatestate(this.id).subscribe(resp => {
      if (resp.stateCode == 200){
        this.listdocumentbyId.forEach(e => {
          const formData = new FormData();
          if(e.file != null && typeof e.file != 'undefined') {
            formData.append('files', e.file);
            const payload = {
              nid_medical:this.id,
              ntype_doc: Number(this.form.get('ntypedm').value),
              // ndocument: e.nid_mastertable
              ndocument: e.ndocument
            }
      
            formData.append('request', JSON.stringify(payload));
            this.staffRequestService.registerDocument(formData).subscribe(resp => {
            }, (err) => console.log('Error', err))
          }
    
        });
    
        this.snack.open('Se actualizó correctamente la solicitud', "OK", {
          duration: 4000,
        });
        this.cancel();
      }
    })
  }

  

  medicalDocumentApproved(nid_document): void {
      const payload = {
        nid_document_medical: nid_document
      }
      this.staffRequestService.medicalDocumentApproved(payload).subscribe(resp => {
        if (resp.stateCode == 200) {
          this.snack.open('Documento APROBADA correctamente.', "OK", {
            duration: 4000,
          });
         } else {
          this.snack.open(resp.messageError[0], "Advertencia", { duration: 4000 });
         }
      })

  }
  ObservDocumentMasive():void{

    if (this.listObservedDocument.length>0){
      const payload = {
        nid_medical: this.id,
        listdocument:this.listObservedDocument 
      }
      this.staffRequestService.observedocumentmasive(payload).subscribe(resp => {
        if (resp.stateCode == 200) {
          this.snack.open('Se observaron los documentos correctamente.', "OK", {
            duration: 4000,
          });
          this.cancel();
         } else {
          this.snack.open(resp.messageError[0], "Advertencia", { duration: 4000 });
         }
      })

    }else{
      this.snack.open("Debe observar al menos un documento", "Advertencia", { duration: 4000 });

    }



  }

}
