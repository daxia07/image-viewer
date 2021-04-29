import React, {useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from "react-image-gallery";
import {fetchData, updateData, updatePost} from "./actions";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSwipeable } from "react-swipeable";
import moment from "moment";


const { REACT_APP_PAGE_LIMIT="50", REACT_APP_PRELOAD="20" } = process.env;


const App = () => {
    const content = useSelector(state => state);
    const dispatch = useDispatch();
    const controllerRef = useRef(null);
    const { posts, fetchedMaxPage, currentIndex, fetchInProcess } = content
    const currentPost = posts[currentIndex]
    const images = posts? posts.map(post => ({
        original: post.url
    })) : []

    const handlers = useSwipeable({
        onSwipedUp: () => console.log("Up"),
        onSwipedDown: () => {
            console.log("Down")
            toast(`Removing current topic`)
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
                const { topic } = currentPost
                toast(`💖 +1 for ${topic}`)
                const { likes=0 } = currentPost
                const newPost = {
                    ...currentPost,
                    likes: likes+1
                }
                dispatch(updatePost({index: currentIndex, post: newPost}))
            } else {
                console.log("Right tap")
                controllerRef.current.slideToIndex(Math.min(currentIndex+1, posts.length-1))
            }
        },
        preventDefaultTouchmoveEvent: true,
        trackMouse: true
    });

    const onImageLoad = async event => {
        // TODO: add spinner
        let { topic, startTime } = currentPost
        if ((currentIndex === 0) && (!startTime)) {
            document.title = topic
            toast(topic)
        }
        // record start time
        if (!startTime) {
            startTime = Math.floor(Date.now() / 1000)
            const newPost = {
                ...currentPost,
                startTime,
                updateDB: false
            }
            dispatch(updatePost({index: currentIndex, post: newPost}))
        }
    }

    const  onBeforeSlide = async nextIndex => {
        const { topic } = currentPost
        const { topic: nextTopic } = posts[nextIndex]
        if (topic !== nextTopic) {
            document.title = topic
            toast(nextTopic)
        }
        let fetchedCurrentIndex = controllerRef.current.getCurrentIndex()
        const swipeRight = nextIndex === 0 || nextIndex > fetchedCurrentIndex
        let currentPage = Math.floor(nextIndex/REACT_APP_PAGE_LIMIT) + 1
        if ((((currentIndex + parseInt(REACT_APP_PRELOAD)) % REACT_APP_PAGE_LIMIT) === 0) && (fetchedMaxPage === currentPage)) {
            // fetch new page and append to the list
            // if successful update max page
            if (swipeRight) {
                if (!fetchInProcess) {
                    dispatch(fetchData(currentPage + 1));
                    dispatch(updateData({ fetchInProcess: true}))
                }
            }
        }
        // increase or decrease index
        const newIndex = swipeRight? currentIndex+1:currentIndex-1
        // dispatch(updateIndex(newIndex))
        // update end time for viewing and like tag
        const endTime = Math.floor(Date.now() / 1000)
        const post = currentPost
        const { views = 0, totalDuration = 0 , startTime} = post
        const visitedDate = moment(Date.now()).format('YYYY-MM-DD[T]HH:mm:ss');
        const newPost = {
            ...post,
            visitedDate,
            views: views + 1,
            totalDuration: totalDuration + Math.min(endTime - startTime, 5),
        }
        dispatch(updateData({currentIndex: newIndex}))
        dispatch(updatePost({index: currentIndex, post: newPost}))
    }

    useEffect(() => {
        if (!fetchedMaxPage && !fetchInProcess) {
            dispatch(updateData({ fetchInProcess: true }))
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
                          infinite={false}
            />
            <ToastContainer position="bottom-center"
                            autoClose={2000}
                            hideProgressBar={true}/>
        </div>
         : null;
};

export default App;
