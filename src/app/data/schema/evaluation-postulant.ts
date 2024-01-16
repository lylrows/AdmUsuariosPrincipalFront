export interface EvaluationDto {
    id: number;
    id_Company?:number;
    nidjob?:number;
    codRequerimiento: string;
    state: string;
    positionRequired: string;
    process: number;
    postulantDtos: EvaluationPostulantDto[];
}

export interface EvaluationPostulantDto {
    id: number | null;
    idEvaluation: number | null;
    idPostulant: number;
    idCompany?:number;
    fullNamePostulant?: string;
    emailPostulant?: string;
    phoneNumberPostulant?: string;
    descripcionState?: string;
    state: number;
    approved: boolean;
    onlySave: boolean;
}