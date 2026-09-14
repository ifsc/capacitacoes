import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";
import { CONFIG_INGRESSO } from "./config.ingresso.ts";
import { DocumentProcessor } from "./documentProcessor.ts";
import { type PretrainedOptions } from "@huggingface/transformers";
import { Neo4jVectorStore } from "@langchain/community/vectorstores/neo4j_vector";
import { ChatOpenAI } from "@langchain/openai";
import { AI } from "./ai.ts";
import { writeFile, mkdir } from 'node:fs/promises'
import neo4j from 'neo4j-driver'

let _neo4jVectorStore = null

try {
    console.log("🚀 Inicializando RAG — Suporte ao Sistema de Ingresso IFSC...\n");

    const documentProcessor = new DocumentProcessor(
        CONFIG_INGRESSO.pdf.path,
        CONFIG_INGRESSO.textSplitter,
    )
    const documents = await documentProcessor.loadAndSplit()

    const embeddings = new HuggingFaceTransformersEmbeddings({
        model: CONFIG_INGRESSO.embedding.modelName,
        pretrainedOptions: CONFIG_INGRESSO.embedding.pretrainedOptions as PretrainedOptions
    })

    const nlpModel = new ChatOpenAI({
        temperature: CONFIG_INGRESSO.openRouter.temperature,
        maxRetries: CONFIG_INGRESSO.openRouter.maxRetries,
        modelName: CONFIG_INGRESSO.openRouter.nlpModel,
        openAIApiKey: CONFIG_INGRESSO.openRouter.apiKey,
        configuration: {
            baseURL: CONFIG_INGRESSO.openRouter.url,
            defaultHeaders: CONFIG_INGRESSO.openRouter.defaultHeaders
        }
    })

    // Verifica se o banco já tem chunks do ingresso — label separado (ChunkIngresso)
    const driver = neo4j.driver(
        CONFIG_INGRESSO.neo4j.url,
        neo4j.auth.basic(CONFIG_INGRESSO.neo4j.username, CONFIG_INGRESSO.neo4j.password)
    )
    const session = driver.session()
    const result = await session.run(
        `MATCH (n:${CONFIG_INGRESSO.neo4j.nodeLabel}) RETURN count(n) AS total`
    )
    const total = result.records[0]!.get('total').toNumber()
    await session.close()
    await driver.close()

    if (total > 0) {
        console.log(`♻️  Neo4j já tem ${total} chunks de ingresso (label: ${CONFIG_INGRESSO.neo4j.nodeLabel}) — usando índice existente.\n`)
        // Para reprocessar do zero, limpe pelo Neo4j Browser:
        //   MATCH (n:ChunkIngresso) DETACH DELETE n
        _neo4jVectorStore = await Neo4jVectorStore.fromExistingGraph(embeddings, CONFIG_INGRESSO.neo4j)
    } else {
        console.log(`📥 Neo4j vazio para ingresso — inserindo ${documents.length} chunks...\n`)
        _neo4jVectorStore = await Neo4jVectorStore.fromDocuments(documents, embeddings, CONFIG_INGRESSO.neo4j)
    }

    console.log("✅ Base de chamados indexada com sucesso!\n");
    console.log(`🗄️  Visualize os embeddings no Neo4j Browser: http://localhost:7475`);
    console.log(`     Consulta: MATCH (n:${CONFIG_INGRESSO.neo4j.nodeLabel}) RETURN n LIMIT 25\n`);

    // ==================== PERGUNTAS DE EXEMPLO ====================
    console.log("🔍 Iniciando consultas de suporte ao Sistema de Ingresso...\n");

    const questions = [
      
        // Exemplo 3: retrocesso de chamada gerada com erro
        "A chamada foi gerada com erro e precisa ser desfeita para que os candidatos voltem à situação CLA. Existe alguma forma de fazer isso pela interface sem precisar abrir chamado?",
        "chegou usuario novo na DEING e precisa de acesso admin como devo proceder login elvis.silva"
    ]

    const ai = new AI({
        debugLog: console.log,
        vectorStore: _neo4jVectorStore,
        nlpModel,
        promptConfig: CONFIG_INGRESSO.promptConfig,
        templateText: CONFIG_INGRESSO.templateText,
        topK: CONFIG_INGRESSO.similarity.topK,
    })

    for (const question of questions) {
        const results = await ai.answerQuestion(question)

        if (results.error) {
            console.log(`\n❌ Erro: ${results.error}\n`);
            continue
        }

        console.log(`\n${results.answer}\n`);
        await mkdir(CONFIG_INGRESSO.output.answersFolder, { recursive: true })

        const fileName = `${CONFIG_INGRESSO.output.answersFolder}/${CONFIG_INGRESSO.output.fileName}-${Date.now()}.md`
        const fileContent = `## Pergunta\n\n${question}\n\n## Resposta\n\n${results.answer!}`
        await writeFile(fileName, fileContent)
    }

    console.log(`\n${'='.repeat(80)}`);
    console.log("✅ Processamento de suporte concluído!\n");

} catch (error) {
    console.error('error', error)
} finally {
    await _neo4jVectorStore?.close();
}
