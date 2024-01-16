export interface IDetailEmployee {
    nid_employee: number;
	scodemployee: string;
	nid_person: number;
	nid_position: number;
	nid_charge: number;
	snamecharge: string;
	niduppercharge: number;
	nid_area: number;
	nid_company: number;
	plaza: string;
	nid_costcenter: number;
	ddateoffirstadmission: Date
	dadmissiondate: Date
	ddeparturedate: Date
	nid_payroll: number;
	bdependents: boolean;
	snit: string;
	dcompanyseniority: Date
	dgovernmentseniority: Date
	nid_state: number;
	sinsurednumbers: string;
	stypeinsurance: string;
	shealthpermit: string;
	nid_boss: number;
	snameboss: string;
	smerit: string;
	sdemerit: string;
	dregister: Date;
	scorporatemail: string;
	sannexed: string;
	sheavymachinerylicense: string;
	sddriverlicense: string;
	snamewife_partner: string;
	ddateofmarriage: Date;
	scovidcard: string;
	bhassignature: boolean;
	ssignature: string;

	idGerencia: number;
	idArea: number;
	idSubArea: number;

	safp_code:string;
	su_entsegvida:number;
	su_planeps:number;
	su_plansegpri:number;
	su_sctrsalud:number;
	su_entsegpract:number;

	scentercost:string;


}

export interface IEmployeeFile {
    nid_employee_file: number;
	nid_employee: number;
	nvacationdays: number;
	npendingvacations: number;
	bsalarycurrency: boolean;
	bctscurrency: boolean;
	bitsray: boolean;
	nid_safeplan: number;
    bdoesnotapplyqta: boolean;
	bmixedafp: boolean;
	nid_sctrpensionentity: number;
	nid_afp: number;
	id_epsplan: number;
	slifelaw: string;
	nFesaludPlan: number;
	nInternPlan: number;
}