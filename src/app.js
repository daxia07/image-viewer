import React, {useEffect, useRef} from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from "react-image-gallery";
const { REACT_APP_API_URI } = process.env;
const PAGE_LIMIT = 5;


const getData = (page, currentIndex) => {
    console.log(`Fetching data for page ${page}`)
    return dispatch => {
        axios.get(`${REACT_APP_API_URI}?page=${page}&limit=${PAGE_LIMIT}`).then(res =>
            dispatch({
                type: "FETCH_DATA",
                data: {...res.data,
                        fetchedMaxPage: page,
                        currentIndex
                }
            })
        );
    };
}

const App = () => {
    const content = useSelector(state => state);
    const dispatch = useDispatch();
    const controllerRef = useRef(null);

    const  onBeforeSlide = async (nextIndex) => {
        // last three item fetch new
        let fetchedCurrentIndex = controllerRef.current.getCurrentIndex()
        console.log(`Current Index as ${fetchedCurrentIndex}`)
        let currentPage = Math.floor(nextIndex/PAGE_LIMIT) + 1
        if (((nextIndex + 3) % PAGE_LIMIT === 0) && (fetchedMaxPage === currentPage)) {
            // fetch new page and append to the list
            console.log('Fetching data for next page')
            // if successful update max page
            dispatch(getData(currentPage+1, fetchedCurrentIndex));
        }
    }

    useEffect(() => {
        dispatch(getData(1, 0));
    }, []);

    const { data } = content
    const { posts, fetchedMaxPage, currentIndex } = data
    const images = posts? posts.map(post => ({
        original: post.url
    })) : []

    return images ? <ImageGallery items={images}
                                  showThumbnails={false}
                                  lazyLoad
                                  onBeforeSlide={onBeforeSlide}
                                  ref={controllerRef}
                                  startIndex={currentIndex}

    /> : null;
}

export default App;
