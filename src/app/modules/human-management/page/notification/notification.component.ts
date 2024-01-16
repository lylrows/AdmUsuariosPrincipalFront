import { User } from './../../../../shared/models/user.model';
import { MatSnackBar } from "@angular/material/snack-bar";
import { NotificationService } from "./../../../../data/service/notification.service";
import { Notification} from "./../../../../data/schema/notificaction";

import { MatDialog } from "@angular/material/dialog";
import { MediaObserver, MediaChange } from "@angular/flex-layout";
import { Router } from "@angular/router";
import { MatSidenav } from "@angular/material/sidenav";
import { Subscription } from "rxjs";
import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup } from '@angular/forms';
import { date } from 'ngx-custom-validators/src/app/date/validator';

export enum action {
   notificaciones = "notificaciones",
   reconocimientos = "reconocimientos",
   archivados = "archivados",
   favoritos = "favoritos"
}

@Component({
  selector: "app-notification",
  templateUrl: "notification.component.html",
  styleUrls: ["notification.component.scss"],
})
export class NotificationComponent implements OnInit, OnDestroy {
  isMobile;
  screenSizeWatcher: Subscription;
  isSidenavOpen: Boolean = true;
  selectToggleFlag = false;
  @ViewChild(MatSidenav) private sideNav: MatSidenav;
  messages: Notification[];
  accion: string;
  user: User;
  title: string;

  constructor(
    private router: Router,
    private mediaObserver: MediaObserver,
    public composeDialog: MatDialog,
    private notificationService: NotificationService,
    private snack: MatSnackBar,
    private _fs: FormBuilder
  ) {
    this.initForm();
    this.accion = action.notificaciones;
    this.user = JSON.parse(localStorage.getItem('GRUPOFE_USER'));
  }
  formFilter: FormGroup;

  initForm(): void {
    let currentDate = new Date();
    let finalyIssueDate = new Date(currentDate.getFullYear(),currentDate.getMonth(), currentDate.getDate());

    currentDate.setDate(currentDate.getDate() - 30);
    let initialIssueDate = new Date(currentDate.getFullYear(),currentDate.getMonth(), currentDate.getDate());

    this.formFilter = this._fs.group({
      
      semisor: [''],
      ssubject: [''],
      sstartdate: [initialIssueDate],
      senddate: [finalyIssueDate],
      niduser:[0]
      
    })
  }

  ngOnInit() {
    this.messages =[];
    this.inboxSideNavInit();
    this.loadBandeja();
    this.notificationService.emNotifica.subscribe( (valor) => {      
      
      this.Filter();
    }
    );
  }

  ngOnDestroy(): void {
    if (this.screenSizeWatcher) {
      this.screenSizeWatcher.unsubscribe();
    }
  }
  selectToggleAll() {
    this.selectToggleFlag = !this.selectToggleFlag;
    
    this.messages.forEach((msg) => {
      msg.selected = this.selectToggleFlag;
    });
  }

  stopProp(e) {
    
    e.stopPropagation();
  }

  updateSidenav() {
    let self = this;
    setTimeout(() => {
      self.isSidenavOpen = !self.isMobile;
      self.sideNav.mode = self.isMobile ? "over" : "side";
    });
  }
  inboxSideNavInit() {
    this.isMobile =
      this.mediaObserver.isActive("xs") || this.mediaObserver.isActive("sm");
    this.updateSidenav();
    this.screenSizeWatcher = this.mediaObserver.media$.subscribe(
      (change: MediaChange) => {
        this.isMobile = change.mqAlias == "xs" || change.mqAlias == "sm";
        this.updateSidenav();
      }
    );
  }

  loadBandeja() {
    this.accion = action.notificaciones;
    
    this.notificationService.getBandeja(this.user.id).subscribe((res) => {
      
      this.messages = res.data;
    });
  }

  loadArchived() {
    this.accion = action.archivados;
    
    this.notificationService.getArchived(this.user.id).subscribe((res) => {
      this.messages = res.data;
    });
  }

  update(item, event) {
    
    event.stopPropagation();
    
    let favorito: boolean = false;
    if ( item.favorite ) {
      favorito = false;
    } else {
      favorito = true;
    }

    item.favorite = favorito;
    item.dateUpdate = new Date();
    item.idUserUpdate = 1;
    
    this.notificationService.archive(item).subscribe(res => {
      if (this.accion == action.notificaciones) {
        this.loadBandeja();
      } else if (this.accion == action.favoritos) {
        this.loadFavorite();
      } else if (this.accion == action.archivados) {
        this.loadArchived();
      }
    });
  }
  

  loadRecognition() {
    this.accion = action.reconocimientos;
    this.notificationService.getRecognition(this.user.id).subscribe((res) => {
      this.messages = res.data;
    });
  }

  loadFavorite() {
    this.accion = action.favoritos;
    
    this.notificationService.getBandejaFavorite(this.user.id).subscribe((res) => {
      this.messages = res.data;
    });
  }

  archive(item) {
    item.active = false;
    item.dateUpdate = new Date();
    item.idUserUpdate = 1;
    this.notificationService.archive(item).subscribe((res) => {
      if (res.stateCode == 200) {
        this.snack.open("Notificación archivada!", "OK", { duration: 4000 });
        this.loadBandeja();
      } else {
        this.snack.open(res.messageError[0], "Error", { duration: 4000 });
      }
    });
  }

  archiveList() {
    let dto = this.messages.filter(x => x.selected == true);
    this.notificationService.archiveList(dto).subscribe((res) => {
      if (res.stateCode == 200) {
        this.snack.open("Notificaciones archivada!", "OK", { duration: 4000 });
        this.loadBandeja();
      } else {
        this.snack.open(res.messageError[0], "Error", { duration: 4000 });
      }
    });
  }

  
  unarchiveList() {
    
    let dto = this.messages.filter(x => x.selected == true);
    this.notificationService.unarchiveList(dto).subscribe((res) => {
      if (res.stateCode == 200) {
        this.snack.open("Notificaciones desarchivadas!", "OK", { duration: 4000 });
        this.loadArchived();
      } else {
        this.snack.open(res.messageError[0], "Error", { duration: 4000 });
      }
    });
  }
  fnopenmessage(item){
    if (item.viewed == false){
      this.notificationService.addviewed(item).subscribe((res) => {
        if (res.stateCode == 200) {
          item.viewed = true;
          this.notificationService.setUnviewedCountGlobal(res.data.noViewedMessages);
        } else {
          this.snack.open(res.messageError[0], "Error", { duration: 4000 });
        }
      });
    }
  }
  resetFilter(){

    let currentDate = new Date();
    let finalyIssueDate = new Date(currentDate.getFullYear(),currentDate.getMonth(), currentDate.getDate());

    currentDate.setDate(currentDate.getDate() - 30);
    let initialIssueDate = new Date(currentDate.getFullYear(),currentDate.getMonth(), currentDate.getDate());

    this.formFilter.reset({
      semisor: '',
      ssubject: '',
      sstartdate: [initialIssueDate],
      senddate: [finalyIssueDate],
      niduser:[0]
    });

    this.formFilter.get('sstartdate').setValue(initialIssueDate);
    this.formFilter.get('senddate').setValue(finalyIssueDate);
    
    this.Filter();
  }
  Filter(){
    this.accion = action.notificaciones;
    this.formFilter.get('niduser').setValue(this.user.id);
    
    this.notificationService.getBandejaFilter(this.formFilter.value).subscribe((res) => {
      
      this.messages = res.data;
    });

  }
  
  downLoad(archivo, contentType, name) {
    let link = document.createElement("a");
    let blobArchivo = this.base64ToBlob(archivo, contentType);
    let blob = new Blob([blobArchivo], { type: contentType });
    link.href = URL.createObjectURL(blob);
    link.download = name;
    link.click();
  }

  public base64ToBlob(b64Data, contentType = "", sliceSize = 512) {
    b64Data = b64Data.replace(/\s/g, ""); 
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

  downloadFilePath(path: string) {
    this.notificationService.getdocumentbypath(path).subscribe(
      (res: any) => {
       
       try {
       const contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
       const b64Data = res;
       
       const blob = this.base64ToBlob(b64Data, contentType);
       
       const blobUrl = URL.createObjectURL(blob);
       
       const _afile = document.getElementById('afile') as HTMLAnchorElement;
       _afile.href = blobUrl;
       _afile.download = 'Reporte de Postulantes Interno.xlsx'
       _afile.click();
       window.URL.revokeObjectURL(blobUrl);
     } catch (e) {
     }
   }, (error: any) => {

     var obj = error;
   }
 );
  }
}
