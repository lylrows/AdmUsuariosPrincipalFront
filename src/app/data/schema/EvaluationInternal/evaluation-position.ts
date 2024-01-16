export interface EvaluationPostulantPositionDto {
    id: number | null;
    idEvaluationPostulant: number;
    evaluated: string;
    company: string;
    area: string;
    actualPosition: string;
    postulatedPosition: string;
    dimissionDate: Date;
    timeInOffice: string;
    positionsInCompany: string;
    positionsCompany: Array<any>
}