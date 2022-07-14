import * as dayjs from "dayjs";

export const constructMessage = (parentId, analysisResults, results, currentThread, username) => {
    const metadata = constructMetadata(parentId, username, currentThread);
    const words = formWordArrayFromAnalyzedData(analysisResults);

    return {
        commentMetadata: metadata,
        words,
        sentenceValencePredictions: results
    }
}

export const constructMetadata = (parentId, username, currentThread) => {
    return {
        comment_id: dayjs().unix().toString(),
        datetime: dayjs().format("YYYY-MM-DD HH:mm:ss").toString(),
        author: username,
        parent_comment_id: parentId ? parentId : null,
        thread_id: currentThread.threadMetadata.thread_id,
        msg_type: "comment",
        title: currentThread.threadMetadata.title
    }
}

export const formWordArrayFromAnalyzedData = (analysisData) => {
    const wordArray = [];

    if (Array.isArray(analysisData)) {
        for (const data of analysisData) {
            let word = {
                word: data.original_text
            }
            if (data.rating) {
                word.type = "WORD";
                word.valence = data.rating[0];
                word.arousal = data.rating[1];
                word.dominance = data.rating[2];
            } else if (data.original_text === " ") {
                word.type = "WHITESPACE";
            } else {
                word.type = "PUNCTUATION"
            }
            wordArray.push(word);
        }
    }
    return wordArray;
}