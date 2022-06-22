const fs = require("fs");
const _ = require("lodash");

function ensureLogFileExists(path) {
    const LOGFILE = path;
    if (!fs.existsSync(LOGFILE)) {
        const initialData = JSON.stringify([]);
        fs.writeFileSync(LOGFILE, initialData);
    } else {
        fs.readFile(LOGFILE, (err, data) => {
            if (err) {
                console.error(err);
            } else {
                if (data.toString() === "") {
                    const initialData = JSON.stringify([]);
                    fs.writeFileSync(LOGFILE, initialData);
                }
            }
        });
    }
}

function handleMessageLogging(path, objectToLog) {
    const LOGFILE = path;
    try {
        fs.readFile(LOGFILE, (err, data) => {
            if (err) {
                console.log("There was an error in reading the old log file. The latest message was not logged.")
                console.log(err)
            } else {
                const json = JSON.parse(data.toString());
                if (_.isEmpty(json)) {
                    json.push(objectToLog);
                    writeJsonToLog(json, LOGFILE);
                } else {
                    if (Array.isArray(json)) {
                        json.push(objectToLog);
                        writeJsonToLog(json, LOGFILE);
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

function writeJsonToLog(json, path) {
    const LOGFILE = path;
    const jsonString = JSON.stringify(json, null, 2);
    fs.writeFile(LOGFILE, jsonString, error => {
        if (error) console.error(error);
    });
}

module.exports = {
    ensureLogFileExists,
    handleMessageLogging
}
