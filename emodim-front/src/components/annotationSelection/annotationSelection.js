import { Button, Checkbox, FormControlLabel, FormGroup, FormLabel } from "@material-ui/core";
import { React, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateAnnotations } from "../../actions/annotationActions";
import { annotationType, elementSelectionTitles, buttonTexts, sentiments } from "../../constants";
import "./annotationSelection.css";
import {
    useHistory,
  } from "react-router-dom";
import { loadState } from "../../localStorage";

const AnnotationSelection = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const persistedState = loadState();
    const initialAnnotations = useSelector(state => state.annotationsReducer.annotations);
    const annotations = persistedState ? persistedState.annotationsReducer.annotations : initialAnnotations;

    const [checkedAnnotations, setCheckedAnnotations] = useState(annotations);

    // Save selected annotations to redux state and push user to username selection.
    const handleSubmit = (event) => {
        event.preventDefault();
        //dispatch(updateAnnotations(checkedAnnotations));
        history.push("/forum");
    }

    const handleChange = (e, elem) => {
        let temp = {...checkedAnnotations};
        const elemName = e.target.name;
        temp[elem][elemName] = e.target.checked;
        setCheckedAnnotations(temp);
    };

    const {messageElements, feedbackElements, sentimentSelection } = elementSelectionTitles;

    return (
        <form className="form-area" onSubmit={(event) => handleSubmit(event)}>
            <div className="check-area">
                <div className="form-group msg-elements">
                    <FormLabel>{messageElements}</FormLabel>
                    <FormGroup>
                        {Object.keys(checkedAnnotations.message).map((keyName, i) => {
                            return <FormControlLabel
                                key={`msg-label-${i}`}
                                control={
                                    <Checkbox
                                        className="message-elements"
                                        key={`msg-el-${i}`}
                                        checked={checkedAnnotations.message[keyName]}
                                        onChange={(event) => handleChange(event, "message")}
                                        name={keyName}
                                    />
                                }
                                label={annotationType[keyName]}
                            />
                        })}
                    </FormGroup>
                </div>
                <div className="form-group fb-elements">
                    <FormLabel>{feedbackElements}</FormLabel>
                    <FormGroup>
                        {Object.keys(checkedAnnotations.feedback).map((keyName, i) => {
                            return <FormControlLabel
                                key={`fb-label-${i}`}
                                control={
                                    <Checkbox
                                        key={`fb-el-${i}`}
                                        checked={checkedAnnotations.feedback[keyName]}
                                        onChange={(event) => handleChange(event, "feedback")}
                                        name={keyName}
                                    />
                                }
                                label={annotationType[keyName]}
                            />
                        })}
                    </FormGroup>
                </div>
                <div className="form-group sentiment">
                    <FormLabel>{sentimentSelection}</FormLabel>
                    <FormGroup>
                        {Object.keys(checkedAnnotations.sentiment).map((keyName, i) => {
                            return <FormControlLabel
                                key={`sentiment-label-${i}`}
                                control={
                                    <Checkbox
                                        key={`sentiment-el-${i}`}
                                        checked={checkedAnnotations.sentiment[keyName]}
                                        onChange={(event) => handleChange(event, "sentiment")}
                                        name={keyName}
                                    />
                                }
                                label={sentiments[keyName]}
                            />
                        })}
                    </FormGroup>
                </div>
            </div>
            <Button
                type="submit"
                className="button-primary submit"
            >{buttonTexts.confirm}</Button>
        </form>
    );
};

export default AnnotationSelection;