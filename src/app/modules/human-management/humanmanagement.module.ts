import { RecruitmentLoadMasiveComponent } from './page/recruitment/recruitment-load-masive/recruitment-load-masive.component';
import { EvaluationsListComponent } from './page/recruitment/recruitment-internal/evaluations-list/evaluations-list.component';
import { RecruitmentEvaluationsListComponent } from './page/recruitment/recruitment-external/recruitment-evaluations-list/recruitment-evaluations-list.component';
import { ChartModule } from 'primeng/chart';
import { CuartaFaseInternalComponent } from './page/recruitment/recruitment-internal/evaluation-postulant-fases/cuarta-fase-internal/cuarta-fase-internal.component';
import { PrimeraFaseInternalComponent } from './page/recruitment/recruitment-internal/evaluation-postulant-fases/primera-fase-internal/primera-fase-internal.component';
import { EvaluationPostulantsComponent } from './page/recruitment/recruitment-internal/evaluation-postulants/evaluation-postulants.component';
import { PostulantsJobComponent } from './page/recruitment/recruitment-internal/postulants-job/postulants-job.component';
import { JobListComponent } from './page/job-vacancies/job-list/job-list.component';
import { RecruitmentAddInternalComponent } from './page/recruitment/recruitment-add-internal/recruitment-add-internal.component';
import { RecruitmentInformationPostulantComponent } from './page/recruitment/recruitment-information-postulant/recruitment-information-postulant.component';
import { EvaluationRatingComponent } from './page/recruitment/recruitment-evaluation-postulant/evaluation-rating/evaluation-rating.component';
import { RecruitmentEvaluationPostulantComponent } from './page/recruitment/recruitment-evaluation-postulant/recruitment-evaluation-postulant.component';
import { InformacionPostulanteComponent } from './page/recruitment/recruitment-evaluation-postulant/informacion-postulante/informacion-postulante.component';
import { SegundaFaseComponent } from './page/recruitment/recruitment-evaluation-postulant/segunda-fase/segunda-fase.component';
import { PrimeraFaseComponent } from './page/recruitment/recruitment-evaluation-postulant/primera-fase/primera-fase.component';
import { RecruitmentComponent } from './page/recruitment/recruitment.component';
import { DialogHomeDocument } from './page/home/homedocument.component';
import { DialogHomeCompany } from './page/home/homecompany.component';
import { SharedPipesModule } from "./../../shared/pipes/shared-pipes.module";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { NotificationComponent } from "./page/notification/notification.component";
import { MatDividerModule } from "@angular/material/divider";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatMenuModule } from "@angular/material/menu";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { FlexLayoutModule } from "@angular/flex-layout";
import {MatChipsModule} from '@angular/material/chips';
import {TableModule} from 'primeng/table';

import { OrganizationChartComponent } from "./page/organization-chart/organization-chart.component";
import { PerformanceEvaluationComponent } from "./page/performance-evaluation/performance-evaluation.component";
import { ContactComponent } from "./page/contact/contact.component";

import { QuillModule } from 'ngx-quill';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

// import { SharedModule } from '@shared/shared.module';
import { HumanManagementRoutingModule } from "./humanmanagement.routing";
import { HomeComponent} from "./page/home/home.component";
import { OrganizationChartModule } from "primeng/organizationchart";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatRadioModule } from "@angular/material/radio";
import { MatCarouselModule } from "@ngmodule/material-carousel";
import { SafeHtmlPipe } from "./safe-html.pipe";
import { MatAccordion } from "@angular/material/expansion";
import { MatTabsModule } from "@angular/material/tabs";
import { RecruitmentPersonnelComponent } from "./page/recruitment/recruitment-personnel/recruitment-personnel.component";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { RecruitmentAddComponent } from "./page/recruitment/recruitment-add/recruitment-add.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { RecruitmentDetailComponent } from './page/recruitment/recruitment-detail/recruitment-detail.component';
import { AddCampaignComponent } from './page/performance-evaluation/add-campaign/add-campaign.component';
import { AsignEmployeeComponent } from './page/performance-evaluation/asign-employee/asign-employee.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatTreeModule} from '@angular/material/tree';
import { RecruitmentPostulatComponent } from './page/recruitment/recruitment-external/recruitment-postulants/recruitment-postulants.component';
import { RecruitmentEvaluationComponent } from './page/recruitment/recruitment-external/recruitment-evaluation/recruitment-evaluation.component';
import { TagModule } from 'primeng/tag';
import { CampaignEvaluationComponent } from './page/performance-evaluation/campaign-evaluation/campaign-evaluation.component';
import { CampaignEvaluationDetailComponent } from './page/performance-evaluation/campaign-evaluation-detail/campaign-evaluation-detail.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { EvaluationResumeComponent } from './page/performance-evaluation/evaluation-resume/evaluation-resume.component';
import { TerceraFaseComponent } from './page/recruitment/recruitment-evaluation-postulant/tercera-fase/tercera-fase.component';
import { EvaluationProficiencyComponent } from './page/recruitment/recruitment-evaluation-postulant/evaluation-proficiency/evaluation-proficiency.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import { SolicitudDocumentosComponent } from './page/recruitment/recruitment-evaluation-postulant/solicitud-documentos/solicitud-documentos.component';
import { InformationFamilyComponent } from './page/recruitment/recruitment-information-postulant/information-family/information-family.component';
import { InformationEducationComponent } from './page/recruitment/recruitment-information-postulant/information-education/information-education.component';
import { InformationSkillsComponent } from './page/recruitment/recruitment-information-postulant/information-skills/information-skills.component';
import {RadioButtonModule} from 'primeng/radiobutton';
import {CheckboxModule} from 'primeng/checkbox';
import { SalaryBandComponent } from './page/salary-band/salary-band.component';
import { ProfileComponent } from './page/staff-administration/profile/profile.component';
import { JobDetailComponent } from './page/job-vacancies/job-detail/job-detail.component';
import { JobDetailDialogComponent } from './page/job-vacancies/job-detail/dialog/job-detail-dialog.component';
import { EconomicConditionComponent } from './page/salary-band/economic-condition/economic-condition.component';
import { ModalRequestComponent } from './page/staff-administration/modal-request/modal-request.component';
import { ModalPersonComponent } from './page/staff-administration/request-edit-data/modal-person/modal-person.component';
import { ModalStudyComponent } from './page/staff-administration/request-edit-data/modal-study/modal-study.component';
import { ModalSocialComponent } from './page/staff-administration/request-edit-data/modal-social/modal-social.component';
import { RequestListComponent } from './page/staff-administration/request-list/request-list.component';
import { RequestDetailComponent } from './page/staff-administration/request-list/request-detail/request-detail.component';
import { BadgetResumeComponent } from './page/salary-band/badget-resume/badget-resume.component';
import { EvaluationPostulantFasesComponent } from './page/recruitment/recruitment-internal/evaluation-postulant-fases/evaluation-postulant-fases.component';
import { InformationPostulantInternalComponent } from './page/recruitment/recruitment-internal/evaluation-postulant-fases/information-postulant-internal/information-postulant-internal.component';
import { SegundaFaseInternalComponent } from './page/recruitment/recruitment-internal/evaluation-postulant-fases/segunda-fase-internal/segunda-fase-internal.component';
import { TerceraFaseInternalComponent } from './page/recruitment/recruitment-internal/evaluation-postulant-fases/tercera-fase-internal/tercera-fase-internal.component';
import { EvaluationPositionComponent } from './page/recruitment/recruitment-internal/evaluation-postulant-fases/primera-fase-internal/evaluation-position/evaluation-position.component';
import { EvaluationCurriculumComponent } from './page/recruitment/recruitment-internal/evaluation-postulant-fases/primera-fase-internal/evaluation-curriculum/evaluation-curriculum.component';
import { DropdownModule } from 'primeng/dropdown';
import { EvaluationFortalezasComponent } from './page/recruitment/recruitment-internal/evaluation-postulant-fases/evaluation-fortalezas/evaluation-fortalezas.component';
import { EvaluationProficiencyFutureComponent } from './page/recruitment/recruitment-internal/evaluation-postulant-fases/evaluation-proficiency-future/evaluation-proficiency-future.component';
import { EvaluationProficiencyPresentComponent } from './page/recruitment/recruitment-internal/evaluation-postulant-fases/evaluation-proficiency-present/evaluation-proficiency-present.component';
import { ModalRequestByEmployeeComponent } from './page/staff-administration/profile/modal-request/modal-request.component';
import { ModalRequestDocumentComponent } from './page/staff-administration/modal-request-document/modal-request-document.component';
import { StaffRequestComponent } from './page/staff-administration/staff-request/staff-request.component';
import { DialogStaffRequestVacationComponent } from './page/staff-administration/staff-request/Dialog/dialog-staff-request-vacation/dialog-staff-request-vacation.component';
import { DialogSelectTypeStaffRequestComponent } from './page/staff-administration/staff-request/Dialog/dialog-select-type-staff-request/dialog-select-type-staff-request.component';
import { DialogStaffRequestVacationApproverComponent } from './page/staff-administration/staff-request/Dialog/dialog-staff-request-approver/dialog-staff-request-vacation-approver.component';
import { DialogStaffRequestAdvancementComponent } from './page/staff-administration/staff-request/Dialog/dialog-staff-request-advancement/dialog-staff-request-advancement.component';
import { StaffRequestApproverComponent } from './page/staff-administration/staff-request/staff-request-approver/staff-request-approver.component';
import { DialogStaffRequestSalaryComponent } from './page/staff-administration/staff-request/Dialog/dialog-staff-request-salary/dialog-staff-request-salary.component';
import { DialogStaffRequestSepelioComponent } from './page/staff-administration/staff-request/Dialog/dialog-staff-request-sepelio/dialog-staff-request-sepelio.component';
import { DialogStaffRequestMedicalComponent } from './page/staff-administration/staff-request/Dialog/dialog-staff-request-medical/dialog-staff-request-medical.component';
import { DialogStaffRequestPermitComponent } from './page/staff-administration/staff-request/Dialog/dialog-staff-request-permit/dialog-staff-request-permit.component';
import { DialogStaffRequestAbsenceComponent } from './page/staff-administration/staff-request/Dialog/dialog-staff-request-absence/dialog-staff-request-absence.component';
import { DialogStaffRequestLoanComponent } from './page/staff-administration/staff-request/Dialog/dialog-staff-request-loan/dialog-staff-request-loan.component';
import { DialogStaffRequestAccountChangeCtsComponent } from './page/staff-administration/staff-request/Dialog/dialog-staff-request-account-change-cts/dialog-staff-request-account-change-cts.component';
import { DialogStaffRequestLoanEvaluateComponent } from './page/staff-administration/staff-request/Dialog/dialog-staff-request-loan-evaluate/dialog-staff-request-loan-evaluate.component';
import { DialogStaffRequestPermitEvaluateComponent } from './page/staff-administration/staff-request/Dialog/dialog-staff-request-permit-evaluate/dialog-staff-request-permit-evaluate.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogStaffRequestSureComponent } from './page/staff-administration/staff-request/Dialog/dialog-request-sure/dialog-staff-request-sure.component';
import { EvaluationTestComponent } from './page/recruitment/recruitment-evaluation-postulant/evaluation-test/evaluation-test.component';
import { DialogStaffRequestAbsenceEvaluateComponent } from './page/staff-administration/staff-request/Dialog/dialog-staff-request-absence-evaluate/dialog-staff-request-absence-evaluate.component';
import { DialogStaffRequestPlanComponent } from './page/staff-administration/staff-request/Dialog/dialog-staff-request-plan/dialog-staff-request-plan.component';
import { DialogStaffRequestHourExtraComponent } from './page/staff-administration/staff-request/Dialog/dialog-staff-request-hour-extra/dialog-staff-request-hour-extra.component';
import { DialogStaffRequestTrainingNewComponent } from './page/staff-administration/staff-request/Dialog/dialog-staff-request-training-new/dialog-staff-request-training-new.component';
import { DialogStaffRequestTrainingExtraComponent } from './page/staff-administration/staff-request/Dialog/dialog-staff-request-training-extra/dialog-staff-request-training-extra.component';
import { DialogStaffRequestSelectEmployeeComponent } from './page/staff-administration/staff-request/Dialog/dialog-staff-request-select-employee/dialog-staff-request-select-employee.component';
import { ErrorLoadedComponent } from './page/recruitment/recruitment-load-masive/error-loaded/error-loaded.component';
import { RequestMedicalComponent } from './page/staff-administration/request-medical/request-medical.component';
import { MedicalDetailComponent } from './page/staff-administration/request-medical/medical-detail/medical-detail.component';
import { ReportMedicalComponent } from './page/staff-administration/request-medical/report-medical/report-medical.component';
import { CalendarModule } from 'angular-calendar';
import { NgChartsModule } from 'ng2-charts';
import {MatTooltipModule} from '@angular/material/tooltip';
import { DialogCategoryRequestComponent } from './page/staff-administration/staff-request/Dialog/dialog-category-request/dialog-category-request.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { ModalCampaignComponent } from './page/home/modal-campaign/modal-campaign.component';
import { CommentComponent } from './page/performance-evaluation/campaign-evaluation/comment/comment.component';
import { MyEvaluationComponent } from './page/my-evaluation/my-evaluation.component';
import { DialogStaffRequestAccountChangeCtsEvaluateComponent } from './page/staff-administration/staff-request/Dialog/dialog-staff-request-account-change-cts-evaluate/request-account-change-cts-evaluate.component';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { DialogPostulantFileComponent } from './page/recruitment/recruitment-external/recruitment-evaluation/dialog-postulant-file/dialog-postulant-file.component';
import { ModalObjectiveComponent } from './page/performance-evaluation/campaign-evaluation-detail/modal-objective/modal-objective.component';
import { ModalCompetitionComponent } from './page/performance-evaluation/campaign-evaluation-detail/modal-competition/modal-competition.component';
import { SharedDirectivesModule } from './../../shared/directives/shared-directives.module';
import { NineBoxComponent } from './page/performance-evaluation/nine-box/nine-box.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { EvaluationResumeDetailComponent } from './page/performance-evaluation/evaluation-resume-detail/evaluation-resume-detail.component';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
import { DialogDetailComponent } from './page/performance-evaluation/nine-box/dialog-detail/dialog-detail.component';
import { ModalCommentComponent } from './page/staff-administration/modal-comment/modal-comment.component';
import { ConfirmDialogComponent } from './page/recruitment/recruitment-detail/dialog/confirm-dialog/confirm-dialog.component';
import { ProgressBarColor } from './page/performance-evaluation/evaluation-resume-detail/progress-bar-color';
import { ConfirmDialogSolicitudComponent } from './page/staff-administration/request-medical/medical-detail/confirm-dialog-solicitud/confirm-dialog-solicitud.component';
import { MyTeamEvaluationsComponent } from './page/performance-evaluation/my-team-evaluations/my-team-evaluations.component';
import { ModalEvaluationComponent } from './page/home/modal-evaluation/modal-evaluation.component';
import { ModalBossComponent } from './page/staff-administration/profile/modal-boss/modal-boss.component';
import { MyTeamResumeComponent } from './page/performance-evaluation/my-team-resume/my-team-resume.component';
import { RecruitmentDetailDocumentComponent } from './page/recruitment/modals/recruitment-detail-document/recruitment-detail-document.component';
import { InformationExperienceComponent } from './page/recruitment/recruitment-information-postulant/information-experience/information-experience.component';
import { DocumentoAdjuntoComponent } from './page/recruitment/recruitment-information-postulant/documento-adjunto/documento-adjunto.component';
import { RecruitmentInformationRequestComponent } from './page/recruitment/recruitment-information-request/recruitment-information-request.component';
import { DialogPostulantInternalComponent } from './page/recruitment/recruitment-internal/dialog-postulant-internal/dialog-postulant-internal.component';
import { RecruitmentPersonComponent } from './page/recruitment/recruitment-person/recruitment-person.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MyTeamResumeV2Component } from './page/performance-evaluation/my-team-resume-v2/my-team-resume-v2.component';

@NgModule({
  declarations: [
    OrganizationChartComponent,
    ModalRequestByEmployeeComponent,
    PerformanceEvaluationComponent,
    ContactComponent,
    HomeComponent,
    DialogHomeCompany,
    DialogHomeDocument,
    SafeHtmlPipe,
    NotificationComponent,
    RecruitmentPersonnelComponent,
    RecruitmentAddComponent,
    RecruitmentDetailComponent,
    AddCampaignComponent,
    AsignEmployeeComponent,
    RecruitmentComponent,
    RecruitmentPostulatComponent,
    RecruitmentEvaluationComponent,
    CampaignEvaluationComponent,
    CampaignEvaluationDetailComponent,
    EvaluationResumeComponent,
    PrimeraFaseComponent,
    SegundaFaseComponent,
    TerceraFaseComponent,
    InformacionPostulanteComponent,
    RecruitmentEvaluationPostulantComponent,
    EvaluationProficiencyComponent,
    EvaluationRatingComponent,
    SolicitudDocumentosComponent,
    RecruitmentInformationPostulantComponent,
    InformationFamilyComponent,
    InformationEducationComponent,
    InformationSkillsComponent,
    SalaryBandComponent,
    ProfileComponent,
    EconomicConditionComponent,
    ModalRequestComponent,
    ModalPersonComponent,
    ModalStudyComponent,
    ModalSocialComponent,
    RequestListComponent,
    RequestDetailComponent,
    RecruitmentAddInternalComponent,
    JobListComponent,
    JobDetailComponent,
    JobDetailDialogComponent,
    EconomicConditionComponent,
    BadgetResumeComponent,
    PostulantsJobComponent,
    EvaluationPostulantsComponent,
    EvaluationPostulantFasesComponent,
    InformationPostulantInternalComponent,
    PrimeraFaseInternalComponent,
    SegundaFaseInternalComponent,
    TerceraFaseInternalComponent,
    CuartaFaseInternalComponent,
    EvaluationPositionComponent,
    EvaluationCurriculumComponent,
    EvaluationFortalezasComponent,
    EvaluationProficiencyFutureComponent,
    EvaluationProficiencyPresentComponent,
    ModalRequestDocumentComponent,
    StaffRequestComponent,
    DialogStaffRequestVacationComponent,
    DialogSelectTypeStaffRequestComponent,
    DialogStaffRequestVacationApproverComponent,
    DialogStaffRequestAdvancementComponent,
    StaffRequestApproverComponent,
    DialogStaffRequestSalaryComponent,
    DialogStaffRequestSepelioComponent,
    DialogStaffRequestMedicalComponent,
    RecruitmentEvaluationsListComponent,
    EvaluationsListComponent,
    DialogStaffRequestPermitComponent,
    DialogStaffRequestAbsenceComponent,
    DialogStaffRequestLoanComponent,
    DialogStaffRequestAccountChangeCtsComponent,
    DialogStaffRequestLoanEvaluateComponent,
    DialogStaffRequestPermitEvaluateComponent,
    DialogStaffRequestPermitEvaluateComponent,
    DialogStaffRequestSureComponent,
    EvaluationTestComponent,
    DialogStaffRequestAbsenceEvaluateComponent,
    DialogStaffRequestAccountChangeCtsEvaluateComponent,
    DialogStaffRequestPlanComponent,
    DialogStaffRequestHourExtraComponent,
    DialogStaffRequestTrainingNewComponent,
    DialogStaffRequestTrainingExtraComponent,
    DialogStaffRequestSelectEmployeeComponent,
    RecruitmentLoadMasiveComponent,
    ErrorLoadedComponent,
    RequestMedicalComponent,
    MedicalDetailComponent,
    ReportMedicalComponent,
    DialogCategoryRequestComponent,
    ModalCampaignComponent,
    CommentComponent,
    MyEvaluationComponent,
    DialogPostulantFileComponent,
        ModalObjectiveComponent,
        ModalCompetitionComponent,
    NineBoxComponent,
    EvaluationResumeDetailComponent,
    DialogDetailComponent,
    ModalCommentComponent,
    ConfirmDialogComponent,
    ProgressBarColor,
    ConfirmDialogSolicitudComponent,
    MyTeamEvaluationsComponent,
    ModalEvaluationComponent,
    ModalBossComponent,
    MyTeamResumeComponent,
    RecruitmentDetailDocumentComponent,
    InformationExperienceComponent,
    DocumentoAdjuntoComponent,
    RecruitmentInformationRequestComponent,
    DialogPostulantInternalComponent,
    RecruitmentPersonComponent,
    MyTeamResumeV2Component
  ],
  imports: [
  HumanManagementRoutingModule,
    CommonModule,
    MatMenuModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
    OrganizationChartModule,
    ScrollPanelModule,
    FormsModule,
    MatDividerModule,
    MatRadioModule,
    MatCarouselModule,
    MatListModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatExpansionModule,
    SharedPipesModule,
    MatTabsModule,
    MatTableModule,
    MatChipsModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDividerModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    QuillModule.forRoot(),
    MatDatepickerModule,
    MatTreeModule,
    TagModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    RadioButtonModule,
    CheckboxModule,
    DropdownModule,
    ChartModule,
    MatDialogModule,
    MatSlideToggleModule,
    CalendarModule,
    NgChartsModule,
    MatTooltipModule,
    MatProgressBarModule,
    //, SharedModule
    SharedDirectivesModule,
    NgxMaterialTimepickerModule,
    SharedDirectivesModule,
    NgxEchartsModule.forRoot({
      echarts
    }),
    MatChipsModule,
    NgxMatSelectSearchModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }
  ]
})
export class HumanManagementModule {}
