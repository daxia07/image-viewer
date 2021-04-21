import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from "react-image-gallery";
const { REACT_APP_API_URI } = process.env;

// pagination
const PAGE_LIMIT = 10;

const ImagesGallery = () => {
    const [images, setImages] = React.useState(null);
    const [fetchedMaxPage, setFetchedMaxPage] = React.useState(1);
    const  onSlide = async (currentIndex) => {
        // last three item fetch new
        let currentPage = Math.floor(currentIndex/PAGE_LIMIT) + 1
        if (((currentIndex + 3) % PAGE_LIMIT === 0) && (fetchedMaxPage>=currentPage)) {
            // fetch new page and append to the list
            console.log('Fetching data for next page')
            // if successful update max page
            const response = await axios.get(REACT_APP_API_URI);
            setFetchedMaxPage(fetchedMaxPage+1)
            console.log(`${fetchedMaxPage} pages retrieved`)
        }
        console.log(currentIndex)
    }

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
                                  lazyLoad
                                  onSlide={onSlide}
    /> : null;
};

const rootElement = document.getElementById("root");
ReactDOM.render(<ImagesGallery />, rootElement);
