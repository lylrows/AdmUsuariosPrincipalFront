import {  Component,  ElementRef,  Inject,  OnInit,  ViewChild,} from "@angular/core";
import {  FormBuilder,  FormControl,  FormGroup,  ValidationErrors,  Validators,} from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DomSanitizer } from "@angular/platform-browser";
import { Areas } from "@app/data/schema/areas";
import { Empresa } from "@app/data/schema/empresa";
import { InformationAditionalDto } from "@app/data/schema/info-adicional-postulant";
import { InformationExtraDto } from "@app/data/schema/info-extra-postulant";
import { InformationPostulantAllDto } from "@app/data/schema/info-postulant";
import { FilterPostulantRequest, PostulantDto, PostulantRequest } from "@app/data/schema/Postulant/postulant";
import { AreaService } from "@app/data/service/areas.service";
import { EmployeeService } from "@app/data/service/employee.service";
import { EmpresaService } from "@app/data/service/empresa.service";
import { InformationPostulantService } from "@app/data/service/information-postulant.service";
import { MastertableService } from "@app/data/service/mastertable.service";
import { NotificationService } from "@app/data/service/notification.service";
import { PostulantFileService } from "@app/data/service/PostulantFileService";
import { SalaryBandService } from "@app/data/service/salaryband.service";
import { UtilService } from "@app/data/service/util.service";
import { ModalBossComponent } from "@app/modules/human-management/page/staff-administration/profile/modal-boss/modal-boss.component";
import { AppConfirmService } from "@app/shared/services/app-confirm/app-confirm.service";
import { environment } from "environments/environment";
import * as _moment from "moment";

@Component({
  selector: "app-dialog-postulant-file",
  templateUrl: "./dialog-postulant-file.component.html",
  styleUrls: ["./dialog-postulant-file.component.scss"],
})
export class DialogPostulantFileComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DialogPostulantFileComponent>,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private snack: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private postulantFileService: PostulantFileService,
    private personService: InformationPostulantService,
    private confirmService: AppConfirmService,
    private _serviceUtil: UtilService,
    public _dialog: MatDialog,
    private masterService:MastertableService,
    private _employeeService: EmployeeService,
    private notificationService: NotificationService
  ) {} 

  public itemForm: FormGroup;
  public progress: number;
  public message: string; 
  imageURL = "";
  selectedFile: any;
  displayFileName = "";
  archivoCapturado: any;
  civil: any[] = [];
  nacionality: any[] = [];
  exactuspayroll: any = [];
  exactusafp: any = [];
  exactuslocation: any = [];
  financialentity: any = [];
  originBankREM: any = [];
  originBankCTS: any = [];
  bankCTS: any = [];
  birthdate: Date;
  filterPostulantRequest: FilterPostulantRequest = {
    idEvaluation: 0,
    idPostulant: 0,
    type: 'EXTERNA'
  }
  postulantRequest: PostulantRequest = {
    idPostulantRequest: 0,
    idEvaluation: 0,
    idPostulant: 0,
    type: 'EXTERNA',
    firstName: '',
    secondName: '',
    lastName: '',
    motherLastName: '',
    documentType: '',
    documentNumber: '',
    birthDate: '',
    idCompany: 0,
    idManagement: 0,
    idArea: 0,
    idSubArea: 0,
    idCostCenter: 0,
    position: '',
    incomeDate: '',
    endDate: '',
    contractType: 0,
    vacantType: 0,
    schedule: '',
    boss: '',
    idBoss: 0,
    idSalaryCategory: 0,
    idCampus: 0,
    user: 0,
    confirmed: false
  };
  
  hasMovility: boolean = false;
  hasDisability: boolean = false;
  listFiles: any[] = [];
  tipoFile_DocumentoCasado: string = 'DOCUMENTO_CASADO';
  tipoFile_DocumentoCopiaDNI: string = 'DOCUMENTO_COPIA_DNI';
  tipoFile_DocumentoReciboServicio: string = 'DOCUMENTO_COPIA_RECIBO_SERVICIO';
  tipoFile_DocumentoDiscapacidad: string = 'DOCUMENTO_DISCAPACIDAD';
  tipoFile_DocumentoAdicional: string = 'DOCUMENTO_ADICIONAL';
  tooltip_DocumentoCasado: string = 'Adjuntar Documento de Partida';
  tooltip_DocumentoCopiaDNI: string = 'Adjuntar Copia de DNI';
  tooltip_DocumentoReciboServicio: string = 'Adjuntar Copia de Recibo de Servicio';
  tooltip_DocumentoDiscapacidad: string = 'Adjuntar Sustento de Discapacidad';
  filename_DocumentoCasado: string = '';
  path_DocumentoCasado: string = '';
  filename_DocumentoCopiaDNI: string = '';
  path_DocumentoCopiaDNI: string = '';
  filename_DocumentoReciboServicio: string = '';
  path_DocumentoReciboServicio: string = '';
  filename_DocumentoDiscapacidad: string = '';
  path_DocumentoDiscapacidad: string = '';
  isDNI: boolean = false;
  isCasado: boolean = false;
  public lstTipoDocumento:any;
  listDocumentosAdicionales: any[] = [];
  mesesDiferenciaPositionExactus: number = 0.00;
  fechaStartExactus: Date;
  fechaEndExactus: Date;
  listHorarios: any[];
  listHorariosSelected: any[];

  @ViewChild("fileInput")
  fileInput: ElementRef;
  employees: any[] = [];
  person: PostulantDto = {
    id: 0,
    codPerson: "",
    firstName: "",
    secondName: "",
    lastName: "",
    motherLastName: "",
    email: "",
    idSex: 0,
    sex: "",
    bloodType: "",
    documentNumber: "",
    passport: "",
    birthDate: "",
    idNationality: 0,
    nationality: "",
    idCivilStatus: 0,
    civilStatus: "",
    isNoDomiciled: false,
    drivingLicense: "",
    universityGraduationDate: "",
    countryentryDate: "",
    medicalStaff: "",
    idActive: 0,
    img: "",
    cvFolder: "",
    cvName: "",
    cvFile: "",
    contentType: "",
    address: "",
    idDistrict: 0,
    haveDriverLicense: false,
    haveOwnMobility: false,
    cellPhone: "",
    anotherPhone: "",
    idTypeDocument: 0,
    typeDocument: "",
    idDepartmentLocation: 0,
    idProvinceLocation: 0,
    idDistrictLocation: 0,
    idUser: 0,
    age: 0,
    salaryPreference: "",
  };
  infoextra: InformationExtraDto = {
    id: null,
    idPostulant: null,
    afp: null,
    auto: null,
    bankAfp: null,
    bankHaberes: null,
    bankOpen: null,
    categoryBrevete: null,
    company: null,
    createBcp: null,
    moto: null,
    nombreContacto: null,
    nroReferenciaContacto: null,
    parentescoContacto: null,
    placeOfBirth: null,
    rucNumber: null,
    typeSangre: null,
    age: null,
    idDocumentType: null,
    disclaimer: false,
    hasMobility: false,
    hasDisability: false,
    sent: false
  };

  infoadicional: InformationAditionalDto = {
    id: null,
    idPostulant: null,
    question1: null,
    question2: null,
    question3: null,
    question4: null,
    question5: null,
    espectativeSalary: null,
    bruto: null,
    neto: null,
  };
  idPerson: number;
  idEvaluation:number;
  lstinfo= {
    informationFamilyDtos:null

  } as InformationPostulantAllDto;
  bisonexactus= false;
  tipoSalario='';
  isAdministration = false;
  permitConfirmar = false;
  permitSendExactus = false;
  dateIncomeCountryExactus: any;
  dateEndPositionExactus: any;
  dateBirth: any;
  dateIncomeCountry: any;
  showRequiredFileDomicio: boolean = false;
  showRequiredFileDNI: boolean = false;
  showRequiredFileMarried: boolean = false;
  showRequiredFileDisability: boolean = false;
  rowDocumentoAdicional: any;
  showSendExatus: boolean = false;

  ngOnInit(): void {
    
    this.idEvaluation  = this.data.payload.idEvaluation ;
    this.idPerson = this.data.payload.data.nid_person;
    this.isAdministration = this.data.payload.data.isAdministration;
    this.permitConfirmar = this.data.payload.data.permitConfirmar;
    this.permitSendExactus = this.data.payload.data.permitSendExactus;
    this.filterPostulantRequest.idEvaluation = this.idEvaluation;
    this.filterPostulantRequest.idPostulant = this.idPerson;
    
    
    const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    this.showSendExatus = environment.perfilReclutamientoRRHH.indexOf(storage.nid_profile) > -1;
    this.loadDocumentsTypes();
    this.getExactusPayroll();
    this.getexactuslocation();
    this.getexactusafp();
    this.getexactusbank();
    this.GetListHorarios();
    
    this.getPerson(this.idPerson);
    this.getInfoAll(this.idPerson, this.idEvaluation);

    this.getCivil();
    this.getNationality();
    this.buildItemForm(this.data.payload.data);
  }

  loadInfo() {

  }

  getCivil(): void {
    this._serviceUtil.getCivil().subscribe((resp) => (this.civil = resp));
  }
  getNationality(): void {
    this._serviceUtil
      .getNationality()
      .subscribe((resp) => (this.nacionality = resp));
  }

  buildItemForm(item) {
    
    this.bisonexactus =item.bisonexactus;
    
    this.itemForm = this.fb.group({
      nid_person: [item.nid_person || 0],
      scodepayroll: [item.scodepayroll || "E001"],
      scodelocation: [item.scodelocation || "SEDEC"],
      salaryref: [item.salaryref || 0, [Validators.maxLength(6)]],
      schedule: [item.schedule || ""],
      sbloodtype: [item.sbloodtype || "A+"],
      sfinancialentitycode: [item.sfinancialentitycode || "ND"],
      sentityaccount: [item.sentityaccount || "", [Validators.maxLength(20)]],
      sorigincodbankrem: [item.sorigincodbankrem || "ND"],
      sorigincodbankcts: [item.sorigincodbankcts || "ND"],
      scodeafp: [item.scodeafp || "99"],
      ssalarycurrency: [item.ssalarycurrency || "0"],
      sctscurrency: [item.sctscurrency || "0"],
      scodbankcts: [item.scodbankcts || "ND"],
      sctsaccount: [item.sctsaccount || "", [Validators.maxLength(20)]],
      sdoctypebcp: [item.sdoctypebcp || "1"],
      bintegralremuneration: [item.bintegralremuneration || false],
      bnodomiciliado: [item.bnodomiciliado || false],
      stypesalaryaccount: [item.stypesalaryaccount || "A"],
      bfifthdiscount: [item.bfifthdiscount || false],
      bafpmixed: [item.bafpmixed || false],
      
      dincomecountry: [item.dincomecountry || ""],
      scuspp: [item.scuspp || ""],
      dendposition: [item.dendposition || ""],
      dstartposition: [item.dstartposition || ""],
    });
    
    
    if (this.itemForm.get("dincomecountry").value != "") {
      const valueDateIncome = this.itemForm.get('dincomecountry').value;
      const fechaIncome = valueDateIncome.split("/");
      const dayIncome = Number(fechaIncome[0]);
      const monthIncome = Number(fechaIncome[1]);
      const yearIncome = Number(fechaIncome[2]);
      const fechaIncomeDate = new Date(yearIncome, monthIncome - 1, dayIncome);
      this.itemForm.get('dincomecountry').setValue(fechaIncomeDate);
    }

    if (this.itemForm.get("dendposition").value != "") {
      const valueDateEnd = this.itemForm.get('dendposition').value;
      const fechaEnd = valueDateEnd.split("/");
      const dayEnd = Number(fechaEnd[0]);
      const monthEnd = Number(fechaEnd[1]);
      const yearEnd = Number(fechaEnd[2]);
      const fechaEndDate = new Date(yearEnd, monthEnd - 1, dayEnd);
      this.fechaEndExactus = fechaEndDate;
      this.itemForm.get('dendposition').setValue(fechaEndDate);
    }

    if (this.itemForm.get("dstartposition").value != "") {
      const valueDateStart = this.itemForm.get('dstartposition').value;
      const fechaStart = valueDateStart.split("/");
      const dayStart = Number(fechaStart[0]);
      const monthStart = Number(fechaStart[1]);
      const yearStart = Number(fechaStart[2]);
      const fechaStartDate = new Date(yearStart, monthStart - 1, dayStart);
      this.fechaStartExactus = fechaStartDate;
      this.itemForm.get('dstartposition').setValue(fechaStartDate);
    }

    const fechaStart = _moment(this.fechaStartExactus);
    const fechaEnd = _moment(this.fechaEndExactus).add(1, 'days');
    this.mesesDiferenciaPositionExactus = fechaEnd.diff(fechaStart, 'months', true);
  }

  getExactusPayroll(): void {
    this.postulantFileService.getexactuspayroll().subscribe((resp) => {
      this.exactuspayroll = resp.data;
    });
  }
  getexactusafp(): void {
    this.postulantFileService.getexactusafp().subscribe((resp) => {
      this.exactusafp = resp.data;
    });
  }
  getexactuslocation(): void {
    this.postulantFileService.getexactuslocation().subscribe((resp) => {
      this.exactuslocation = resp.data;
    });
  }
  getexactusbank(): void {
    this.postulantFileService.getexactusbank().subscribe((resp) => {

      this.financialentity = resp.data;
      this.originBankREM = resp.data;
      this.originBankCTS = resp.data;
      this.bankCTS = resp.data;
    });
  }

  submit() {
    const _result = this.ValidarEnvio();
    if (!_result.isValid){
      this.snack.open(_result.mensaje, "OK", { duration: 4000 });
      return;
    };

    this.confirmService.confirm({title: "Confirmación", message: 'Antes de continuar verifique que todos los campos del formulario "Información Exactus" estén correctos.'})
    .subscribe((result) => {
      
      if(result){
       
       
       const payload = this.requestExaxtus();

       this.postulantFileService.saveinformationexactus(payload).subscribe((data) => {
        if (data.stateCode == 200) {
          this.snack.open("Grabado correctamente", "OK", { duration: 4000 });          
        } else {          
          this.snack.open(data.messageError[0], "Error", { duration: 4000 });
        }
      });

      this.infoadicional.idPostulant = this.idPerson;
      this.lstinfo.informationAditionalDtos = this.infoadicional;
      this.lstinfo.informationPerson = this.person;
      this.infoextra.idPostulant = this.idPerson;
      this.lstinfo.informationExtraDto = this.infoextra;  
      this.lstinfo.idEvaluation = this.idEvaluation;
      
      this.personService.saveinformation(this.lstinfo).subscribe((data) => {
        if (data.stateCode == 200) {  
          let salaryref =  this.itemForm.get("salaryref").value ;  
          if (    salaryref !==  null &&  salaryref !==  ''){
            this.itemForm.get('salaryref').setValue( parseFloat(salaryref) );  
          }
          this.postulantFileService.saveinformationexactus(this.itemForm.value).subscribe((dataexactus) => {
            if (dataexactus.stateCode == 200) {
              this.postulantFileService.sendinfoexactus({
                nid_person: this.idPerson,
                nid_evaluation:this.idEvaluation
              }).subscribe((data) => {
                if (data.stateCode == 200) {
                  this.bisonexactus=true;
                  this.snack.open("Se envió correctamente a Exactus", "OK", { duration: 4000 });
                } else {
                  this.snack.open(data.messageError[0], "Error", { duration: 4000 });
                }
              });
            } else {
              this.snack.open(dataexactus.messageError[0], "Error", { duration: 4000 });
            }
          }); 
        } else {
          this.snack.open(data.messageError[0], "Error", { duration: 4000 });
        }
      });
      }
      
    });
  }
  

  changeDateExactus() {
    
    if (this.itemForm.get("dendposition").value != "") {
      this.fechaEndExactus = this.itemForm.get('dendposition').value;
    } else  {
      this.mesesDiferenciaPositionExactus = 0;
      return;
    }

    if (this.itemForm.get("dstartposition").value != "") {
      this.fechaStartExactus = this.itemForm.get('dstartposition').value;
    } else  {
      this.mesesDiferenciaPositionExactus = 0;
      return;
    }

    const fechaStart = _moment(this.fechaStartExactus);
    const fechaEnd = _moment(this.fechaEndExactus).add(1, 'days');;
    
    this.mesesDiferenciaPositionExactus = fechaEnd.diff(fechaStart, 'months', true);
  }

  valideKey(evt) {
    
    var code = evt.which ? evt.which : evt.keyCode;

    if (code == 8) {
      
      return true;
    } else if (code >= 48 && code <= 57) {
      
      return true;
    } else {
      
      return false;
    }
  }

  getFormValidationErrors() {


    let totalErrors = 0;

    Object.keys(this.itemForm.controls).forEach((key) => {
      const controlErrors: ValidationErrors = this.itemForm.get(key).errors;
      if (controlErrors != null) {
        totalErrors++;
        Object.keys(controlErrors).forEach((keyError) => {
          console.log(
            "Key control: " + key + ", keyError: " + keyError + ", err value: ",
            controlErrors[keyError]
          );
        });
      }
    });


  }

  getPerson(idperson) {
    this.personService.getInfoPerson(idperson).subscribe((res) => {
      this.person = res.data;
      
      if (this.person.birthDate != null && typeof this.person.birthDate != 'undefined'){
        const fechaBirth = this.person.birthDate.split("/");
        const dayBirth = Number(fechaBirth[0]);
        const monthBirth = Number(fechaBirth[1]);
        const yearBirth = Number(fechaBirth[2]);
        const fechaDateBirth = new Date(yearBirth, monthBirth - 1, dayBirth);
        this.dateBirth = fechaDateBirth;
      } 
      this.ChangeCivilStatus();
      
    });
  }

  getInfoAll(idperson, idEvaluation) {
    this.personService.getInfoAll(idperson, idEvaluation).subscribe((res) => {
      this.lstinfo = res.data;
      const infoAditional = this.lstinfo.informationAditionalDtos;
      if(infoAditional != null) {
        this.infoadicional = infoAditional;
        if (this.infoadicional.bruto === true)
        {
         this.tipoSalario='bruto';
        }else{
         this.tipoSalario='neto';
        }
      }

      const infoExtra = this.lstinfo.informationExtraDto;
      const lstDocumentos = this.lstinfo.listaDocumentos;
      if (infoExtra  != null)
      {
        this.infoextra = infoExtra;
        this.hasDisability = this.infoextra.hasDisability;
        this.hasMovility = this.infoextra.hasMobility;
        
        if (this.infoextra.incomeCountryDate != null && typeof this.infoextra.incomeCountryDate != 'undefined'){
          const fechaIncome = this.infoextra.incomeCountryDate.split("/");
          const dayIncome = Number(fechaIncome[0]);
          const monthIncome = Number(fechaIncome[1]);
          const yearIncome = Number(fechaIncome[2]);
          const fechaIncomeDate = new Date(yearIncome, monthIncome - 1, dayIncome);
          this.dateIncomeCountry = fechaIncomeDate;
        }
        this.ChangeDocumentType();
      }

      if (lstDocumentos != null) {
        this.listFiles = lstDocumentos;
        this.SetFilesNamesPathDocuments();
        
        if (lstDocumentos.length < 2) {
          this.SetearArrayInicial(this.listFiles[0]);
        }
      }  else this.SetearArrayInicial(null); 
      this.listDocumentosAdicionales = this.lstinfo.listaDocumentosAdicionales;
      
    });
  }

  sendtoexactus(){
    this.postulantFileService.sendinfoexactus({
      nid_person: this.idPerson,
      nid_evaluation:this.idEvaluation
    }).subscribe((data) => {
      if (data.stateCode == 200) {
        this.snack.open("Se envió correctamente a Exactus", "OK", { duration: 4000 });
      } else {
        this.snack.open(data.messageError[0], "Error", { duration: 4000 });
      }
    });
  }
  updatelistfamily($event) {
    this.lstinfo.informationFamilyDtos = $event;
  }
  updatelisteducation($event) {
    this.lstinfo.informationEducationDtos = $event;
  }
  updatelistwork($event) {
    this.lstinfo.informationWorkDtos = $event;
  }
  updatelistskills($event) {
    this.lstinfo.informationComputerSkillsDtos = $event;
  }
  updatelistlang($event) {
    this.lstinfo.informationLangDtos = $event;
  }
  changesueldo($event) {
    if ($event.value == "bruto") {
      this.infoadicional.bruto = true;
      this.infoadicional.neto = false;
    } else {
      this.infoadicional.bruto = false;
      this.infoadicional.neto = true;
    }
  }


  submitFichaPersonal(confirmar: boolean) {
    
    if (confirmar){      
      const _result = this.ValidarEnvio();
      if (!_result.isValid){
        this.snack.open(_result.mensaje, "OK", { duration: 4000 });
        return;
      }
      let validacion = false;
      
      this.lstinfo.informationFamilyDtos.map(x => {
        x.tryToSendAndShowError = x.informationFile == null;
        validacion = validacion ? validacion : x.informationFile == null;
      });
      
      this.lstinfo.informationEducationDtos.map(x => {
        x.tryToSendAndShowError = x.informationFile == null;
        validacion = validacion ? validacion : x.informationFile == null;
      });
      
      this.lstinfo.informationWorkDtos.map(x => {
        x.tryToSendAndShowError = x.informationFile == null;
        validacion = validacion ? validacion : x.informationFile == null;
      });
      
      this.listDocumentosAdicionales.map(x => {
        if (x.indicadorFile) {
          let _isNotDocument = (x.nombreFile == null || x.nombreFile == '') && (x.fileBase64 == null || x.fileBase64 == '');
          x.tryToSendAndShowError = _isNotDocument;
          validacion = validacion ? validacion : _isNotDocument;
        }
      });
      if(validacion) {
        this.snack.open('Debe adjuntar todos los documentos obligatorios', "OK", { duration: 4000 });
        return;
      } 
      this.confirmService
          .confirm({
            title: "Confirmación",
            message: "¿Esta seguro que desea confirmar los cambios?",
          })
          .subscribe((result) => {
            if (result) {
              this.guardarInformacion(confirmar);
              this.SendNotification();
            }
          });
    } else this.guardarInformacion(confirmar);
  }

  guardarInformacion(confirmar: boolean) {
    
    if(this.dateBirth != null && typeof this.dateBirth != 'undefined') {
      this.person.birthDate = _moment(this.dateBirth).format("DD/MM/YYYY");
    }
    if(this.dateIncomeCountry != null && typeof this.dateIncomeCountry != 'undefined') {
      this.infoextra.incomeCountryDate = _moment(this.dateIncomeCountry).format("DD/MM/YYYY");
    }
    this.infoadicional.idPostulant = this.idPerson;
    this.lstinfo.informationAditionalDtos = this.infoadicional;
    this.lstinfo.informationPerson = this.person;
    this.infoextra.idPostulant = this.idPerson;
    this.lstinfo.informationExtraDto = this.infoextra;    
    this.lstinfo.listaDocumentos = this.listFiles;
    this.lstinfo.idEvaluation = this.idEvaluation;
    this.personService.saveinformation(this.lstinfo).subscribe((data) => {
      if (data.stateCode == 200) {

        let salaryref =  this.itemForm.get("salaryref").value ;
        if (    salaryref !==  null &&  salaryref !==  ''){
          this.itemForm.get('salaryref').setValue( parseFloat(salaryref) );
        }
        const payload = this.requestExaxtus();
        this.postulantFileService.saveinformationexactus(payload).subscribe((dataexactus) => {
          if (dataexactus.stateCode == 200) {
            this.snack.open("Grabado correctamente", "OK", { duration: 4000 });
          } else {
            this.snack.open(dataexactus.messageError[0], "Error", { duration: 4000 });
          }
        });
        
        this.SaveInformationPostulantRequest(confirmar);
      } else {
        this.snack.open(data.messageError[0], "Error", { duration: 4000 });
      }
    });
  }

  senttoexactus(row: any ){
    
    this.postulantFileService.sendinfoexactus({
      nid_person: row.idPostulant,
      nid_evaluation:row.idEvaluation
    }).subscribe((data) => {
      if (data.stateCode == 200) {
        this.snack.open("Se envió correctamente a Exactus", "OK", { duration: 4000 });
      } else {
        this.snack.open(data.messageError[0], "Error", { duration: 4000 });
      }
    });
 }
 
 updateModelPostulantRequest($event) {
    this.postulantRequest = $event;
    
 }
 
 SaveInformationPostulantRequest(confirmar: boolean) {
  const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
  const idUser: number = storage.id;
  this.postulantRequest.contractType = Number(this.postulantRequest.contractType);
  this.postulantRequest.vacantType = Number(this.postulantRequest.vacantType);
  this.postulantRequest.user = Number(idUser);
  if(!this.postulantRequest.confirmed) this.postulantRequest.confirmed = confirmar;
  this.personService.SavePostulantRequest(this.postulantRequest).subscribe(res => {
      
      this.postulantRequest.idPostulantRequest = res.data;
    });
  }
  
  loadDocumentsTypes() {
    this.masterService.getByIdFather(50).subscribe(res => {
      this.lstTipoDocumento = res;
      
    })
  }

  checkMovilidad($event, type: number) {
    if (type == 1) {
      if ($event.checked) this.hasMovility = true;
      else this.hasMovility = false;
    } else {
      if ($event.checked) this.hasMovility = false;
      else this.hasMovility = true;
    }
  }

  checkDiscapacidad($event, type: number) {
    if (type == 1) {
      if ($event.checked) this.hasDisability = true;
      else this.hasDisability = false;
    } else {
      if ($event.checked) this.hasDisability = false;
      else this.hasDisability = true;
    }
  }
  
  CargarDocumento(eventoRetorno) {
    
    if(this.listFiles == null || typeof this.listFiles == 'undefined') this.listFiles = [];
    const _indexExistente = this.listFiles.findIndex(x => x.tipo_archivo == eventoRetorno.tipo_archivo);
    

    if(eventoRetorno.archivo != null) {
      
      this.listFiles[_indexExistente].archivo_base64 = eventoRetorno.archivo_base64;
      this.listFiles[_indexExistente].filename = eventoRetorno.file_name;
      this.listFiles[_indexExistente].extension = eventoRetorno.extension;
      this.listFiles[_indexExistente].ruta_archivo = '';
      switch(eventoRetorno.tipo_archivo) {
        case this.tipoFile_DocumentoReciboServicio:
          this.showRequiredFileDomicio = false;
          break;
        case this.tipoFile_DocumentoCopiaDNI:
          this.showRequiredFileDNI = false;
          break;
        case this.tipoFile_DocumentoCasado:
          this.showRequiredFileMarried = false;
          break;
        case this.tipoFile_DocumentoDiscapacidad:
          this.showRequiredFileDisability = false
          break;
      }
    } else {
      switch(eventoRetorno.tipo_archivo) {
        case this.tipoFile_DocumentoReciboServicio:
          this.filename_DocumentoReciboServicio = '';
          this.path_DocumentoReciboServicio = '';
          break;
        case this.tipoFile_DocumentoCopiaDNI:
          this.filename_DocumentoCopiaDNI = '';
          this.path_DocumentoCopiaDNI = '';
          break;
        case this.tipoFile_DocumentoCasado:
          this.filename_DocumentoCasado = '';
          this.path_DocumentoCasado = '';
          break;
        case this.tipoFile_DocumentoDiscapacidad:
          this.filename_DocumentoDiscapacidad = '';
          this.path_DocumentoDiscapacidad = '';
          break;
      }
      
      this.listFiles[_indexExistente].archivo_base64 = '';
      this.listFiles[_indexExistente].filename = '';
      this.listFiles[_indexExistente].extension = '';
      this.listFiles[_indexExistente].ruta_archivo = '';
    }
    
  }

  ChangeDocumentType() {
    const _obj = this.lstTipoDocumento.filter(x => x.id == this.infoextra.idDocumentType);
    if (_obj != null && typeof _obj != 'undefined') {
      if (_obj.length == 0) return;
      const cod_exactus = _obj[0].shortValue;
      this.isDNI = cod_exactus == '01';
      if (!this.isDNI) {
        this.DeleteFileByType(this.tipoFile_DocumentoCopiaDNI);
      } else {
        this.dateIncomeCountry = null;
        this.infoextra.incomeCountryDate = "";
      }
    }    
  }

  DeleteFileByType(type_file: string){
    const _indexExistente = this.listFiles.findIndex(x => x.tipo_archivo == type_file);
    if (_indexExistente > -1) this.listFiles.splice(_indexExistente, 1);
  }

  ChangeCivilStatus() {
    this.isCasado = this.person.idCivilStatus == 16;
    if (!this.isCasado) {
      this.DeleteFileByType(this.tipoFile_DocumentoCasado);
    }
  }
  
  ValidarEnvio() : any {
    let isValid = true;
    let mensaje = "";
    if (this.IsNullOrEmptyOrUndefined(this.person.firstName)) isValid = false; 
    if (this.IsNullOrEmptyOrUndefined(this.person.lastName)) isValid = false; 
    if (this.IsNullOrEmptyOrUndefined(this.person.motherLastName)) isValid = false; 
    if (this.IsNullOrEmptyOrUndefined(this.person.address)) isValid = false; 
    if (this.IsNullOrEmptyOrUndefined(this.person.cellPhone)) isValid = false; 
    if (this.IsNullOrEmptyOrUndefined(this.person.email)) isValid = false; 
    if (this.IsNullOrEmptyOrUndefined(this.person.birthDate)) isValid = false; 
    if (this.IsNullOrEmptyOrUndefined(this.infoextra.idDocumentType)) isValid = false; 
    if (this.IsNullOrEmptyOrUndefined(this.person.documentNumber)) isValid = false; 
    if (this.IsNullOrEmptyOrUndefined(this.person.idCivilStatus)) isValid = false; 
    if (this.IsNullOrEmptyOrUndefined(this.infoextra.bankHaberes)) isValid = false; 
    if (this.IsNullOrEmptyOrUndefined(this.infoextra.bankAfp)) isValid = false; 
    if (this.IsNullOrEmptyOrUndefined(this.infoextra.afp)) isValid = false; 
    if (this.IsNullOrEmptyOrUndefined(this.infoextra.typeSangre)) isValid = false; 
    if (this.IsNullOrEmptyOrUndefined(this.infoextra.nombreContacto)) isValid = false; 
    if (this.IsNullOrEmptyOrUndefined(this.infoextra.nroReferenciaContacto)) isValid = false; 
    if (this.IsNullOrEmptyOrUndefined(this.infoextra.parentescoContacto)) isValid = false; 
    
    if (this.IsNullOrEmptyOrUndefined(this.postulantRequest.firstName)) isValid = false; 
    if (this.IsNullOrEmptyOrUndefined(this.postulantRequest.lastName)) isValid = false; 
    if (this.IsNullOrEmptyOrUndefined(this.postulantRequest.motherLastName)) isValid = false; 
    if (this.IsNullOrEmptyOrUndefined(this.postulantRequest.documentType)) isValid = false; 
    if (this.IsNullOrEmptyOrUndefined(this.postulantRequest.documentNumber)) isValid = false; 
    if (this.IsNullOrEmptyOrUndefined(this.postulantRequest.birthDate)) isValid = false; 
    if (this.IsNullOrEmptyOrUndefined(this.postulantRequest.idCompany)) isValid = false; 
    if (this.IsNullOrEmptyOrUndefined(this.postulantRequest.idManagement)) isValid = false; 
    
    if (this.IsNullOrEmptyOrUndefined(this.postulantRequest.position)) isValid = false; 
    if (this.IsNullOrEmptyOrUndefined(this.postulantRequest.idCostCenter)) isValid = false; 
    if (this.IsNullOrEmptyOrUndefined(this.postulantRequest.incomeDate)) isValid = false; 
    if (this.IsNullOrEmptyOrUndefined(this.postulantRequest.endDate)) isValid = false; 
    if (this.IsNullOrEmptyOrUndefined(this.postulantRequest.boss)) isValid = false; 
    if (this.IsNullOrEmptyOrUndefined(this.postulantRequest.schedule)) isValid = false; 
    if (this.IsNullOrEmptyOrUndefined(this.postulantRequest.idSalaryCategory)) isValid = false; 
    if (this.IsNullOrEmptyOrUndefined(this.postulantRequest.idCampus)) isValid = false; 

    if (!isValid) {
      mensaje = "Debe completar todos los datos obligatorios";
      return {
        isValid,
        mensaje
      }
    }

    
    var _objDomicilio = this.listFiles.find(x => x.tipo_archivo == this.tipoFile_DocumentoReciboServicio);
    if ((_objDomicilio.archivo_base64 == null || _objDomicilio.archivo_base64 == '') && (_objDomicilio.ruta_archivo == null ||
    _objDomicilio.ruta_archivo == '')) {
      isValid = false; this.showRequiredFileDomicio = true;
    }

    if (this.isDNI) {
      var _objDNI = this.listFiles.find(x => x.tipo_archivo == this.tipoFile_DocumentoCopiaDNI);
      if ((_objDNI.archivo_base64 == null || _objDNI.archivo_base64 == '') && (_objDNI.ruta_archivo == null ||
        _objDNI.ruta_archivo == '')) {
        isValid = false; this.showRequiredFileDNI = true;
      }
    }    

    if (this.isCasado) {
      var _objCasado = this.listFiles.find(x => x.tipo_archivo == this.tipoFile_DocumentoCasado);
      if ((_objCasado.archivo_base64 == null || _objCasado.archivo_base64 == '') && (_objCasado.ruta_archivo == null ||
        _objCasado.ruta_archivo == '')) {
        isValid = false; this.showRequiredFileMarried = true;
      }
    }

    if (this.hasDisability) {
      var _objDisability = this.listFiles.find(x => x.tipo_archivo == this.tipoFile_DocumentoDiscapacidad);
      if ((_objDisability.archivo_base64 == null || _objDisability.archivo_base64 == '') && (_objDisability.ruta_archivo == null ||
        _objDisability.ruta_archivo == '')) {
        isValid = false; this.showRequiredFileDisability = true;
      }
    }

    if (!isValid) mensaje = "Debe cargar todos los documentos obligatorios";
    return {
      isValid,
      mensaje
    }
  }

  SetearArrayInicial(obj) {
    if(this.listFiles == null || typeof this.listFiles == 'undefined') this.listFiles = [];
    this.listFiles = [];
    var _objFile = {
      nidinformationfile: 0,
      tipo_archivo: this.tipoFile_DocumentoCasado,
      archivo_base64: '',
      filename: '',
      extension: '',
      ruta_archivo: ''
    };

    var _obj2 = Object.assign({}, _objFile);
    var _obj3 = Object.assign({}, _objFile);
    var _obj4 = Object.assign({}, _objFile);
    if(this.listFiles.length = 0){
      _obj4.tipo_archivo = this.tipoFile_DocumentoDiscapacidad;
      this.listFiles.push(_obj4);
    } else {
      this.listFiles.push(obj);
    }
    this.listFiles.push(_objFile);
    _obj2.tipo_archivo = this.tipoFile_DocumentoCopiaDNI;
    this.listFiles.push(_obj2);
    _obj3.tipo_archivo = this.tipoFile_DocumentoReciboServicio;
    this.listFiles.push(_obj3);
  }

  IsNullOrEmptyOrUndefined(value: any) : boolean {
    if (value == null || value == "" || value == '0' || typeof value == 'undefined') return true;
    return false;
  }

  SetFilesNamesPathDocuments(){
    let _index = 0;
    
    _index = this.listFiles.findIndex(x => x.tipo_archivo == this.tipoFile_DocumentoReciboServicio);
    if (_index > -1) {
      this.filename_DocumentoReciboServicio = this.listFiles[_index].filename;
      this.path_DocumentoReciboServicio = this.listFiles[_index].ruta_archivo;
    }
    
    _index = 0;
    _index = this.listFiles.findIndex(x => x.tipo_archivo == this.tipoFile_DocumentoCopiaDNI);
    if (_index > -1) {
      this.filename_DocumentoCopiaDNI = this.listFiles[_index].filename;
      this.path_DocumentoCopiaDNI = this.listFiles[_index].ruta_archivo;
    }
    
    _index = 0;
    _index = this.listFiles.findIndex(x => x.tipo_archivo == this.tipoFile_DocumentoCasado);
    if (_index > -1) {
      this.filename_DocumentoCasado = this.listFiles[_index].filename;
      this.path_DocumentoCasado = this.listFiles[_index].ruta_archivo;
    }
    
    _index = 0;
    _index = this.listFiles.findIndex(x => x.tipo_archivo == this.tipoFile_DocumentoDiscapacidad);
    if (_index > -1) {
      this.filename_DocumentoDiscapacidad = this.listFiles[_index].filename;
      this.path_DocumentoDiscapacidad = this.listFiles[_index].ruta_archivo;
    }
  }

  CargarDocumentoAdicional(eventoRetorno) {    
    if(eventoRetorno.archivo != null) {
      this.listDocumentosAdicionales.map(x => {
        if (x.idMaster == eventoRetorno.tipo_archivo) {
          x.nombreFile = eventoRetorno.file_name;
          x.fileBase64 = eventoRetorno.archivo_base64;
        }
      });
    } else {
      this.listDocumentosAdicionales.map(x => {
        if (x.idMaster == eventoRetorno.tipo_archivo) {
          x.nombreFile = '';
          x.fileBase64 = '';
        }
      });
    }
    
  }

  checkDocumentoAdicional($event, item) {
    item.checked = $event.checked;
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

  onEditAditionalDocument(item, index) {
    this.rowDocumentoAdicional = Object.assign({}, item);
    this.listDocumentosAdicionales[index].disabled = false;
  }

  isDisabledRow(row: any){
    if (row == null || typeof row == 'undefined') return true;
    if (row.disabled == null || typeof row.disabled == 'undefined') return true;
    return row.disabled;
  }

  onCancelAditionalDocument(index){
    this.listDocumentosAdicionales[index] = this.rowDocumentoAdicional;
    this.rowDocumentoAdicional = null;
  }

  onSaveAditionalDocument(item, index) {
    var _obj = this.listDocumentosAdicionales[index];
    if (_obj.indicadorFile) {
      let _isNotDocument = (_obj.nombreFile == null || _obj.nombreFile == '') && (_obj.fileBase64 == null || _obj.fileBase64 == '');
      if (_isNotDocument) {
        this.snack.open("Debe adjuntar el documento solicitado", "OK", { duration: 4000 });
        return;
      }
    }  
    this.listDocumentosAdicionales[index].disabled = true;
    this.lstinfo.listaDocumentosAdicionales =  this.listDocumentosAdicionales;
    this.lstinfo.listaDocumentosAdicionales.map(x => {
      x.IdEvaluation = this.idEvaluation,
      x.IdPostulant = this.idPerson
    });
    this.personService.saveAditionalDocuments(this.lstinfo.listaDocumentosAdicionales).subscribe((data) => {
      
    });
  }
  
  GetListHorarios() {
    this._employeeService.ListGenericByKey(environment.keyHorarioExactus).subscribe(resp => {
      this.listHorarios = resp;
      this.listHorariosSelected = this.listHorarios;
      
    })
  }

  onKeyHorario(value) { 
    
    this.listHorariosSelected = this.searchHorario(value);
  }

  searchHorario(value: string) { 
    let filter = value.toLowerCase();
    return this.listHorarios.filter(option => (option.sshort_value + ' - '+ option.sdescription_value).toLowerCase().includes(filter));
  }

  requestExaxtus() {
    const payload = {
      nid_person: this.itemForm.get("nid_person").value,
      scodepayroll: this.itemForm.get("scodepayroll").value,
      scodelocation: this.itemForm.get("scodelocation").value,
      salaryref: this.itemForm.get("salaryref").value,
      schedule: this.itemForm.get("schedule").value,
      sbloodtype: this.itemForm.get("sbloodtype").value,
      sfinancialentitycode: this.itemForm.get("sfinancialentitycode").value,
      sentityaccount: this.itemForm.get("sentityaccount").value,
      sorigincodbankrem: this.itemForm.get("sorigincodbankrem").value,
      sorigincodbankcts: this.itemForm.get("sorigincodbankcts").value,
      scodeafp: this.itemForm.get("scodeafp").value,
      ssalarycurrency: this.itemForm.get("ssalarycurrency").value,
      sctscurrency: this.itemForm.get("sctscurrency").value,
      scodbankcts: this.itemForm.get("scodbankcts").value,
      sctsaccount: this.itemForm.get("sctsaccount").value,
      sdoctypebcp: this.itemForm.get("sdoctypebcp").value,
      bintegralremuneration: this.itemForm.get("bintegralremuneration").value,
      bnodomiciliado: this.itemForm.get("bnodomiciliado").value,
      stypesalaryaccount: this.itemForm.get("stypesalaryaccount").value,
      bfifthdiscount: this.itemForm.get("bfifthdiscount").value,
      bafpmixed: this.itemForm.get("bafpmixed").value,
      dincomecountry: this.itemForm.get("dincomecountry").value != "" ? _moment(this.itemForm.get("dincomecountry").value).format(
        "DD/MM/YYYY" 
      ) : "",
      scuspp: this.itemForm.get("scuspp").value,
      dendposition: this.itemForm.get("dendposition").value != "" ? _moment(this.itemForm.get("dendposition").value).format(
        "DD/MM/YYYY"
      ) : "",
      dstartposition: this.itemForm.get("dstartposition").value != "" ? _moment(this.itemForm.get("dstartposition").value).format(
        "DD/MM/YYYY"
      ) : "",
     };
     return payload;
  }

  SendNotification() {
    const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    const idUser: number = storage.id;
    var _notification = {
      idEvaluation: this.idEvaluation,
      idPostulant: idUser,
      postulantType: 'EXTERNA',
      level: 2,
      completeName: this.person.firstName + ' ' + this.person.lastName + ' ' + this.person.motherLastName
    };
    this.notificationService.AddNotificationFichaPersonal(_notification).subscribe(res => {
      
    });
  }
}
