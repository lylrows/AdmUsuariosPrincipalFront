import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { InformationFilesModel } from "@app/data/schema/files/informationfiles.model";
import { InformationPostulantService } from "@app/data/service/information-postulant.service";
import { MastertableService } from "@app/data/service/mastertable.service";

@Component({
  selector: "app-information-experience",
  templateUrl: "./information-experience.component.html",
  styleUrls: ["./information-experience.component.scss"],
})
export class InformationExperienceComponent implements OnInit {
  @Input() infoWork: any;
  @Input() idPostulant: number;
  @Input() idEvaluation: number;
  @Input() isReadOnly: boolean = false;
  @Output() afterchangerow = new EventEmitter();

  listFiles: any[] = [];
  param: InformationFilesModel = new InformationFilesModel();
  tipoFile_DocumentoSustentoWork: string = 'DOCUMENTO_SUSTENTO_WORK';

  index: number;
  filaAgregadaModificada: boolean = false;
  rowSelected: any;
  responsive = false;
  screenWidth: number;

  constructor(
    private service: InformationPostulantService,
    private snack: MatSnackBar,
    private masterService: MastertableService
  ) { 
    this.screenWidth = window.innerWidth;
    if (this.screenWidth < 600){
      this.responsive = true; 
    } 
  }

  editorOptions = {
    toolbar: [[{ list: "bullet" }], ["bold", "italic", "underline"]],
  };

  ngOnInit(): void {
    
    this.loadInfoWork();
  }
  
  ngAfterViewChecked() {
    if(this.filaAgregadaModificada) {
        
        if (this.index == -1) {
            const _cantidad = this.infoWork.length;
            let  _element = <HTMLElement>document.querySelectorAll('.init-edit-work')[_cantidad - 1];
            _element.click();                
        } else {
            let  _element = <HTMLElement>document.querySelectorAll('.init-edit-work')[this.index];
            _element.click();     
        }
        this.filaAgregadaModificada = false;
    }
  }

  onRowEditSave(item, action = "", index) {    
    
    if (item.company == "" ||
        item.lastPosition == "" ||
        item.reference == "" ||
        item.mainFunction == "" ||
        item.dateStart == "" ||
        item.dateFinish == ""){
          this.snack.open("Debe completar los datos obligatorios.", "OK", { duration: 4000 });
          this.filaAgregadaModificada = true;
          this.index = index;
          return;
    }
    if (this.listFiles.length === 0 && action != 'Eliminar') {
      this.snack.open("Debe adjuntar el documento solicitado.", "OK", { duration: 4000 });
      this.filaAgregadaModificada = true;
      this.listFiles = [];
      this.index = index;
    } else  {
      this.infoWork[index].disabled = true;
      item.salary = parseFloat(item.salary);
      this.service.saveinformationwork(item).subscribe((res) => {
        if (res.stateCode == 200) {
          this.param.nidreferences = res.data.id;
          if (this.param.nidreferences > 0) {
            this.service.saveinformationfiles(this.param).subscribe(res => {
              if (res.stateCode == 200) {
                if (action === '') {
                  this.snack.open("Grabado correctamente", "OK", { duration: 4000 });
                } else {
                  this.snack.open("Eliminado correctamente", "OK", { duration: 4000 });
                }
                this.listFiles = [];
                this.param = new InformationFilesModel();
                this.loadInfoWork();
              }
            });
          }
          else {
            if (action === '') {
              this.snack.open("Grabado correctamente", "OK", { duration: 4000 });
            } else {
              this.snack.open("Eliminado correctamente", "OK", { duration: 4000 });
            }
            this.loadInfoWork();
          }
        }
      });
    }    
  }

  loadInfoWork() {
    this.service.getInfoWork(this.idPostulant, this.idEvaluation).subscribe((res) => {
      this.infoWork = res.data;
      this.infoWork.map(x => {
        x.disabled = true;
        x.tryToSendAndShowError = typeof x.tryToSendAndShowError == 'undefined' ? false : x.tryToSendAndShowError;
     });
     this.afterchangerow.emit(this.infoWork);
    });
  }

  loadTypesInstruction() {
    this.masterService.getByIdFather(932).subscribe((res) => {
      this.infoWork = res;
    });
  }

  valideKeyAmount(evt, item) {
    
    var code = evt.which ? evt.which : evt.keyCode;
    var salario = item.salary;
    if(salario.indexOf('.') > -1 && code == 46) return false;
    if (code == 8) {
        
        return true;
    } else if (code >= 48 && code <= 57 || code == 46) {
        
        return true;
    } else {
        
        return false;
    }
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

  addRow() {
    const obj: any = {
      company: "",
      id: 0,
      lastPosition: "",
      dateStart: "",
      dateFinish: "",
      IdPostulant: this.idPostulant,
      mainFunction: "",
      disabled:true,
      informationFile: null,
      idEvaluation: this.idEvaluation
    };
    this.infoWork.push(obj);
    this.filaAgregadaModificada = true;
    this.index = -1;
  }

  deleteRow(index) {
    this.infoWork[index].company = "";
    this.param = new InformationFilesModel();
    this.onRowEditSave(this.infoWork[index], "Eliminar", index);
  }

  onRowEditCancel(item, index) {
    this.infoWork[index].disabled = true;
    if (item.id === 0) {
      this.infoWork.splice(index, 1)
      this.cloneExperience = null;
    } else {
      this.infoWork[index] = this.cloneExperience;
      this.cloneExperience = null;
    }
  }

  onRowEditInit(item, index) {
    
    if (item.informationFile !== null) {
        this.listFiles.push({
            tipo_archivo: item.informationFile.stypeFile,
            archivo_base64: '',
            filename: item.informationFile.snamefile,
            extension: 'pdf'
        });
    }
    this.rowSelected = Object.assign({}, item);    
    this.cloneExperience = { ...item };
    this.infoWork[index].disabled = false;
    this.infoWork[index].tryToSendAndShowError = false;
  }

  CargarDocumento(eventoRetorno, idrefences,index) {
    if(eventoRetorno.file_name === null){
      this.listFiles = [];
    }
    if (this.listFiles == null || typeof this.listFiles == 'undefined') this.listFiles = [];
    const _indexExistente = this.listFiles.findIndex(x => x.tipo_archivo == eventoRetorno.tipo_archivo);
    if (_indexExistente > -1) this.listFiles.splice(_indexExistente, 1);

    if (eventoRetorno.archivo != null) {
      this.listFiles.push({
        tipo_archivo: eventoRetorno.tipo_archivo,
        archivo_base64: eventoRetorno.archivo_base64,
        filename: eventoRetorno.file_name,
        extension: eventoRetorno.extension
      });
    }
    else{
      this.infoWork[index].informationFile.path_complete = null;
      this.infoWork[index].informationFile.snamefile = null;
  }
    this.param.nidinformationextra = this.idPostulant;
    this.param.nidreferences = idrefences;
    this.param.snamefile = eventoRetorno.file_name;
    this.param.ntypefile = 5;
    this.param.bactive = true;
    this.param.base64 = eventoRetorno.archivo_base64;
    this.param.stypeFile = eventoRetorno.tipo_archivo;
    this.param.path_complete = '';
  }
  cloneExperience = null;

  isDisabledRow(row: any){
    if (row == null || typeof row == 'undefined') return true;
    if (row.disabled == null || typeof row.disabled == 'undefined') return true;
    return row.disabled;
  }

  validateShowErrorFile(row: any){
    if (row == null || typeof row == 'undefined') return false;
    if (row.tryToSendAndShowError == null || typeof row.tryToSendAndShowError == 'undefined') return false;
    return row.tryToSendAndShowError;
  }

  soloDecimal(event: any) {
    const pattern = /[0-9\+\.\ ]/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}

