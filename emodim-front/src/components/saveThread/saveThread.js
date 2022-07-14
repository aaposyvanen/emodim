import React, { useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";
import Button from '@material-ui/core/Button';
import { buttonTexts, chatEndpoint } from "../../constants";
import { useSelector } from "react-redux";
import * as dayjs from "dayjs";

const SaveThread = () => {
    const socketRef = useRef(null);
    // Gets current message thread from redux state.
    const currentThread = useSelector(state => state.threadReducer.thread);

    // Converts thread object to json and makes it into a dowload link.
    // Simulates mouse click to start the download immediately.
    const handleClick = () => {
        const newThread = {
            comments: currentThread.comments,
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

        sendThreadToServer(newThread);
    }

    const sendThreadToServer = (newThread) => {
        socketRef.current.emit("thread", newThread);
    }

    useEffect(() => {
        const socket = socketIOClient(chatEndpoint);
        socketRef.current = socket;

        return () => socket.disconnect();
    }, []);

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