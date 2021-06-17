import React from "react";
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

import { sendMessageForAnalysis } from "../../actions/responseActions";
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

    const handleClose = () => {
        setOpen(false);
    };

    const handleReplyClick = () => {
        setOpen(true);
        dispatch(sendMessageForAnalysis());
    };

    const analysisResults = useSelector(state => state.responseReducer.analysisResults)
    const isWaitingForAnalysis = useSelector(state => state.responseReducer.isWaitingForAnalysis);

    return (
        <div className="analysis-report">
            <Button variant="outlined" color="primary" onClick={handleReplyClick}>
                Reply
            </Button>
            <Dialog onClose={handleClose} open={open}>
                <DialogTitle onClose={handleClose}>
                    Modal title
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
                    <Button autoFocus onClick={handleClose} color="primary">
                        Send
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AnalysisReport;
