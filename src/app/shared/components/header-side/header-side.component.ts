import { Component, OnInit, EventEmitter, Input, ViewChildren  , Output, Renderer2 } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { LayoutService } from '../../services/layout.service';
import { TranslateService } from '@ngx-translate/core';
import { JwtAuthService } from '../../services/auth/jwt-auth.service';
import { EgretNotifications2Component } from '../egret-notifications2/egret-notifications2.component';
import { LocalStoreService } from '@app/shared/services/local-store.service';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SendRecognitionComponent } from '@app/modules/support/page/send-recognition/send-recognition.component';
import { RecruitMentPersonnelService } from '@app/data/service/recruitment-personnel.service';
import { RecognitionService } from '@app/data/service/recognition.service';
import { Router } from '@angular/router';
import { NotificationService } from '@app/data/service/notification.service';
import { User } from '@app/shared/models/user.model';
import { Observable } from 'rxjs';
import { ChangeMyPasswordComponent } from '@app/modules/support/page/change-my-password/change-my-password.component';




@Component({
  selector: 'app-header-side',
  templateUrl: './header-side.template.html',
  styleUrls: ['./header-side.component.scss'],
  providers: [DatePipe]

})
export class HeaderSideComponent implements OnInit {
  @Input() notificPanel;
  @ViewChildren(EgretNotifications2Component) noti;
  public availableLangs = [{
    name: 'EN',
    code: 'en',
    flag: 'flag-icon-us'
  }, {
    name: 'ES',
    code: 'es',
    flag: 'flag-icon-es'
  }];
  currentLang = this.availableLangs[0];

  public flecha = true;
  public egretThemes;
  public layoutConf: any;
  displayNameUser:'';
  APP_USER = "GRUPOFE_USER";
  today= new Date();
  currentDay = '';
  urlPhotoCompany='';
  urlPhotoUser='';

  count: number = 0;
  messages: Notification[];
  countNotification: number = 0;
  user: User;
  
  public unviewed_count : Observable<string>;

  constructor(
    private themeService: ThemeService,
    private layout: LayoutService,
    public translate: TranslateService,
    private renderer: Renderer2,
    public jwtAuth: JwtAuthService,
    private ls: LocalStoreService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    public _service: RecruitMentPersonnelService,
    private _recognitionService: RecognitionService,
    private _router: Router,
    private notificationService: NotificationService
  ) {
    this.user = JSON.parse(localStorage.getItem('GRUPOFE_USER'));
  }
  ngOnInit() {
    var screenWidth = window.innerWidth;
    
    this.flecha = window.innerWidth > 500;

    this.unviewed_count = this.notificationService.getUnviewedCountGlobal();
    this.getList();
    this.egretThemes = this.themeService.egretThemes;
    this.layoutConf = this.layout.layoutConf;
    this.translate.use(this.currentLang.code);
    this.displayNameUser = this.getUser().displayName;
    this.urlPhotoCompany = this.getUser().urlPhotoCompany;
    this.urlPhotoUser = this.getUser().urlPhotoUser;

    this.currentDay = this.datePipe.transform(this.today, 'dd/MM/yyyy');
    this.loadBandeja();
    this.notificationService.emNotifica.subscribe( (valor) => {      
      // Paulo Hub
      
      
      this.countNotifications();
    }
    );
    
  }
  getUser() {
    return this.ls.getItem(this.APP_USER);
  }

  getList(): void {
    const storage = JSON.parse(localStorage.getItem('GRUPOFE_USER'));
    const idUser: number = storage.id;
    this._recognitionService.getListRecognition(45, idUser).subscribe(resp => {
      this.count = resp.length;
      
    })
  }

  loadBandeja() {
    this.notificationService.getBandeja(this.user.id).subscribe((res) => {
      this.messages = res.data;
      
      this.countNotification = res.data.filter(i => i.viewed== false).length;
      
      this.notificationService.setUnviewedCountGlobal(this.countNotification.toString());
      this.unviewed_count = this.notificationService.getUnviewedCountGlobal();
    });
  }

  countNotifications() {
    this.notificationService.getQuantityNotifications(this.user.id).subscribe((res) => {
      this.countNotification = res.data;
      this.notificationService.setUnviewedCountGlobal(this.countNotification.toString());
      this.unviewed_count = this.notificationService.getUnviewedCountGlobal();
    });
   
  }
 
  setLang(lng) {
    this.currentLang = lng;
    this.translate.use(lng.code);
  }
  changeTheme(theme) {
    // this.themeService.changeTheme(theme);
  }
  toggleNotific() {
    this.notificPanel.toggle();
  }
  toggleSidenav() {
    if (this.layoutConf.sidebarStyle === 'closed') {
      return this.layout.publishLayoutChange({
        sidebarStyle: 'full'
      });
    }
    this.layout.publishLayoutChange({
      sidebarStyle: 'closed'
    });
  }

  toggleCollapse() {
    // compact --> full
    if (this.layoutConf.sidebarStyle === 'compact') {
      return this.layout.publishLayoutChange({
        sidebarStyle: 'full',
        sidebarCompactToggle: false
      }, {transitionClass: true});
    }
    // * --> compact
    this.layout.publishLayoutChange({
      sidebarStyle: 'compact',
      sidebarCompactToggle: true
    }, {transitionClass: true});

  }

  onSearch(e) {
    
  }
  sendrecognition(){
    let title ="Enviar Reconocimiento";
    let dialogRef: MatDialogRef<any> = this.dialog.open(SendRecognitionComponent, {
      width: "720px",
      disableClose: true,
      data: { title: title},
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res === true) {
        this.getList();
      }
    });
  }

  showbandeja(): void {
    this._router.navigate(['humanmanagement/notification'], {
      skipLocationChange: true
    })
  }

  showprofile(): void {
    const storage = JSON.parse(localStorage.getItem("GRUPOFE_USER"));
    const id_employee: number = Number(storage.nid_employee);
    this._router.navigate(['humanmanagement/profile',id_employee], {
      skipLocationChange: true
    })
  }

  changePassword(){
    let title ="Cambiar Contraseña";
    let dialogRef: MatDialogRef<any> = this.dialog.open(ChangeMyPasswordComponent, {
      width: "400px",
      disableClose: true,
      data: { title: title},
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res === true) {
        this.getList();
      }
    });

  }


}
