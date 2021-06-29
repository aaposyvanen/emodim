import React from "react";
import * as dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { withStyles } from '@material-ui/core/styles';
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

import { updateMessageText } from "../../actions/responseActions";
import { sendMessageForAnalysis } from "../../actions/responseActions";
import { addMessageToCurrentThread } from "../../actions/threadActions";
import "./analysisReport.css"

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

const AnalysisReport = () => {
    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);
    const currentThread = useSelector(state => state.threadReducer.thread);
    const analysisResults = useSelector(state => state.responseReducer.analysisResults)
    const isWaitingForAnalysis = useSelector(state => state.responseReducer.isWaitingForAnalysis);
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
                <DialogTitle onClose={handleClose}>
                    Response Analysis
                </DialogTitle>
                <DialogContent dividers>
                    {
                        isWaitingForAnalysis
                            ?
                            <FontAwesomeIcon icon={faCircleNotch} className="loading-icon" />
                            :
                            <Typography gutterBottom>
                                {JSON.stringify(analysisResults)}
                            </Typography>
                    }
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button autoFocus onClick={handleSend} color="primary">
                        Send
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AnalysisReport;
