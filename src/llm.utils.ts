import { OpenAI } from "langchain/llms/openai";
import { loadSummarizationChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export const getSummary = async (text: string) => {
  // In this example, we use a `MapReduceDocumentsChain` specifically prompted to summarize a set of documents.
//   const text = fs.readFileSync("state_of_the_union.txt", "utf8");
  const model = new OpenAI({ temperature: 0 });
  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
  const docs = await textSplitter.createDocuments([text]);

  // This convenience function creates a document chain prompted to summarize a set of documents.
  const chain = loadSummarizationChain(model);
  const res = await chain.call({
    input_documents: docs,
  });

  return res.text;
};

export const getCompanySummary = async (companyProfileUrl: string) => {
    const model = new OpenAI({ temperature: 0 });
    const res2 = await model.call(
        `can u write a summary for the following company in linkedin ${companyProfileUrl}`
      );
    return res2;
}


export const getConversationStartersBasedOnLinkedInActivity = async (topics: string[]) => {
    const model = new OpenAI({ temperature: 0 });
    const res2 = await model.call(
        `write few possible conversation starters/questions considering the following topics ${topics.join(",")}`
      );
    return res2;
}

export const getJobPostingInformation = async (jobPostUrl: string) => {
    const model = new OpenAI({ temperature: 0 });
    const res2 = await model.call(
        `write a summary for the following job posting ${jobPostUrl}`
      );
    return res2;
}