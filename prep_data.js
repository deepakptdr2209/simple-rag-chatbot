import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "gemini-embedding-001",

  taskType: TaskType.RETRIEVAL_DOCUMENT,
  title: "Document title",
});

const pinecone = new PineconeClient();
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

export const vectorStore = new PineconeStore(embeddings, {
  pineconeIndex,
  maxConcurrency: 5,
});

export async function documentEmbedding(filePath) {
  const loader = new PDFLoader(filePath, { splitPages: false });

  const doc = await loader.load();
  const docData = doc[0].pageContent;

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 250,
    chunkOverlap: 70,
  });
  const texts = await textSplitter.splitText(docData);

  const documents = texts.map((chunk) => {
    return {
      pageContent: chunk,
      metadata: doc[0].metadata,
    };
  });

  await vectorStore.addDocuments(documents);
  // console.log(texts);
}
