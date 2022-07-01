import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import * as dayjs from "dayjs";
import socketIOClient from "socket.io-client";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import ResponseField from "../responseField/responseField";

import ResponseAnalysis from "../responseAnalysis/responseAnalysis";
import {
    chatEndpoint,
    feedbackTitles as titles,
    buttonTexts
} from "../../constants";
import {
    sendMessageForAnalysis,
    updateMessageText
} from "../../actions/responseActions";
import "./responseAnalysisDialog.css";
import "../buttons.css";

export const formWordArrayFromAnalyzedData = (analysisData) => {
    const wordArray = [];

    if (Array.isArray(analysisData)) {
        for (const data of analysisData) {
            let word = {
                word: data.original_text
            }
            if (data.rating) {
                word.type = "WORD";
                word.valence = data.rating[0];
                word.arousal = data.rating[1];
                word.dominance = data.rating[2];
            } else if (data.original_text === " ") {
                word.type = "WHITESPACE";
            } else {
                word.type = "PUNCTUATION"
            }
            wordArray.push(word);
        }
    }
    return wordArray;
}

const ResponseAnalysisDialog = ({ inputText, parentId, clearResponseField, toggleResponsefield }) => {
    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);

    const socketRef = useRef(null);
    const analysisResults = useSelector(state => state.responseReducer.analysisResults);
    const currentResponseText = useSelector(state => state.responseReducer.responseText);
    const results = useSelector(state => state.responseReducer.valenceResults);
    const currentThread = useSelector(state => state.threadReducer.thread);
    const isWaitingForAnalysis = useSelector(state => state.responseReducer.isWaitingForAnalysis);
    const username = useSelector(state => state.userReducer.username);
    const annotations = useSelector(state => state.annotationsReducer.annotations.feedback);

    useEffect(() => {
        const socket = socketIOClient(chatEndpoint);
        socketRef.current = socket;

        return () => socket.disconnect();
    }, []);

    const handleClose = () => {
        setOpen(false);
    }

    const handleReplyClick = () => {
        if (inputText) {
            dispatch(updateMessageText(inputText));
            setOpen(true);
            dispatch(sendMessageForAnalysis());
            clearResponseField();
        }
    }

    const handleReplyChange = (event) => {
        dispatch(updateMessageText(event.target.value));
    }

    const handleSend = () => {
        const message = constructMessage();
        sendMessageDataToServer(message);
        dispatch(updateMessageText(""));
        handleClose();

        if (toggleResponsefield) {
            toggleResponsefield();
        }
    }

    const constructMessage = () => {
        const words = formWordArrayFromAnalyzedData(analysisResults);
        const metadata = constructMetadata();
        const valenceResults = results;
        return {
            commentMetadata: metadata,
            words,
            valenceResults
        }
    }

    const sendMessageDataToServer = (constructedMessage) => {
        console.log('constructedMessage', constructedMessage)
        const messageData = {};
        messageData.metadata = constructedMessage.commentMetadata
        messageData.originalMessage = {
            words: constructedMessage.words,
            valenceResults: constructedMessage.valenceResults
        }
        messageData.editedMessage = currentResponseText;
        socketRef.current.emit("message", messageData);
    }

    const constructMetadata = () => {
        return {
            ...currentThread.startMessage.commentMetadata,
            author: username,
            datetime: dayjs().format("YYYY-MM-DD HH:mm:ss").toString(),
            comment_id: dayjs().unix().toString(),
            msg_type: "comment",
            parent_comment_id: parentId ? parentId : null,
            //parent_datetime: currentThread.startMessage.commentMetadata.datetime,
        }
    }

    return (
        <div className="analysis-report">
            <Button
                className="button-primary"
                onClick={handleReplyClick}
                disabled={!inputText}
            >
                {buttonTexts.reply}
            </Button>

            <Dialog onClose={handleClose} open={open}>
                <MuiDialogTitle disableTypography >
                    <Typography variant="h6">
                        {Object.values(annotations).some(Boolean) ? titles.annotated : titles.regular}
                    </Typography>
                    <IconButton aria-label="close" onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </MuiDialogTitle>

                <MuiDialogContent className="dialog-content">
                    {isWaitingForAnalysis
                        ? <FontAwesomeIcon icon={faCircleNotch} className="loading-icon" />
                        : <div>
                            <ResponseAnalysis
                                analysisResults={formWordArrayFromAnalyzedData(analysisResults)}
                            />
                            <ResponseField 
                                input={currentResponseText}
                                handleChange={handleReplyChange}
                                />
                          </div>
                    }
                </MuiDialogContent>

                <MuiDialogActions>
                    <Button 
                        autoFocus 
                        onClick={handleClose}
                        className="button-secondary"
                        variant="outlined"
                    >
                        {buttonTexts.cancel}
                    </Button>
                    <Button 
                        autoFocus 
                        onClick={handleSend} 
                        className="button-primary" 
                        disabled={isWaitingForAnalysis||!currentResponseText}
                    >
                        {buttonTexts.send}
                    </Button>
                </MuiDialogActions>
            </Dialog>
        </div>
    );
}

export default ResponseAnalysisDialog;