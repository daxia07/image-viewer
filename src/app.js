import React, {useEffect, useRef} from "react";
import { useDispatch, useSelector } from "react-redux";
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from "react-image-gallery";
import { getData, updateIndex, updateMeta, updateEndTime, updateTopic } from "./actions";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSwipeable } from "react-swipeable";


const { REACT_APP_PAGE_LIMIT, REACT_APP_IMAGE_TIMEOUT } = process.env;


const App = () => {
    const content = useSelector(state => state);
    const dispatch = useDispatch();
    const controllerRef = useRef(null);
    const { posts, fetchedMaxPage, currentIndex } = content
    const images = posts? posts.map(post => ({
        original: post.url
    })) : []

    const handlers = useSwipeable({
        onSwipedUp: () => console.log("Up"),
        onSwipedDown: () => {
            console.log("Down")
            //TODO: fetch data until the last post comes with a different topic
            //mark posts in between as dislikes
            //switch to a new index
        },
        onTap: (event) => {
            console.log(event)
            const { event: { target: {tagName } }} = event
            if (tagName === 'svg') {
                return
            }
            const { event: { pageX }} = event
            if (pageX < 0.3 * window.innerWidth) {
                console.log("Left tap")
                controllerRef.current.slideToIndex(Math.max(currentIndex-1, 0))
            } else if (pageX < 0.7 * window.innerWidth) {
                console.log("Middle tap")
                const { topic } = posts[currentIndex] 
                toast(topic)
                // TODO: tag as like 
            } else {
                console.log("Right tap")
                controllerRef.current.slideToIndex(Math.min(currentIndex+1, posts.length-1))
            }
        },
        preventDefaultTouchmoveEvent: true,
        trackMouse: true
    });

    const onImageLoad = async event => {
        const { topic } = posts[currentIndex]
        const { preTopic } = content
        if (topic !== preTopic ) {
            document.title = topic
            toast(topic)
            dispatch(updateTopic(topic))
        }
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
            //TODO: fetch from DB
            console.log(`Image w/c ratios as: ${ratio}`)
        }
        // record start time
        const startTime = Math.floor(Date.now() / 1000)
        dispatch(updateMeta({ratio, startTime, currentIndex}))
    }

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
        dispatch(updateEndTime(currentIndex, endTime, posts[currentIndex]))
    }

    useEffect(() => {
        // document.title = "Sample Viewer"
        if (!fetchedMaxPage) {
            dispatch(getData(1));
        }
    });

    return images ?
        <div {...handlers}>
            <ImageGallery items={images}
                          showThumbnails={false}
                          lazyLoad
                          onBeforeSlide={onBeforeSlide}
                          ref={controllerRef}
                          startIndex={currentIndex}
                          onImageLoad={onImageLoad}
                          showNav={false}
            />
            <ToastContainer position="bottom-center"
                            autoClose={2000}
                            hideProgressBar={true}/>
        </div>
         : null;
};

export default App;
