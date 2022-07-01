export const UPDATE_NEWS_ARTICLE = "UPDATE_NEWS_ARTICLE";
export const UPDATE_NEWS_IMAGE = "UPDATE_NEWS_IMAGE";

export const updateNewsArticle = article => ({
    type: UPDATE_NEWS_ARTICLE,
    payload: article
});

export const updateNewsImage = image => ({
    type: UPDATE_NEWS_IMAGE,
    payload: image
})