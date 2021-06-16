export const parseAnalysisData = dataString => {
    const temp = dataString.replaceAll("'", "\"");
    const data = JSON.parse(temp);
    return data;
}
