import React, {useRef} from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from "react-image-gallery";
const { REACT_APP_API_URI } = process.env;

// pagination
const PAGE_LIMIT = 5;

const ImagesGallery = () => {
    let [images, setImages] = React.useState(null);
    const [fetchedMaxPage, setFetchedMaxPage] = React.useState(1);
    const controllerRef = useRef(null);
    const  onBeforeSlide = async (nextIndex) => {
        // last three item fetch new
        let currentIndex = controllerRef.current.getCurrentIndex()
        console.log(`Current Index as ${currentIndex}`)
        let currentPage = Math.floor(nextIndex/PAGE_LIMIT) + 1
        if (((nextIndex + 3) % PAGE_LIMIT === 0) && (fetchedMaxPage === currentPage)) {
            // fetch new page and append to the list
            console.log('Fetching data for next page')
            // if successful update max page
            const response = await axios.get(`${REACT_APP_API_URI}?page=${currentPage+1}&limit=${PAGE_LIMIT}`);
            if (response.data.posts && response.data.posts.length > 0) {
                const imageList = response.data.posts.map(post => ({
                    original: post.url
                }))
                console.log(controllerRef.current.getCurrentIndex())
                // slice list to change sequence
                const newArray = [...images.slice(nextIndex, images.length), ...imageList, ...images.slice(0, nextIndex)]
                console.log(newArray)
                setImages(newArray)
                // setImages([...images,...imageList])
                // controllerRef.current.slideToIndex(0)
                setFetchedMaxPage(fetchedMaxPage+1)
                currentIndex = controllerRef.current.getCurrentIndex()
                console.log(`Current index after update as ${currentIndex}`)
            }
            console.log(`${fetchedMaxPage} pages retrieved`)
            console.log(`Current images are`)
            console.log(images)
        }
    }

    React.useEffect(() => {
        let shouldCancel = false;
        const call = async () => {
            const response = await axios.get(REACT_APP_API_URI);
            if (!shouldCancel && response.data.posts && response.data.posts.length > 0) {
                const imageList = response.data.posts.map(post => ({
                    original: post.url
                }))
                console.log(imageList)
                setImages(imageList)
            }
        };
        call();
        return () => (shouldCancel = true);
    }, []);

    return images ? <ImageGallery items={images}
                                  showThumbnails={false}
                                  lazyLoad
                                  onBeforeSlide={onBeforeSlide}
                                  // onSlide={onSlide}
                                  ref={controllerRef}
    /> : null;
};

const rootElement = document.getElementById("root");
ReactDOM.render(<ImagesGallery />, rootElement);
