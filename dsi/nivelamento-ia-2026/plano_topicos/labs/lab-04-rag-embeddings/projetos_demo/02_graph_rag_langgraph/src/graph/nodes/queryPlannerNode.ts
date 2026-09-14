import { getSystemPrompt, getUserPromptTemplate, QueryAnalysisSchema } from '../../prompts/v1/queryAnalyzer.ts';
import { OpenRouterService } from '../../services/openrouterService.ts';
import type { GraphState } from '../graph.ts';

export function createQueryPlannerNode(llmClient: OpenRouterService) {

  return async (state: GraphState): Promise<Partial<GraphState>> => {

    try {
      const sytemPrompt = getSystemPrompt();
      const userPrompt = getUserPromptTemplate(state.question!);
      const { data , error} = await llmClient.generateStructured(sytemPrompt, userPrompt, QueryAnalysisSchema);

      if(error) {
        console.error('❌ Failed to analyze query:', error);
        return {
          ...state,
          error,
          isMultiStep: false,
        };
      }

      if(data?.requiresDecomposition && !!data.subQuestions?.length) {

        const subQuestionsFormatted = data.subQuestions.map((sq, index) => `Sub-question ${index + 1}: ${sq}`).join('\n');
        console.log('🔍 Query requires decomposition into sub-questions:\n', subQuestionsFormatted)
        ;
        return {
          isMultiStep: true, 
          //isMultiStep: false,
          subQuestions: data.subQuestions,
          currentStep: 0,
          subQueries: [],
          subResults: [],
        };
      }

      return {
        ...state,
      };
    } catch (error: any) {
      console.error('❌ Error analyzing query:', error.message);
      return {
        ...state,
        isMultiStep: false,
      };
    }
  }
}
