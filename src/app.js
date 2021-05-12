import React, {useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from "react-image-gallery";
import {fetchData, updateData, updatePost} from "./actions";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSwipeable } from "react-swipeable";
import moment from "moment";
import { removeByTopic } from "./utils";


const { REACT_APP_PRELOAD="20" } = process.env;


const App = () => {
    const content = useSelector(state => state);
    const dispatch = useDispatch();
    const controllerRef = useRef(null);
    const { posts, fetchedMaxPage, currentIndex, fetchInProcess, reFetch } = content
    const currentPost = posts[currentIndex]
    const images = posts? posts.map(post => ({
        original: post.url
    })) : []


    const handlers = useSwipeable({
        onSwipedUp: () => console.log("Up"),
        onSwipedDown: () => {
            console.log("Down")
            //mark posts in between as dislikes
            //switch to a new index
            const {topic} = posts[currentIndex]
            toast(`Removing topic ${topic}`)
            // new action to delete post in reducer
            const firstNonSkipPostIndex = removeByTopic(posts, topic, currentIndex)
            const nextIndex = Math.min(firstNonSkipPostIndex, posts.length-1)
            controllerRef.current.slideToIndex(nextIndex)
            dispatch(updatePost({post: {...currentPost, increaseDislike: 1}}))
            dispatch(updateData({currentIndex: nextIndex, skipTopic: topic, fetchInProcess: true}))
            dispatch(fetchData(posts.length-currentIndex-1))
        },
        onTap: event => {
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
        if ((currentIndex === posts.length-1) && !fetchInProcess) {
            toast("Fetching Data")
            dispatch(updateData({ fetchInProcess: true}))
            dispatch(fetchData(0))
        }
    }

    const onImageError = event => {
        console.log('error image')
        console.log(currentPost.url)
        //TODO delete image and swipe to the next
        if (currentIndex !== posts.length-1) {
            controllerRef.current.slideToIndex(currentIndex+1)
            dispatch(updateData({currentIndex: currentIndex+1}))
        } else {
            console.log('Fetch data')
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
        if (((currentIndex + parseInt(REACT_APP_PRELOAD)) - posts.length) >= 0) {
            // fetch new page and append to the list
            // if successful update max page
            if (swipeRight && !fetchInProcess) {
                dispatch(updateData({ fetchInProcess: true}))
                // how many remaining images to skip
                dispatch(fetchData(posts.length-currentIndex-1));
            }
        }

        // increase or decrease index
        const newIndex = swipeRight? currentIndex+1:currentIndex-1
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
            dispatch(fetchData(0));
        }
        if (!fetchInProcess && reFetch) {
            dispatch(updateData({ fetchInProcess: true }))
            dispatch(fetchData(0));
        }
    });

    return images ?
        <div {...handlers} style={{height: '100%'}}>
            <ImageGallery items={images}
                          showThumbnails={false}
                          lazyLoad
                          onBeforeSlide={onBeforeSlide}
                          ref={controllerRef}
                          startIndex={currentIndex}
                          onImageLoad={onImageLoad}
                          showNav={false}
                          infinite={false}
                          showIndex
                          onImageError={onImageError}
            />
            <ToastContainer position="bottom-center"
                            autoClose={2000}
                            hideProgressBar={true}/>
        </div>
         : null;
};

export default App;
