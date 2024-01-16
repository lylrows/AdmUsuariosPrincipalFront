import { PostulantDto } from '@app/data/schema/Postulant/postulant';
import { EvaluationRatingPostulantDto } from './evaluation-rating';
import { EvaluationProficiencyDto } from './evaluation-proficiency';
export interface InfoReportIndividualDto {
    infoPerson: PostulantDto;
    infoEvaluationProficiency: EvaluationProficiencyDto[];
    infoEvaluationRating: EvaluationRatingPostulantDto[];
    infoEvaluationMultitest: EvaluationMultitestExternDto;
    infografic? : any;
    positionApplicant: string;
}

export interface EvaluationMultitestExternDto {
    id?: number;
    idEvaluation?: number;
    idPostulant?: number;
    postulant: string;
    scoreIntelligence: number | null;
    scoreAptitudVerbal: number | null;
    scoreAptitudNumerica: number | null;
    scoreAptitudEspacial: number | null;
    scoreAptitudAbstracta: number | null;
}