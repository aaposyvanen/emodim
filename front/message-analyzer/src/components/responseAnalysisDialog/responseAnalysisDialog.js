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

import { chatEndpoint } from "../../constants";
import { updateMessageText } from "../../actions/responseActions";
import { sendMessageForAnalysis } from "../../actions/responseActions";
import { addMessageToCurrentThread } from "../../actions/threadActions";
import "./responseAnalysisDialog.css"

const ResponseAnalysisDialog = () => {
    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);
    const socketRef = useRef(null)

    const currentThread = useSelector(state => state.threadReducer.thread);
    const analysisResults = useSelector(state => state.responseReducer.analysisResults)
    const isWaitingForAnalysis = useSelector(state => state.responseReducer.isWaitingForAnalysis);

    useEffect(() => {
        const socket = socketIOClient(chatEndpoint);
        socketRef.current = socket;

        socket.on("message", message => {
            dispatch(addMessageToCurrentThread(message));
        });

        return () => socket.disconnect();
    }, [dispatch]);

    const handleClose = () => {
        setOpen(false);
    };

    const handleReplyClick = () => {
        setOpen(true);
        dispatch(sendMessageForAnalysis());
    };

    const handleSend = () => {

        const metadata = {
            ...currentThread.startMessage.commentMetadata,
            author: "user",
            datetime: dayjs().format("YYYY-MM-DD HH:mm:ss").toString(),
            id: dayjs().unix().toString(),
            msg_type: "comment",
            parent_comment_id: currentThread.startMessage.commentMetadata.comment_id,
            parent_datetime: currentThread.startMessage.commentMetadata.datetime,
        };
        const words = formWordArray(analysisResults);

        const newMessage = {
            commentMetadata: metadata,
            words
        };
        dispatch(addMessageToCurrentThread(newMessage));
        dispatch(updateMessageText(""));
        socketRef.current.emit("message", newMessage);
        handleClose();
    }

    const formWordArray = (analysisData) => {
        const wordArray = [];

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
        return wordArray;
    }

    return (
        <div className="analysis-report">
            <Button onClick={handleReplyClick}>
                Reply
            </Button>

            <Dialog onClose={handleClose} open={open}>
                <MuiDialogTitle disableTypography >
                    <Typography variant="h6">Response Analysis</Typography>
                    <IconButton aria-label="close" onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </MuiDialogTitle>

                <MuiDialogContent dividers>
                    {isWaitingForAnalysis
                        ? <FontAwesomeIcon icon={faCircleNotch} className="loading-icon" />
                        : <Typography gutterBottom>{JSON.stringify(analysisResults)}</Typography>}
                </MuiDialogContent>

                <MuiDialogActions>
                    <Button autoFocus onClick={handleSend} color="primary">
                        Send
                    </Button>
                    <Button autoFocus onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                </MuiDialogActions>
            </Dialog>
        </div>
    );
}

export default ResponseAnalysisDialog;
