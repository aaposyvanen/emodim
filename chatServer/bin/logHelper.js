const fs = require("fs");
const _ = require("lodash");

const LOGFILE = "./log.json";

function ensureLogFileExists() {
    if (!fs.existsSync(LOGFILE)) {
        const initialData = JSON.stringify([]);
        fs.writeFileSync(LOGFILE, initialData);
    } else {
        fs.readFile(LOGFILE, (err, data) => {
            if (err) {
                console.error(err);
            } else {
                console.log("no err in log.json")
                if (data.toString() === "") {
                    console.log("data is empty")
                    const initialData = JSON.stringify([]);
                    fs.writeFileSync(LOGFILE, initialData);
                }
            }
        });
    }
}

function handleMessageLogging(metadata, originalMessage, analyzedEditedMessage) {

    const objectToLog = {
        commentMetadata: metadata,
        words: analyzedEditedMessage,
        originalMessage
    }

    try {
        fs.readFile(LOGFILE, (err, data) => {
            if (err) {
                console.log("There was an error in reading the old log file. The latest message was not logged.")
                console.log(err)
            } else {
                const json = JSON.parse(data.toString());
                console.log("JSON:", json)
                if (_.isEmpty(json)) {
                    json.push(objectToLog);
                    writeJsonToLog(json);
                } else {
                    if (Array.isArray(json)) {
                        console.log("array")
                        json.push(objectToLog);
                        writeJsonToLog(json);
                    } else {
                        console.log("Existing log.json file has invalid format, should be a legal JSON array!");
                        console.log(json);
                    }
                }
            }
        });
    } catch (error) {
        console.error(error);
    }
}

function writeJsonToLog(json) {
    const jsonString = JSON.stringify(json);
    fs.writeFile(LOGFILE, jsonString, error => {
        if (error) console.error(error);
    });
}

module.exports = {
    ensureLogFileExists,
    handleMessageLogging
}
