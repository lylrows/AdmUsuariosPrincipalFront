export interface PostulantDto {
    id?: number;
    codPerson?: string;
    firstName?: string;
    secondName?: string;
    lastName?: string;
    motherLastName?: string;
    email?: string;
    idSex?: number;
    sex?: string;
    bloodType?: string;
    documentNumber?: string;
    passport?: string;
    birthDate?: string;
    idNationality?: number;
    nationality?: string;
    idCivilStatus?: number;
    civilStatus?: string;
    isNoDomiciled?: boolean;
    drivingLicense?: string;
    universityGraduationDate?: string | null;
    countryentryDate?: string | null;
    medicalStaff?: string;
    idActive?: number;
    img?: string;
    cvFolder?: string;
    cvName?: string;
    cvFile?: string;
    contentType?: string;
    address?: string;
    idDistrict?: number;
    haveDriverLicense?: boolean;
    haveOwnMobility?: boolean;
    cellPhone?: string;
    anotherPhone?: string;
    idTypeDocument?: number;
    typeDocument?: string;
    idDepartmentLocation?: number;
    idProvinceLocation?: number;
    idDistrictLocation?: number;
    idUser?: number;
    age?: number;
    salaryPreference?: string;
}


export interface PostulantInfoDto {
    informationPersonal: PostulantDto;
    especializacion: string;
    carreer: string;
    stateEstudy: string;
    skills: string;
    idiomas: string;
    yearExperience: string;
    sueldoPretendido: string;
    idEvaluation: number;
    approved: boolean;
    stateEvaluation: string;
    fileMultitest: FileDto;
    fileCompetencias: FileDto;
    idJob: number;
    process: number;
}

export interface FileDto {
    nameFile: string;
    contentType: string;
    file: any;
}

export interface PostulantRequest {
    idPostulantRequest: number;
    idEvaluation: number;
    idPostulant: number;
    type: string;
    firstName: string;
    secondName: string;
    lastName: string;
    motherLastName: string;
    documentType: string;
    documentNumber: string;
    birthDate: string;
    idCompany: number;
    idManagement: number;
    idArea: number;
    idSubArea: number;
    idCostCenter: number;
    position: string;
    incomeDate: string;
    endDate: string;
    contractType: number;
    vacantType: number;
    schedule: string;
    boss: string;
    idBoss: number;
    idSalaryCategory: number;
    idCampus: number;
    user: number;
    confirmed: boolean;
}

export interface FilterPostulantRequest {
    idEvaluation: number;
    idPostulant: number;
    type: string;
}