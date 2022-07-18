import React, { useEffect, useState, useRef } from "react";

import { useDispatch, useSelector } from "react-redux";
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
import { constructMessage } from "../../utils/messageUtils";

import "../buttons.css";
import "./responseAnalysisDialog.css";

const ResponseAnalysisDialog = ({ inputText, parentId, clearResponseField, toggleResponsefield }) => {
    const dispatch = useDispatch();
    const socketRef = useRef(null);

    const [open, setOpen] = useState(false);

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
            dispatch(updateMessageText(inputText.trim()));
            setOpen(true);
            dispatch(sendMessageForAnalysis());
            clearResponseField();
        }
    }

    const handleReplyChange = (event) => {
        dispatch(updateMessageText(event.target.value));
    }

    const handleSend = () => {
        const message = constructMessage(parentId, analysisResults, results, currentThread, username);
        sendMessageDataToServer(message);
        dispatch(updateMessageText(""));
        handleClose();

        if (toggleResponsefield) {
            toggleResponsefield();
        }
    }

    /**
     * Send message to the server.
     * @param {object} constructedMessage 
     */
    const sendMessageDataToServer = (constructedMessage) => {
        const messageData = {};
        messageData.metadata = constructedMessage.commentMetadata
        messageData.originalMessage = {
            words: constructedMessage.words,
            valenceResults: constructedMessage.valenceResults
        }
        messageData.editedMessage = currentResponseText.trim();
        socketRef.current.emit("message", messageData);
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
                                parentId={parentId}
                                analysisResults={analysisResults}
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