import React from "react";
import AnnotatedMessage from "../annotatedMessage/annotatedMessage";
import "../annotatedMessage/annotatedMessage.css";

const Comment = ({ data, wordLevelAnnotations, messageLevelAnnotations, emoji, sidebar }) => {
    const [responseOpen, setResponseOpen] = React.useState(false);
    
    
    // Opens responsefield for comment reply
    const toggleResponsefield = () => {
        setResponseOpen(!responseOpen)
    }

    return (
        <div>
            <AnnotatedMessage
                data={data}
                wordLevelAnnotations={wordLevelAnnotations}
                messageLevelAnnotations={messageLevelAnnotations}
                emoji={emoji}
                sidebar={sidebar}
                responseOpen={responseOpen}
                toggleResponsefield={toggleResponsefield}
            />
        </div>
    );
}

export default Comment;