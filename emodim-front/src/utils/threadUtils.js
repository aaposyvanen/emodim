import * as dayjs from "dayjs";

/**
 * Returns constructed thread.
 * @param {object} currentThread 
 * @param {object} currentAnnotations 
 * @param {object} currentNews 
 * @returns {object} thread
 */
export const constructThread = (currentThread, currentAnnotations, currentNews) => {
    const metadata = constructThreadMetadata(currentThread);
    const newThread = {
        threadMetadata: metadata,
        newsArticle: currentNews,
        comments: currentThread.comments,
        annotations: currentAnnotations
    }

    return newThread;
}

/**
 * Returns constructed thread metadata.
 * @param {object} currentThread 
 * @returns thread metadata
 */
export const constructThreadMetadata = (currentThread) => {
    return {
        ...currentThread.threadMetadata,
        datetime: dayjs().format("YYYY-MM-DD HH:mm:ss").toString(),
    }
}