import * as dayjs from "dayjs";

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

export const constructThreadMetadata = (currentThread) => {
    return {
        ...currentThread.threadMetadata,
        datetime: dayjs().format("YYYY-MM-DD HH:mm:ss").toString(),
    }
}