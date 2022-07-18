import React from "react";

import Button from "@material-ui/core/Button";

import { buttonTexts } from "../../constants";
import ResponseSection from "../responseSection/responseSection";

const ReplyArea = ({ responseOpen, toggleResponsefield, commentId }) => {
    return (
        <div>
            <div>
                <Button 
                    size="small" 
                    variant="text"
                    className="button-small"
                    onClick={toggleResponsefield}
                >
                    {
                        responseOpen
                        ? buttonTexts.cancel
                        : buttonTexts.comment_reply}
                </Button>
                {
                    responseOpen 
                    ?
                    <div>
                        <ResponseSection
                            toggleResponsefield={toggleResponsefield}
                            commentId={commentId}
                        />
                    </div>
                    : null
                }
            </div>
        </div>
    );
}

export default ReplyArea;