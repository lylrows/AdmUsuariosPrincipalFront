import { EvaluationsListComponent } from './page/recruitment/recruitment-internal/evaluations-list/evaluations-list.component';
import { RecruitmentEvaluationsListComponent } from './page/recruitment/recruitment-external/recruitment-evaluations-list/recruitment-evaluations-list.component';
import { EvaluationPostulantFasesComponent } from './page/recruitment/recruitment-internal/evaluation-postulant-fases/evaluation-postulant-fases.component';
import { RecruitmentInformationPostulantComponent } from './page/recruitment/recruitment-information-postulant/recruitment-information-postulant.component';
import { RecruitmentEvaluationPostulantComponent } from './page/recruitment/recruitment-evaluation-postulant/recruitment-evaluation-postulant.component';
import { RecruitmentPostulatComponent } from './page/recruitment/recruitment-external/recruitment-postulants/recruitment-postulants.component';
import { NotificationComponent } from './page/notification/notification.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrganizationChartComponent } from './page/organization-chart/organization-chart.component';
import { PerformanceEvaluationComponent } from './page/performance-evaluation/performance-evaluation.component';
import { RecruitmentComponent } from './page/recruitment/recruitment.component';
import { SalaryBandComponent } from './page/salary-band/salary-band.component';
import { StaffAdministrationComponent } from './page/staff-administration/staff-administration.component';
import { ContactComponent } from './page/contact/contact.component';
import { HomeComponent } from './page/home/home.component';
import { RecruitmentPersonnelComponent } from './page/recruitment/recruitment-personnel/recruitment-personnel.component';
import { RecruitmentDetailComponent } from './page/recruitment/recruitment-detail/recruitment-detail.component';
import { AddCampaignComponent } from './page/performance-evaluation/add-campaign/add-campaign.component';
import { AsignEmployeeComponent } from './page/performance-evaluation/asign-employee/asign-employee.component';
import { RecruitmentEvaluationComponent } from './page/recruitment/recruitment-external/recruitment-evaluation/recruitment-evaluation.component';
import { CampaignEvaluationComponent } from './page/performance-evaluation/campaign-evaluation/campaign-evaluation.component';
import { CampaignEvaluationDetailComponent } from './page/performance-evaluation/campaign-evaluation-detail/campaign-evaluation-detail.component';
import { EvaluationResumeComponent } from './page/performance-evaluation/evaluation-resume/evaluation-resume.component';
import { ProfileComponent } from './page/staff-administration/profile/profile.component';
import { JobListComponent } from './page/job-vacancies/job-list/job-list.component';
import { JobDetailComponent } from './page/job-vacancies/job-detail/job-detail.component';
import { EconomicConditionComponent } from './page/salary-band/economic-condition/economic-condition.component';
import { RequestListComponent } from './page/staff-administration/request-list/request-list.component';
import { BadgetResumeComponent } from './page/salary-band/badget-resume/badget-resume.component';
import { PostulantsJobComponent } from './page/recruitment/recruitment-internal/postulants-job/postulants-job.component';
import { EvaluationPostulantsComponent } from './page/recruitment/recruitment-internal/evaluation-postulants/evaluation-postulants.component';
import { StaffRequestComponent } from './page/staff-administration/staff-request/staff-request.component';
import { DialogStaffRequestVacationComponent } from './page/staff-administration/staff-request/Dialog/dialog-staff-request-vacation/dialog-staff-request-vacation.component';
import { DialogSelectTypeStaffRequestComponent } from './page/staff-administration/staff-request/Dialog/dialog-select-type-staff-request/dialog-select-type-staff-request.component';
import { DialogStaffRequestVacationApproverComponent } from './page/staff-administration/staff-request/Dialog/dialog-staff-request-approver/dialog-staff-request-vacation-approver.component';
import { StaffRequestApproverComponent } from './page/staff-administration/staff-request/staff-request-approver/staff-request-approver.component';
import { DialogStaffRequestPermitComponent } from './page/staff-administration/staff-request/Dialog/dialog-staff-request-permit/dialog-staff-request-permit.component';
import { DialogStaffRequestAbsenceComponent } from './page/staff-administration/staff-request/Dialog/dialog-staff-request-absence/dialog-staff-request-absence.component';
import { DialogStaffRequestLoanComponent } from './page/staff-administration/staff-request/Dialog/dialog-staff-request-loan/dialog-staff-request-loan.component';
import { DialogStaffRequestAccountChangeCtsComponent } from './page/staff-administration/staff-request/Dialog/dialog-staff-request-account-change-cts/dialog-staff-request-account-change-cts.component';
import { DialogStaffRequestLoanEvaluateComponent } from './page/staff-administration/staff-request/Dialog/dialog-staff-request-loan-evaluate/dialog-staff-request-loan-evaluate.component';
import { DialogStaffRequestPermitEvaluateComponent } from './page/staff-administration/staff-request/Dialog/dialog-staff-request-permit-evaluate/dialog-staff-request-permit-evaluate.component';
import { RequestMedicalComponent } from './page/staff-administration/request-medical/request-medical.component';
import { MedicalDetailComponent } from './page/staff-administration/request-medical/medical-detail/medical-detail.component';
import { ReportMedicalComponent } from './page/staff-administration/request-medical/report-medical/report-medical.component';
import { MyEvaluationComponent } from './page/my-evaluation/my-evaluation.component';
import { NineBoxComponent } from './page/performance-evaluation/nine-box/nine-box.component';
import { EvaluationResumeDetailComponent } from './page/performance-evaluation/evaluation-resume-detail/evaluation-resume-detail.component';
import { MyTeamEvaluationsComponent } from './page/performance-evaluation/my-team-evaluations/my-team-evaluations.component';
import { MyTeamResumeComponent } from './page/performance-evaluation/my-team-resume/my-team-resume.component';
import { RecruitmentPersonComponent } from './page/recruitment/recruitment-person/recruitment-person.component';
import { MyTeamResumeV2Component } from './page/performance-evaluation/my-team-resume-v2/my-team-resume-v2.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/humanmanagement/home',
    pathMatch: 'full'
  },
  {
    path: '',
    children: [
      {
        path: 'home',
        component: HomeComponent,
        data: { title: 'Home', breadcrumb: 'Home' }
      },
      {
        path: 'organization',
        component: OrganizationChartComponent,
        data: { title: 'Organigrama', breadcrumb: 'Organigrama' }
      },
      {
        path: 'bell',
        component: PerformanceEvaluationComponent,
        data: { title: 'Evaluación de desempeño del personal', breadcrumb: 'Evaluación de desempeño del personal' }
      },
      {
        path: 'mis-bell',
        component: MyEvaluationComponent,
        data: { title: 'Mis Evaluaciones de desempeño', breadcrumb: 'Mis Evaluaciones de desempeño' }
      },
      {
        path: 'my-team-evaluations',
        component: MyTeamEvaluationsComponent,
        data: { title: 'Evaluaciones de Mi Equipo', breadcrumb: 'Evaluaciones de Mi Equipo' }
      },
      {
        path: 'add-campaign/:id',
        component: AddCampaignComponent,
        data: { title: 'Mantenimiento de Campaña', breadcrumb: 'Mantenimiento de Campaña' }
      },
      {
        path: 'asign-employee/:id',
        component: AsignEmployeeComponent,
        data: { title: 'Asignar empleado', breadcrumb: 'Asignar empleado' }
      },
      {
        path: 'campaing-evaluation/:id',
        component: CampaignEvaluationComponent,
        data: { title: 'Campañas Evaluaciones', breadcrumb: 'Campañas Evaluaciones' }
      },
      {
        path: 'campaing-evaluation-detail/:id',
        component: CampaignEvaluationDetailComponent,
        data: { title: 'Detalle de Evaluaciones', breadcrumb: 'Detalle de Evaluaciones' }
      },
      {
        path: 'evaluation-resume/:id',
        component: EvaluationResumeComponent,
        data: { title: 'Resumen de Evaluación', breadcrumb: 'Resumen de Evaluación' }
      },
      {
        path: 'nine-box',
        component: NineBoxComponent,
        data: { title: 'Evaluación Nine Box', breadcrumb: 'Evaluación Nine Box' }
      },
      {
        path: 'evaluation-resume-detail/:idevaluation/:idaction',
        component: EvaluationResumeDetailComponent,
        data: { title: 'Resumen de Evaluación - Detalle', breadcrumb: 'Resumen de Evaluación - Detalle' }
      },
      {
        path: 'recruitment',
        component: RecruitmentComponent,
        data: { title: 'Reclutamiento y selección de personal', breadcrumb: 'Reclutamiento y selección de personal' },
      },
      {
        path: 'recruitment-person-external/:id',
        component: RecruitmentPersonnelComponent,
        data: { title: 'Panel de Reclutamiento de Personal', breadcrumb: 'Panel de Reclutamiento de Personal' }
      },
      {
        path: 'recruitment-person-internal/:id',
        component: RecruitmentPersonnelComponent,
        data: { title: 'Panel de Reclutamiento de Personal', breadcrumb: 'Panel de Reclutamiento de Personal' }
      },
      {
        path: 'recruitment-detail/:id',
        component: RecruitmentDetailComponent,
        data: { title: 'Detalle de Reclutamiento de Personal', breadcrumb: 'Detalle de Reclutamiento de Personal' }
      },
      {
        path: 'recruitment-postulants/:id',
        component: RecruitmentPostulatComponent,
        data: { title: 'Postulantes', breadcrumb: 'Postulantes' }
      },
      {
        path: 'recruitment-evaluation/:id',
        component: RecruitmentEvaluationComponent,
        data: { title: 'Evaluación', breadcrumb: 'Evaluación' }
      },
      {
        path: 'recruitment-evaluation-postulant/:id',
        component: RecruitmentEvaluationPostulantComponent,
        data: { title: 'Evaluación de postulante', breadcrumb: 'Evaluación' }
      },
      {
        path: 'recruitment-information-postulant/:id',
        component: RecruitmentInformationPostulantComponent,
        data: { title: 'Informacion del postulante', breadcrumb: 'Evaluación' }
      },
      {
        path: 'salaryband',
        component: SalaryBandComponent,
        data: { title: 'Estructura Salarial', breadcrumb: 'Estructura Salarial' }
      },
      {
        path: 'economic-condition',
        component: EconomicConditionComponent,
        data: { title: 'Condición Económica', breadcrumb: 'Condición Económica' }
      },
      {
        path: 'badget-resume',
        component: BadgetResumeComponent,
        data: { title: 'Resumen Presupuesto', breadcrumb: 'Resumen Presupuesto' }
      },
      {
        path: 'staffadministration',
        component: RequestListComponent,
        data: { title: 'Administración de personal', breadcrumb: 'Administración de personal' }
      },
      /*{
        path: 'request-list',
        component: RequestListComponent,
        data: { title: 'Solicitudes', breadcrumb: 'Solicitudes' }
      },*/
      {
        path: 'profile/:id',
        component: ProfileComponent,
        data: { title: 'Perfil', breadcrumb: 'Perfil' }
      },
      {
        path: 'contact',
        component: ContactComponent,
        data: { title: 'Contáctanos', breadcrumb: 'Contáctanos' }
      },
      {
        path: 'notification',
        component: NotificationComponent,
        data: { title: 'Notificaciones', breadcrumb: 'Notificaciones' }
      },
      {
        path: 'job-vacancies',
        component: JobListComponent,
        data: { title: 'Vacantes de trabajos', breadcrumb: 'Vacantes de trabajo' }
      },
      {
        path: 'job-detail/:id',
        component: JobDetailComponent,
        data: { title: 'Detalle de vacante', breadcrumb: 'Detalle de vacante' }
      },
      {
        path: 'postulants-internal/:id',
        component: PostulantsJobComponent,
        data: { title: 'Postulantes', breadcrumb: 'Postulantes' }
      },
      {
        path: 'evaluation-postulants/:id',
        component: EvaluationPostulantsComponent,
        data: { title: 'Evaluación de postulantes', breadcrumb: 'Evaluación de postulantes' }
      },
      {
        path: 'evaluation-postulant/:id',
        component: EvaluationPostulantFasesComponent,
        data: { title: 'Evaluación de postulante', breadcrumb: 'Evaluación de postulante' }
      },
      {
        path: 'staff-request',
        component: StaffRequestComponent,
        data: { title: 'Solicitud del Personal', breadcrumb: 'Solicitud del Personal' }
      },
      {
        path: 'request-medical',
        component: RequestMedicalComponent,
        data: { title: 'Solicitud de Descanso médico o subsidios', breadcrumb: 'Solicitud de Descanso médico o subsidios' }
      },
      {
        path: 'request-medical-config/:id',
        component: MedicalDetailComponent,
        data: { title: 'Solicitud de Descanso médico o subsidios', breadcrumb: 'Solicitud de Descanso médico o subsidios' }
      },
      {
        path: 'request-medical-report',
        component: ReportMedicalComponent,
        data: { title: 'Reporte de Descanso médico o subsidios', breadcrumb: 'Reporte de Descanso médico o subsidios' }
      },
      {
        path: 'app-dialog-staff-request-vacation',
        component: DialogStaffRequestVacationComponent,
        data: { title: 'Solicitud del Personal de Vacaciones', breadcrumb: 'Solicitud del Personal de Vacaciones' }
      },
      {
        path: 'app-dialog-select-type-staff-request',
        component: DialogSelectTypeStaffRequestComponent,
        data: { title: 'Seleccionar el tipo de solicitud', breadcrumb: 'Seleccionar el tipo de solicitud' }
      },
      {
        path: 'app-dialog-staff-request-vacation-approver',
        component: DialogStaffRequestVacationApproverComponent,
        data: { title: 'Aprobar Solicitud de Vacaciones', breadcrumb: 'Aprobar Solicitud de Vacaciones' }
      },
      {
        path: 'app-staff-request-approver',
        component: StaffRequestApproverComponent,
        data: { title: 'Detalle de la Revisión', breadcrumb: 'Detalle de la Revisión' }
      },
      {
        path: 'recruitment-evaluations/:id',
        component: RecruitmentEvaluationsListComponent,
        data: { title: 'Evaluaciones', breadcrumb: 'Evaluaciones' }
      },
      {
        path: 'evaluations-list/:id',
        component: EvaluationsListComponent,
        data: { title: 'Evaluaciones', breadcrumb: 'Evaluaciones' }
      }, 
      {
        path: 'app-dialog-staff-request-permit',
        component: DialogStaffRequestPermitComponent,
        data: { title: 'Solicitud de Permniso', breadcrumb: 'Solicitud de Permiso' }
      },
      {
        path: 'app-dialog-staff-request-absence',
        component: DialogStaffRequestAbsenceComponent,
        data: { title: 'Solicitud de Permniso', breadcrumb: 'Solicitud de Permiso' }
      },
      {
        path: 'app-dialog-staff-request-loan',
        component: DialogStaffRequestLoanComponent,
        data: { title: 'Solicitud de Prestamo', breadcrumb: 'Solicitud de Prestamo' }
      },
      {
        path: 'app-dialog-staff-request-account-change-cts',
        component: DialogStaffRequestAccountChangeCtsComponent,
        data: { title: 'Solicitud de Cambio de Cts', breadcrumb: 'Solicitud de Cambio de Cts' }
      },
      {
        path: 'app-dialog-staff-request-loan-evaluate',
        component: DialogStaffRequestLoanEvaluateComponent,
        data: { title: 'Evaluar Solitud de Prestamo', breadcrumb: 'Evaluar Solitud de Prestamo' }
      },
      
      {
        path: 'app-dialog-staff-request-permit-evaluate',
        component: DialogStaffRequestPermitEvaluateComponent,
        data: { title: 'Evaluar Solitud de Permiso', breadcrumb: 'Evaluar Solitud de Permiso' }
      },
      {
        path: 'recruitment-person',
        component: RecruitmentPersonComponent,
        data: { title: 'Evaluación personal', breadcrumb: 'Evaluación personal' }
      },
      {
        path: 'my-team-resume',
        // component: MyTeamResumeComponent,
        // data: { title: 'Mi Equipo Resumen', breadcrumb: 'Mi Equipo Resumen' }
        component: MyTeamResumeV2Component,
        data: { title: 'Mi Equipo Resumen', breadcrumb: 'Mi Equipo Resumen' }
      },
      {
        path: 'my-team-resume-old',
        // component: MyTeamResumeV2Component,
        component: MyTeamResumeComponent,
        data: { title: 'Mi Equipo Resumen', breadcrumb: 'Mi Equipo Resumen' }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class HumanManagementRoutingModule { }