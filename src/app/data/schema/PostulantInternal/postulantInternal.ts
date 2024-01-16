export interface PostulantInternalInfoDto {
    informationPersonal: PostulantInternalDto;
    idEvaluation: number;
    approved: boolean;
    stateEvaluation: string;
    fileMultitest: FileDto;
    company: string;
    actualPosition: string;
    actualArea: string;
    dateRegister: Date;
    process: any;
    positionRequired: string;
}

export interface FileDto {
    nameFile: string;
    contentType: string;
    file: any;
}

export interface PostulantInternalDto {
    nid_person: number;
    scodperson: string;
    sfirstname: string;
    ssecondname: string;
    slastname: string;
    smotherlastname: string;
    semail: string;
    nid_sex: number | null;
    sbloodtype: string;
    sidentification: string;
    spassport: string;
    dbirthdate: string | null;
    nid_nationality: number | null;
    snationality: string | null;
    nid_civilstatus: number | null;
    bitisnotdomiciled: boolean | null;
    sdrivinglicense: string;
    duniversitygraduationdate: string | null;
    dcountryentrydate: string | null;
    smedicalstaff: string;
    nid_active: number | null;
    simg: string;
    cvName: string;
    cvFile: string;
    contentType: string;
}