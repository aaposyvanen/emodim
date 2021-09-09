export const analysisEndpoint = "http://127.0.0.1:5000";
export const chatEndpoint = "http://127.0.0.1:3010";
export const annotations = !!process.env.REACT_APP_ANNOTATIONS;
export const messageFeedbackStrings = {
    negative: "Tästä viestistä on tunnistettu negatiivisia tunteita.",
    neutral: "Viestin tunnesisältö on neutraali.",
    positive: "Tästä viestistä on tunnistettu positiivisia tunteita."
}
export const feedbackTitles = {
    regular: "Tarkista viestisi kieliasu",
    annotated: "Tarkista viestisi tunnesisältö"
}
export const userSelectionStrings = {
    primaryInstruction: "Valitse käyttäjänimi",
    helperText: "Sinun on valittava ensin käyttäjänimi."
}
export const buttonTexts = {
    ready: "Valmis",
    reply: "Vastaa",
    send: "Lähetä",
    cancel: "Peruuta"
}
export const responseFieldPlaceHolder = "Kirjoita vastaus..."
