import { OrganizationChartModule } from 'primeng/organizationchart';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import { MatChipsModule } from '@angular/material/chips';
import { DialogCargoComponent } from './page/crud-cargo/dialog-cargo/dialog-cargo.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { DialogAreaComponent } from './page/crud-areas/dialog-organigram/dialog-areas.component';
import { CrudAreaComponent } from './page/crud-areas/crud-area.component';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { MatMenuModule } from "@angular/material/menu";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatDialogModule } from '@angular/material/dialog';

import { SupportRoutingModule } from "./support.routing";
import { ContactComponent } from "./page/contact/contact.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { CrudCargoComponent } from "./page/crud-cargo/crud-cargo.component";
import { CrudHomeSliderComponent } from "./page/crud-home-slider/crud-home-slider.component";
import { CrudHomeDocumentosComponent } from "./page/crud-home-documentos/crud-home-documentos.component";
import { DialogSliderComponent } from "./page/crud-home-slider/dialog-slider/dialog-slider.component";
import { DialogDocumentosComponent } from "./page/crud-home-documentos/dialog-documentos/dialog-documentos.component";
import { CrudHomeOrganizationComponent } from "./page/crud-home-organization/crud-home-organization.component";
import { DialogOrganizationComponent } from "./page/crud-home-organization/dialog-organization/dialog-organization.component";
import { DialogContactComponent } from "./page/contact/dialog-contact/dialog-contact.component";
import { DialogUserComponent } from "./page/crud-user/dialog-user/dialog-user.component";
import { CrudUserComponent } from "./page/crud-user/crud-user.component";
import { CrudempleadoComponent } from "./page/crudempleado/crudempleado.component";
import { DialogEmpleadoComponent } from './page/crudempleado/dialog-empleado/dialog-empleado.component';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule,MatPaginatorIntl } from '@angular/material/paginator';
import { MatDividerModule } from "@angular/material/divider";
import { DialogUserResetPasswordComponent } from "./page/crud-user/dialog-user/dialog-resetpassword.component";
import { MatTabsModule } from '@angular/material/tabs';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { QuillModule } from 'ngx-quill';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatExpansionModule} from '@angular/material/expansion';
import { getSpanishPaginatorIntl } from '../../shared/mat-table/paginator-intl';
import {MatTooltipModule} from '@angular/material/tooltip';
import { DialogCategoryComponent } from './page/crud-home-documentos/dialog-documentos/dialog-category/dialog-category.component';
import { SendRecognitionComponent } from './page/send-recognition/send-recognition.component';
import { CrudNotificationComponent } from './page/crud-notification/crud-notification.component';
import { DialogNotificationComponent } from './page/crud-notification/dialog-notification/dialog-notification.component';
import { MatRadioModule } from '@angular/material/radio';
import { CrudPostJobOfferComponent } from './page/crud-postjoboffer/crud-postjoboffer.component';
import { CrudBandboxComponent } from './page/crud-bandbox/crud-bandbox.component';
import { DialogBandBoxComponent } from './page/crud-bandbox/dialog-band-box/dialog-band-box.component';
import { CrudTypeStaffRequestComponent } from './page/crud-type-staff-request/crud-type-staff-request.component';
import { DialogTypeStaffRequestComponent } from './page/crud-type-staff-request/dialog-type-staff-request/dialog-type-staff-request.component';
import { DialogAddApproverComponent } from './page/crud-type-staff-request/dialog-add-approver/dialog-add-approver.component';
import { ChangeMyPasswordComponent } from './page/change-my-password/change-my-password.component';
import { SharedDirectivesModule } from './../../shared/directives/shared-directives.module';
import { NumericDirective } from '@app/shared/directives/numeric.directive';
import { CrudNineboxComponent } from './page/crud-ninebox/crud-ninebox.component';
import { DialogNineboxComponent } from './page/crud-ninebox/dialog-ninebox/dialog-ninebox.component';

import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@NgModule({
  declarations: [
    ContactComponent,
    CrudAreaComponent,
    DialogAreaComponent,
    CrudCargoComponent,
    DialogCargoComponent,
    CrudHomeSliderComponent,
    CrudHomeDocumentosComponent,
    DialogSliderComponent,
    DialogDocumentosComponent,
    CrudHomeOrganizationComponent,
    DialogOrganizationComponent,
    DialogContactComponent,
    DialogUserComponent,
    CrudUserComponent,
    CrudempleadoComponent,
    DialogEmpleadoComponent,
    DialogUserResetPasswordComponent,
    DialogCategoryComponent,
    SendRecognitionComponent,
    CrudNotificationComponent,
    DialogNotificationComponent,
    CrudPostJobOfferComponent,
    CrudBandboxComponent,
    DialogBandBoxComponent,
    CrudTypeStaffRequestComponent,
    DialogTypeStaffRequestComponent,
    DialogAddApproverComponent,
    ChangeMyPasswordComponent,
    NumericDirective,
    CrudNineboxComponent,
    DialogNineboxComponent
  ],
  imports: [
  SupportRoutingModule,
    ReactiveFormsModule,
    CommonModule,
    MatMenuModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
    NgxDatatableModule,
    MatInputModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatCheckboxModule,
    MatChipsModule,
    MatTableModule,
    MatPaginatorModule,
    MatDividerModule,
    ReactiveFormsModule,
    FormsModule,
    MatTabsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatStepperModule,
    MatExpansionModule,
    MatDialogModule,
    QuillModule.forRoot(),
    MatTooltipModule,
    MatRadioModule,
    SharedDirectivesModule,
    NgxMatSelectSearchModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useValue: getSpanishPaginatorIntl() }
  ]
})
export class SupportModule {}
