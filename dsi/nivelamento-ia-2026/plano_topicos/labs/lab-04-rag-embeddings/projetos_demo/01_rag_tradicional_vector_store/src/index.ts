import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";
import { CONFIG } from "./config.ts";
import { DocumentProcessor } from "./documentProcessor.ts";
import { type PretrainedOptions } from "@huggingface/transformers";
import { Neo4jVectorStore } from "@langchain/community/vectorstores/neo4j_vector";
//import { displayResults } from "./util.ts";
import { ChatOpenAI } from "@langchain/openai";
import { AI } from "./ai.ts";
import { writeFile, mkdir } from 'node:fs/promises'
import neo4j from 'neo4j-driver'


let _neo4jVectorStore = null

async function clearAll(vectorStore: Neo4jVectorStore, nodeLabel: string): Promise<void> {
    console.log("🗑️  Removendo todos os documentos existentes...");
    await vectorStore.query(
        `MATCH (n:\`${nodeLabel}\`) DETACH DELETE n`
    )
    console.log("✅ Documentos removidos com sucesso\n");
}

try {
    console.log("🚀 Inicializando sistema de Embeddings com Neo4j...\n");

    const documentProcessor = new DocumentProcessor(
        CONFIG.pdf.path,
        CONFIG.textSplitter,
    )
    const documents = await documentProcessor.loadAndSplit()

   const embeddings = new HuggingFaceTransformersEmbeddings({
        model: CONFIG.embedding.modelName,
        pretrainedOptions: CONFIG.embedding.pretrainedOptions as PretrainedOptions
    }) 

    const nlpModel = new ChatOpenAI({
        temperature: CONFIG.openRouter.temperature,
        maxRetries: CONFIG.openRouter.maxRetries,
        modelName: CONFIG.openRouter.nlpModel,
        openAIApiKey: CONFIG.openRouter.apiKey,
        configuration: {
            baseURL: CONFIG.openRouter.url,
            defaultHeaders: CONFIG.openRouter.defaultHeaders
        }
    })

    // Verifica se o banco já tem chunks — se sim, evita reinserir e economiza memória/tempo
    const driver = neo4j.driver(
        CONFIG.neo4j.url,
        neo4j.auth.basic(CONFIG.neo4j.username, CONFIG.neo4j.password)
    )
    const session = driver.session()
    const result = await session.run(`MATCH (n:${CONFIG.neo4j.nodeLabel}) RETURN count(n) AS total`)
    const total = result.records[0]!.get('total').toNumber()
    await session.close()
    await driver.close()

    if (total > 0) {
        console.log(`♻️  Neo4j já tem ${total} chunks — usando índice existente.\n`)
        // Para trocar o PDF ou reprocessar do zero, limpe o banco pelo Neo4j Browser:
        //   MATCH (n:Chunk) DETACH DELETE n
        // Depois rode novamente — o else abaixo vai reinserir tudo.
        _neo4jVectorStore = await Neo4jVectorStore.fromExistingGraph(embeddings, CONFIG.neo4j)
    } else {
        console.log(`📥 Neo4j vazio — inserindo ${documents.length} chunks...\n`)
        _neo4jVectorStore = await Neo4jVectorStore.fromDocuments(documents, embeddings, CONFIG.neo4j)
    }

    console.log("\n✅ Base de dados populada com sucesso!\n");
    console.log(`🗄️  Visualize os embeddings no Neo4j Browser: http://localhost:7475`);
    console.log(`     Consulta: MATCH (n:${CONFIG.neo4j.nodeLabel}) RETURN n LIMIT 25\n`);


    // ==================== STEP 2: RUN SIMILARITY SEARCH ====================
    console.log("🔍 ETAPA 2: Executando buscas por similaridade...\n");
    const questions = [
        "Quando você transforma cor = azul/vermelho/verde em colunas com 0 e 1 (ex.: [1,0,0]), isso é (qual das alternativas): A) Backpropagation, pois ajusta pesos com base no erro. B Decoding, pois escolhe a saída mais provável. C Normalização, pois coloca todos os valores entre 0 e 1. D One-hot encoding (categorização), pois representa categorias discretas com 0/1.",
       // "O que são tensores e como são representados em JavaScript?",
      /*   "Como converter objetos JavaScript em tensores?",
        "O que é normalização de dados e por que é necessária?",
        "Como funciona uma rede neural no TensorFlow.js?",
        "O que significa treinar uma rede neural?",
        "o que é hot enconding e quando usar?" */
    ]

    const ai = new AI({
        debugLog: console.log,
        vectorStore: _neo4jVectorStore,
        nlpModel,
        promptConfig: CONFIG.promptConfig,
        templateText: CONFIG.templateText,
        topK: CONFIG.similarity.topK,
    })

    for (const question of questions) {
     
        const results = await ai.answerQuestion(question)

        if(results.error) {
            console.log(`\n❌ Erro: ${results.error}\n`);
            continue
        }

        console.log(`\n${results.answer}\n`);
        await mkdir(CONFIG.output.answersFolder, { recursive: true })

        const fileName = `${CONFIG.output.answersFolder}/${CONFIG.output.fileName}-${Date.now()}.md`

        await writeFile(fileName, results.answer!)
    }


    // Cleanup
    console.log(`\n${'='.repeat(80)}`);
    console.log("✅ Processamento concluído com sucesso!\n");

} catch (error) {
    console.error('error', error)
} finally {
    await _neo4jVectorStore?.close();
}
