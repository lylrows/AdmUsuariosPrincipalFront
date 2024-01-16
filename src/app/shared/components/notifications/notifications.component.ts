import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { Router, NavigationEnd } from '@angular/router';
import { RecognitionService } from '@app/data/service/recognition.service';
import { RecruitMentPersonnelService } from '@app/data/service/recruitment-personnel.service';
import { RecognitionModelComponent } from '../recognition-model/recognition-model.component';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html'
})
export class NotificationsComponent implements OnInit {
  @Input() notificPanel;
  options = '';
  isRead: boolean = false;
  recognitions: any [] = [];
  count: number = 0;
  // Dummy notifications
  

  constructor(
    private router: Router,
    private _recognitionService: RecognitionService,
    public _dialog: MatDialog,
    public _service:  RecruitMentPersonnelService
    ) {}

  ngOnInit() {
    this._service.disparador.subscribe(resp => {
      
      this.getList(45);
    })
    this.getList(45);
    this.options = 'Mostrar leídos';
    this.router.events.subscribe((routeChange) => {
        if (routeChange instanceof NavigationEnd) {
          this.notificPanel.close();
        }
    });
  }

  getList(Id: number): void {
    const storage = JSON.parse(localStorage.getItem('GRUPOFE_USER'));
    const idUser: number = storage.id;
    this._recognitionService.getListRecognition(Id, idUser).subscribe(resp => {
      this.recognitions = resp;
      this.count = this.recognitions.length;
    })
  }
  clearAll(e) {
    e.preventDefault();
    this.isRead = !this.isRead;
    if (this.isRead) {
      this.getList(44)
    } else {
      this.getList(45)
    }
    
    this.isRead === true ? this.options = 'Mostrar No Leídos' : this.options = 'Mostrar Leídos';
    
  }

  openModel(item): void {
    const config = new MatDialogConfig();
    config.width = '820px',
    config.height = '460px'
    config.disableClose = true,
    config.data = {item}

    const modal = this._dialog.open(RecognitionModelComponent, config);

    modal.afterClosed().subscribe(resp => {
      if (resp === true) {
        this._recognitionService.changeState(item.nid_recognition).subscribe(resp => {
          this.getList(45);
          this.options = 'Mostrar Leídos';
        })
      }
    })
  }

  hide(item): void {
    this._recognitionService.delete(item.nid_recognition).subscribe(resp => {
      if (this.isRead) {
        this.getList(44)
      } else {
        this.getList(45)
      }
    })
  }
}
