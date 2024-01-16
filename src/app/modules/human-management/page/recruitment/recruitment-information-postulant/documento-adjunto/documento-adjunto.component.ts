import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { EvaluationPostulantInternalService } from '@app/data/service/evaluation-postulant-internal.service';
import { UtilService } from "@app/data/service/util.service";
import { AppConfirmService } from '@app/shared/services/app-confirm/app-confirm.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-documento-adjunto',
  templateUrl: './documento-adjunto.component.html',
  styleUrls: ['./documento-adjunto.component.scss']
})
export class DocumentoAdjuntoComponent implements OnInit {
  @Input() path_file: string;
  @Input() name_file: string;
  @Input() type_file: string;
  @Input() path_template: string;
  @Input() idfile: number;
  @Input() name_toolTip: string;
  @Input() disabled_row: boolean;
  @Output() updateDocument = new EventEmitter();
  archivo: any;
  filename: any;
  archivoExiste: boolean = false;
  titleDescargar: string = "";
  validatefile:boolean = false;
  toolTipAdjunto: string = 'Adjuntar Documento';
  constructor(private _serviceUtil: UtilService,
    private evaluationInternalService:EvaluationPostulantInternalService,
    private confirmService: AppConfirmService, private snack: MatSnackBar) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.path_file && changes.path_file.currentValue != undefined) {
      
      if (this.name_file != "") this.archivoExiste = true;      
    }

    if (changes.name_toolTip && changes.name_toolTip.currentValue != undefined) {
      
      if (this.name_toolTip != null || typeof this.name_toolTip != 'undefined' || this.name_toolTip != '') {
          this.toolTipAdjunto = this.name_toolTip;
      }
    }
    if (changes.path_file && changes.path_file.currentValue != undefined) {
      this.filename = this.name_file;
      this.titleDescargar = `Descargar Documento: ${this.filename}`;
    }
  }

  changeFile(event) {
    var archivo = event.target.files[0];
    this.archivo = archivo;
   
    this.filename = this.archivo.name;
      
    const _ext = this.GetFileExtension(this.filename);
    this.validatefile = _ext == 'pdf';
    if(this.validatefile === true){
      this.archivoExiste = true;
      this.titleDescargar = `Descargar Documento: ${this.filename}`;
      const reader = new FileReader();
      reader.readAsDataURL(archivo);
      reader.onload = () => {
          
          this.updateDocument.emit( {
            archivo: this.archivo,
            archivo_base64: reader.result,
            file_name: this.filename,
            extension: _ext,
            tipo_archivo: this.type_file
          });
          this.archivoExiste = true;
      };
    }
    else{
      this.snack.open("Solo se permiten archivos PDF.", "OK", { duration: 4000 });
        event.target.value = null;
        this.archivoExiste = false;
    }
  }

  deleteFile(file) {
    file.value = '';
    if(this.idfile > 0){
      this.confirmService
      .confirm({
        title: "Confirmación",
        message: "¿Esta seguro de eliminar el archivo?",
      })
      .subscribe((result) => {
        if (result) {
          this.archivo = null;
          this.filename = "";
      
          this.updateDocument.emit( {
            archivo: null,
            archivo_base64: null,
            file_name: null,
            extension: null,
            tipo_archivo: this.type_file,
            idfile:this.idfile
          });
          this.archivoExiste = false;
      
          this.evaluationInternalService.InformationFilesDelete(this.idfile).subscribe(resp => {           
            this.updateDocument.emit( {
              archivo: null,
              archivo_base64: null,
              file_name: null,
              extension: null,
              tipo_archivo: this.type_file,
              idfile:this.idfile
            });
            this.archivoExiste = false;
          })
        }
      });
    } else {
      this.updateDocument.emit( {
        archivo: null,
        archivo_base64: null,
        file_name: null,
        extension: null,
        tipo_archivo: this.type_file,
        idfile:this.idfile
      });
      this.archivoExiste = false;
    }
    
  }

  GetFileExtension(filename: string) {
    const _lastIndex = filename.lastIndexOf('.');
    const _ext = filename.substring(_lastIndex + 1);
    return _ext;
  };

  downloadDocument() {
    
    if (this.archivo == null) {
      const _ext = this.GetFileExtension(this.filename);
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
      }
  
      this._serviceUtil.downloadDocumentByPath({
        path_file: this.path_file
      }).subscribe(res => {
            
            const b64Data = res.data;          
            const blob = this.b64toBlob(b64Data, contentType);          
            const blobUrl = URL.createObjectURL(blob);          
            const _afile = document.getElementById('afile') as HTMLAnchorElement;
            _afile.href = blobUrl;
            _afile.download = this.filename;
            _afile.click();
            window.URL.revokeObjectURL(blobUrl);
  
      });
    }else {
      
      const blobUrl = URL.createObjectURL(this.archivo);          
      const _afile = document.getElementById('afile') as HTMLAnchorElement;
      _afile.href = blobUrl;
      _afile.download = this.filename;
      _afile.click();
      window.URL.revokeObjectURL(blobUrl);
    }    
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
