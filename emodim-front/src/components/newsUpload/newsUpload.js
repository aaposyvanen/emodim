import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { updateNewsArticle, updateNewsImage } from "../../actions/newsActions";
import { Button } from "@material-ui/core";
import "../buttons.css";
import "./newsUpload.css";

const imageMimeType = /image\/(png|jpg|jpeg)/i;

const NewsUpload = () => {
    const dispatch = useDispatch();
    const [article, setArticle] = useState(null);
    const [image, setImage] = useState(null);
    const [imageDataURL, setImageDataURL] = useState(null);
    const fileRef = useRef();
    const imageRef = useRef();

    const handleChange = (event) => {
        const file = event.target.files[0];
        setArticle(file);

        const obj_url = URL.createObjectURL(event.target.files[0]);
        dispatch(updateNewsArticle(obj_url));
    }

    const handleImage = (event) => {
        const file = event.target.files[0];
        if (!file.type.match(imageMimeType)) {
            console.log('Image mime type not valid');
            return;
        }
        setImage(file);
    }

    useEffect(() => {
        let fileReader, isCancel = false;
        if (image) {
            fileReader = new FileReader();
            fileReader.onload = (event) => {
                const { result } = event.target;
                if (result && !isCancel) {
                    setImageDataURL(result);
                    dispatch(updateNewsImage(result));
                }
            }
            fileReader.readAsDataURL(image);
        }

        return () => {
            isCancel = true;
            if (fileReader && fileReader.readyState === 1) {
                fileReader.abort();
            }
        }

    }, [image]);    
    
    return (
        <div>
            <div>
                <input
                    id="newsFile"
                    ref={fileRef}
                    type="file"
                    name="newsFile"
                    accept=".htm"
                    onChange={handleChange}
                    className="input"
                />
                <label htmlFor="newsFile">
                    <Button 
                        className="button-primary"
                        onClick={() => fileRef.current.click()}
                    >Lataa uutinen</Button>
                </label>
                {article ?
                    <span className="article-name">{article.name}</span> : null}
            </div>

            <div>
                <input 
                    type="file"
                    ref={imageRef}
                    name="imageFile"
                    accept=".png, .jpg, .jpeg"
                    onChange={handleImage}
                    className="input"
                />
                <label htmlFor='imageFile'>
                    <Button 
                        className="button-primary"
                        onClick={() => imageRef.current.click()}    
                    >Lataa kuva</Button>
                </label>
                {imageDataURL ?
                    <div className="img-preview-wrapper">
                        {
                            <img src={imageDataURL} alt="preview"/>
                        }
                    </div> : null}
            </div>
        </div>
    )
}

export default NewsUpload;