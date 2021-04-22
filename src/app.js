import React, {useEffect, useRef} from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from "react-image-gallery";
const { REACT_APP_API_URI } = process.env;
const PAGE_LIMIT = 5;


const getData = (page) => {
    console.log(`Fetching data for page ${page}`)
    return dispatch => {
        axios.get(`${REACT_APP_API_URI}?page=${page}&limit=${PAGE_LIMIT}`).then(res =>
            dispatch({
                type: "FETCH_DATA",
                data: {...res.data,
                        fetchedMaxPage: page
                }
            })
        );
    };
}

const updateIndex = (currentIndex) => {
    console.log(`Updating index as ${currentIndex}`)
    return dispatch => {
            dispatch({
                type: "UPDATE_INDEX",
                data: {
                    currentIndex
                }
            })
    };
}

const App = () => {
    const content = useSelector(state => state);
    const dispatch = useDispatch();
    const controllerRef = useRef(null);
    const { posts, fetchedMaxPage, currentIndex } = content
    const images = posts? posts.map(post => ({
        original: post.url
    })) : []

    const  onBeforeSlide = async (nextIndex) => {
        // last three item fetch new
        console.log(content)
        console.log(`System nextIndex ${nextIndex}`)
        let fetchedCurrentIndex = controllerRef.current.getCurrentIndex()
        console.log(`Current Index as ${currentIndex}`)
        const swipeRight = nextIndex === 0 || nextIndex > fetchedCurrentIndex
        let currentPage = Math.floor(nextIndex/PAGE_LIMIT) + 1
        if (((currentIndex + 3) % PAGE_LIMIT === 0) && (fetchedMaxPage === currentPage)) {
            // fetch new page and append to the list
            // if successful update max page
            if (swipeRight) {
                dispatch(getData(currentPage+1));
            }
        }
        // increase or decrease index
        const newIndex = swipeRight? currentIndex+1:currentIndex-1
        dispatch(updateIndex(newIndex))
    }

    useEffect(() => {
        document.title = "Sample Viewer"
        if (!fetchedMaxPage) {
            dispatch(getData(1));
        }
    }, [dispatch, fetchedMaxPage]);

    return images ? <ImageGallery items={images}
                                  showThumbnails={false}
                                  lazyLoad
                                  onBeforeSlide={onBeforeSlide}
                                  ref={controllerRef}
                                  startIndex={currentIndex}

    /> : null;
}

export default App;
