import type { DataType, PretrainedModelOptions } from "@huggingface/transformers";

import { readFileSync } from 'node:fs'

const promptsFolder = './prompts';
const promptsFiles = {
    answerPrompt: `${promptsFolder}/answerPrompt.ingresso.json`,
    template: `${promptsFolder}/template.ingresso.txt`,
};

export interface TextSplitterConfig {
    chunkSize: number;
    chunkOverlap: number;
}

export const CONFIG_INGRESSO = Object.freeze({
    promptConfig: JSON.parse(readFileSync(promptsFiles.answerPrompt, 'utf-8')),
    templateText: readFileSync(promptsFiles.template, 'utf-8'),
    output: {
        answersFolder: './respostas',
        fileName: 'resposta-ingresso',
    },
    neo4j: {
        url: process.env.NEO4J_URI!,
        username: process.env.NEO4J_USER!,
        password: process.env.NEO4J_PASSWORD!,
        // Label separado para não misturar com os chunks do outro RAG
        indexName: "ingresso_index",
        searchType: "vector" as const,
        textNodeProperties: ["text"],
        nodeLabel: "ChunkIngresso",
    },
    openRouter: {
        nlpModel: process.env.NLP_MODEL,
        url: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPENROUTER_API_KEY,
        temperature: 0.2, // mais determinístico para suporte
        maxRetries: 2,
        defaultHeaders: {
            "HTTP-Referer": process.env.OPENROUTER_SITE_URL,
            "X-Title": process.env.OPENROUTER_SITE_NAME,
        }
    },
    // Aponta para o markdown convertido em "pseudo-PDF" ou diretamente o arquivo .md
    // Como o PDFLoader não lê .md, usamos o arquivo .pdf gerado a partir do .md
    pdf: {
        path: "./base_documental/rag_ingresso_doc_chamados.pdf",
    },
    textSplitter: {
        chunkSize: 1200,
        chunkOverlap: 300,
    },
    embedding: {
        modelName: process.env.EMBEDDING_MODEL!,
        pretrainedOptions: {
            dtype: "fp32" as DataType,
        } satisfies PretrainedModelOptions,
    },
    similarity: {
        topK: 4, // um pouco mais de contexto para chamados que podem ter múltiplas soluções
    },
});
