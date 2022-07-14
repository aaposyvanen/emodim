export const analysisEndpoint = "http://localhost:5000";
export const chatEndpoint = "http://localhost:3010";
export const annotations = !!process.env.REACT_APP_ANNOTATIONS;
export const messageFeedbackStrings = {
    negative: "Tästä viestistä on tunnistettu negatiivisia tunteita.",
    neutral: "Viestin tunnesisältö on neutraali.",
    positive: "Tästä viestistä on tunnistettu positiivisia tunteita."
}
export const feedbackTitles = {
    regular: "Tarkista viestisi kieliasu",
    annotated: "Tarkista viestisi tunnesisältö",
}
export const userSelectionStrings = {
    primaryInstruction: "Valitse käyttäjänimi",
    helperText: "Sinun on valittava ensin käyttäjänimi."
}
export const buttonTexts = {
    ready: "Valmis",
    reply: "Vastaa",
    send: "Lähetä",
    cancel: "Peruuta",
    comment_reply: "Vastaa viestiin",
    confirm: "Vahvista",
    save: "Tallenna viestiketju",
    next: "Seuraava",
    quit: "Lopeta",
    start: "Aloita",
}
export const responseSection = {
    header: "Kirjoita kommentti",
    placeholderComment: "Kirjoita kommenttisi tähän",
    placeholderReply: "Kirjoita vastauksesi tähän",
    userText: "Kommenttisi näkyy nimimerkillä",
}
export const annotationType = {
    messageAnalysis: "Tunneanalyysi",
    emoji: "Hymiö",
    sidebar: "Värillinen sivupalkki",
    sentenceHighlighs: "Lausekorostus",
    wordHighlights: "Sanakorostus",
}
export const elementSelectionTitles = {
    messageElements: "Viestiketjun viestit",
    feedbackElements: "Lähetettävä viesti",
    sentimentSelection: "Näytettävät tunteet",
}
export const sentiments = {
    positive: "Positiivinen",
    negative: "Negatiivinen",
    neutral: "Neutraali",
}
export const errorMessages = {
    noArticle: "Uutisartikkelia ei löytynyt",
}
export const instructionTexts = {
    startTitle: "Hei",
    startText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n\nQuisque ultrices consequat justo, eu luctus sem. Praesent in leo eget nisl accumsan suscipit. Etiam eu elit nisi. Sed mattis ex vitae velit eleifend fringilla. Nunc vehicula nunc sit amet dui tempus venenatis. Mauris vestibulum elit lacus, et tincidunt magna semper et. Cras nunc sapien, aliquet tincidunt ultricies quis, dapibus vitae libero. Curabitur et nisl congue neque lobortis ultrices. Sed at eros tellus.",
    endTitle: "Loppu",
    endText: "moi moi",
}