import React, {useEffect, useRef} from "react";
import { useDispatch, useSelector } from "react-redux";
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from "react-image-gallery";
import { getData, updateIndex, updateMeta, updateEndTime } from "./actions";
import { useBeforeunload } from 'react-beforeunload';
import axios from "axios";
const { REACT_APP_API_URI } = process.env;



const { REACT_APP_PAGE_LIMIT, REACT_APP_IMAGE_TIMEOUT } = process.env;


const App = () => {
    const content = useSelector(state => state);
    const dispatch = useDispatch();
    const controllerRef = useRef(null);
    const { posts, fetchedMaxPage, currentIndex } = content
    const images = posts? posts.map(post => ({
        original: post.url
    })) : []
    //TODO: disable buttons and detect click and swipes

    const onImageLoad = async event => {
        const {target: { clientWidth, clientHeight }} = event
        let timeout = parseInt(REACT_APP_IMAGE_TIMEOUT)
        let ratio = clientHeight? clientWidth/clientHeight : 0
        if (!ratio) {
            while (timeout > 0) {
                await new Promise(r => setTimeout(r, 20));
                ratio = clientHeight? clientWidth/clientHeight : 0
                if (!!ratio) {
                    break
                }
            }
        }
        // TODO: sort with ratio in the same topic
        if (!ratio) {
            // TODO: delete image in DB
            console.log("Image broken, will delete from DB")
        } else {
            console.log(`Image w/c ratios as: ${ratio}`)
        }
        // record start time
        const startTime = Math.floor(Date.now() / 1000)
        dispatch(updateMeta({ratio, startTime, currentIndex}))
    }

    useBeforeunload(async event => {
        event.preventDefault();
        console.log('after event');
        //TODO: update data
        const { posts } = content
        const viewedPosts = posts.filter( item => !!item.views)
        const res = await axios.post(REACT_APP_API_URI, viewedPosts)
        console.log(res)
    });


    const  onBeforeSlide = async (nextIndex) => {
        // last three item fetch new
        console.log('Data as:')
        console.log(content)
        // console.log(`System nextIndex ${nextIndex}`)
        let fetchedCurrentIndex = controllerRef.current.getCurrentIndex()
        // console.log(`Current Index as ${currentIndex}`)
        const swipeRight = nextIndex === 0 || nextIndex > fetchedCurrentIndex
        let currentPage = Math.floor(nextIndex/REACT_APP_PAGE_LIMIT) + 1
        if (((currentIndex + 3) % REACT_APP_PAGE_LIMIT === 0) && (fetchedMaxPage === currentPage)) {
            // fetch new page and append to the list
            // if successful update max page
            if (swipeRight) {
                dispatch(getData(currentPage+1));
            }
        }
        // increase or decrease index
        const newIndex = swipeRight? currentIndex+1:currentIndex-1
        dispatch(updateIndex(newIndex))
        // update end time for viewing and like tag
        const endTime = Math.floor(Date.now() / 1000)
        dispatch(updateEndTime(currentIndex, endTime))
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
                                  onImageLoad={onImageLoad}

    /> : null;
};

export default App;
