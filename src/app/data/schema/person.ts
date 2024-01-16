export interface IListPhone {
    nid_phone: number;
	nid_person: number;
	phone: string;
}

export interface IPerson {
    nid_person?: number;
	scodperson?: string;
	sfirstname?: string;
	ssecondname?: string;
	slastname?: string;
	smotherlastname?: string;
	semail?: string;
	nid_sex?: number;
	sbloodtype?: string;
	sidentification?: string;
	spassport?: string;
	dbirthdate?: Date;
	nid_nationality?: number;
	snationality?: string;
	nid_civilstatus?: number;
	bitisnotdomiciled?: boolean;
	sdrivinglicense?: string;
	duniversitygraduationdate?: Date;
	dcountryentrydate?: Date;
	smedicalstaff?: string;
	nid_active?: number;
	simg?: string;
	email?: string;
	semergency_contact_name?: string;
	semergency_contact_phone?: string;
	sage?:string;
	saddress: string;
	scivil_status?: string;
	nid_postulant?: number;
}