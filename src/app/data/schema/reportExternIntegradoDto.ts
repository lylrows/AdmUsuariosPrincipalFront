import { EvaluationMultitestExternDto } from './reportExternIndividualDto';
import { EvaluationRatingPostulantDto } from './evaluation-rating';
import { EvaluationProficiencyDto } from './evaluation-proficiency';
export interface InfoReportIntegradoDto {
    infoEvaluationProficiency: EvaluationProficiencyDto[];
    infoEvaluationRating: EvaluationRatingPostulantDto[];
    infoEvaluationMultitest: EvaluationMultitestExternDto[];
    positionApplicant: string;
}