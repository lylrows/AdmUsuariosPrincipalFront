export interface EvaluationProficiencyDto {
    id: number | null;
    idEvaluation: number;
    idPostulant: number;
    fullNamePostulant: string;
    idProficiency: number;
    proficiency: string;
    levelRRHH: number | null;
    testRRHH: number | null;
    comentarioRRHH: string | null;
    levelClient: number | null;
    levelJefe: number | null;
    rowGroup: number;
    expectative: number | null;
    flag?: number | null;
    required: boolean;
}