import React from "react";
import AnnotationSelection from "../annotationSelection/annotationSelection";
import NewsUpload from "../newsUpload/newsUpload";
import "./selectionPage.css"

const SelectionPage = () => {
    return (
        <div className="selection-area">
            <NewsUpload/>
            <AnnotationSelection/>
        </div>
    )
}

export default SelectionPage;