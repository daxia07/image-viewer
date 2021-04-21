import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from "react-image-gallery";
const { REACT_APP_API_URI } = process.env;


const ImagesGallery = () => {
    const [images, setImages] = React.useState(null);

    React.useEffect(() => {
        let shouldCancel = false;
        const call = async () => {
            const response = await axios.get(REACT_APP_API_URI);
            if (!shouldCancel && response.data.posts && response.data.posts.length > 0) {
                const imageList = response.data.posts.map(post => ({
                    original: post.url
                }))
                setImages(imageList)
            }
        };
        call();
        return () => (shouldCancel = true);
    }, []);

    return images ? <ImageGallery items={images}
                                  showThumbnails={false}
    /> : null;
};

const rootElement = document.getElementById("root");
ReactDOM.render(<ImagesGallery />, rootElement);
