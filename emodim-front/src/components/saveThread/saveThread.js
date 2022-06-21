import React from "react";
import Button from '@material-ui/core/Button';
import { buttonTexts } from "../../constants";
import { useSelector } from "react-redux";
import * as dayjs from "dayjs";

const SaveThread = () => {
    // Gets current message thread from redux state.
    const currentThread = useSelector(state => state.threadReducer.thread);

    // Converts thread object to json and makes it into a dowload link.
    // Simulates mouse click to start the download immediately.
    const handleClick = () => {
        const newThread = {
            comments: [currentThread.startMessage].concat(currentThread.comments),
            threadMetadata: currentThread.metadata,
            threadID: dayjs().unix().toString(),
        }    
        const data = new Blob([JSON.stringify([newThread], null, 2)], {type : "application/json"});
        const textFile = window.URL.createObjectURL(data);

        const element = document.createElement("a");
        element.setAttribute("download", "log.json");
        element.href = textFile;
        document.body.appendChild(element);

        window.requestAnimationFrame(() => {
            const event = new MouseEvent("click");
            element.dispatchEvent(event);
            document.body.removeChild(element);
        });

    }

    return (
        <div>
            <Button
                type="submit"
                onClick={handleClick}
            >
                {buttonTexts.save}
            </Button>
            <div>

            </div>
        </div>
    )
}

export default SaveThread;