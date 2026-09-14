import { z } from 'zod/v3';

export const QueryAnalysisSchema = z.object({
  complexity: z.enum(['simple', 'complex']).describe('Whether the query is simple or complex'),
  requiresDecomposition: z.boolean().describe('Whether the query needs to be broken down into sub-queries'),
  subQuestions: z.array(z.string()).describe('Sub-questions if decomposition is required (empty array if simple)'),
  reasoning: z.string().describe('Brief explanation of the analysis'),
});

export type QueryAnalysisData = z.infer<typeof QueryAnalysisSchema>;

export const getSystemPrompt = (): string => {
  return JSON.stringify({
    role: 'Query Complexity Analyzer - Determine if questions need multi-step decomposition',
    schema: {
      nodes: ['Student (id, name, email, phone)', 'Course (name, url)'],
      relationships: [
        'PURCHASED: (Student)-[:PURCHASED {status, paymentMethod, paymentDate, amount}]->(Course)',
        'PROGRESS: (Student)-[:PROGRESS {progress: 0-100}]->(Course)',
      ],
    },
    rules: [
      'Generate sub-questions in the SAME language as the input question (ignore data language)',
      'Simple: Single entity, direct retrieval, no group comparisons',
      'Complex: Comparing groups, multiple dependent calculations, relationship analysis',
      'Decompose into max 3 sub-questions, each independently answerable, logically ordered',
      'Sub-questions MUST be answerable using ONLY the nodes and relationships in the schema above',
      'Do NOT generate sub-questions about data that does not exist in the schema (e.g., categories, tags, sequences, external systems)',
      'If a question cannot be answered with the available schema, mark as simple and generate a best-effort single query',
    ],
    examples: [
      { question: 'List all available courses', complexity: 'simple', requiresDecomposition: false, subQuestions: [], reasoning: 'Direct retrieval, no comparisons' },
      { question: 'Which courses are commonly bought together?', complexity: 'simple', requiresDecomposition: false, subQuestions: [], reasoning: 'Single Cypher self-join resolves this' },
      { question: 'Find courses students buy after Machine Learning em Navegadores', complexity: 'complex', requiresDecomposition: true, subQuestions: ['Which students purchased Machine Learning em Navegadores?', 'What other courses did those students purchase?'], reasoning: 'Step 2 depends on student IDs from step 1' },
      { question: 'Compare revenue between high vs low completion courses', complexity: 'complex', requiresDecomposition: true, subQuestions: ['Average completion per course?', 'Revenue for courses >70% completion?', 'Revenue for courses <70% completion?'], reasoning: 'Multiple aggregations + group comparison' },
    ],
  });
};

export const getUserPromptTemplate = (question: string): string => {
  return question;
};
