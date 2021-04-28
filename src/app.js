import React, {useEffect, useRef} from "react";
import { useDispatch, useSelector } from "react-redux";
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from "react-image-gallery";
import { fetchData, updateData, updatePost } from "./actions";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSwipeable } from "react-swipeable";
import moment from "moment";


const { REACT_APP_PAGE_LIMIT } = process.env;


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
            // console.log(event)
            const { event: { target: {tagName }, pageX }} = event
            if ((tagName === 'svg') || !pageX) {
                return
            }
            const {innerWidth} = window
            if (pageX < 0.3 * innerWidth) {
                console.log("Left tap")
                controllerRef.current.slideToIndex(Math.max(currentIndex-1, 0))
            } else if (pageX < 0.7 * innerWidth) {
                console.log("Middle tap")
                const { topic } = posts[currentIndex]
                toast(`💖 +1 for ${topic}`)
                const { likes=0 } = posts[currentIndex]
                const newPost = {
                    ...posts[currentIndex],
                    likes: likes+1
                }
                dispatch(updatePost({index: currentIndex, post: newPost}))
            } else {
                console.log("Right tap")
                // toast(`Right tap on ${pageX}/${innerWidth}`)
                controllerRef.current.slideToIndex(Math.min(currentIndex+1, posts.length-1))
            }
        },
        preventDefaultTouchmoveEvent: true,
        trackMouse: true
    });

    const onImageLoad = async event => {
        const { topic } = posts[currentIndex]
        const { preTopic } = content
        if ((topic !== preTopic) && (currentIndex === 0)) {
            document.title = topic
            toast(topic)
            dispatch(updateData({preTopic: topic}))
        }
        // record start time
        const startTime = Math.floor(Date.now() / 1000)
        const newPost = {
            ...posts[currentIndex],
            startTime,
            updateDB: false
        }
        dispatch(updatePost({index: currentIndex, post: newPost}))
    }

    const  onBeforeSlide = async (nextIndex) => {
        // last three item fetch new
        const { topic } = posts[currentIndex]
        const { preTopic } = content
        if (topic !== preTopic) {
            document.title = topic
            toast(preTopic)
            dispatch(updateData({preTopic: topic}))
        }
        // console.log(`System nextIndex ${nextIndex}`)
        let fetchedCurrentIndex = controllerRef.current.getCurrentIndex()
        // console.log(`Current Index as ${currentIndex}`)
        const swipeRight = nextIndex === 0 || nextIndex > fetchedCurrentIndex
        let currentPage = Math.floor(nextIndex/REACT_APP_PAGE_LIMIT) + 1
        if (((currentIndex + 3) % REACT_APP_PAGE_LIMIT === 0) && (fetchedMaxPage === currentPage)) {
            // fetch new page and append to the list
            // if successful update max page
            if (swipeRight) {
                dispatch(fetchData(currentPage + 1));
            }
        }
        // increase or decrease index
        const newIndex = swipeRight? currentIndex+1:currentIndex-1
        dispatch(updateData({currentIndex: newIndex}))
        // dispatch(updateIndex(newIndex))
        // update end time for viewing and like tag
        const endTime = Math.floor(Date.now() / 1000)
        const post = posts[currentIndex]
        const { views = 0, totalDuration = 0 , startTime} = post
        const visitedDate = moment(Date.now()).format('YYYY-MM-DD[T]HH:mm:ss');
        const newPost = {
            ...post,
            visitedDate,
            views: views + 1,
            totalDuration: totalDuration + Math.min(endTime - startTime, 5),
        }
        dispatch(updatePost({index: currentIndex, post: newPost}))
    }

    useEffect(() => {
        if (!fetchedMaxPage) {
            dispatch(fetchData(1));
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
                          showIndex
            />
            <ToastContainer position="bottom-center"
                            autoClose={2000}
                            hideProgressBar={true}/>
        </div>
         : null;
};

export default App;
