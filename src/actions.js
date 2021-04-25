import axios from "axios";
import moment from "moment";

const { REACT_APP_API_URI, REACT_APP_PAGE_LIMIT } = process.env;


export const getData = (page) => {
    console.log(`Fetching data for page ${page}`)
    return dispatch => {
        axios.get(`${REACT_APP_API_URI}?page=${page}&limit=${REACT_APP_PAGE_LIMIT}`).then(res =>
            dispatch({
                type: "FETCH_DATA",
                data: {...res.data,
                    fetchedMaxPage: page
                }
            })
        );
    };
}

export const updateIndex = (currentIndex) => {
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

export const updateMeta = meta => {
    console.log(`Updating meta for posts`)
    return dispatch => {
        dispatch({
            type: "UPDATE_META",
            data: {
                meta
            }
        })
    }
}

export const updateEndTime = (currentIndex, endTime, post) => {
    console.log(`Updating endTime for image ${currentIndex}`)
    const { views = 0, totalDuration = 0 , startTime} = post
    const visitedDate = moment(Date.now()).format('YYYY-MM-DD[T]HH:mm:ss');
    const newPost = {
        ...post,
        visitedDate,
        views: views + 1,
        totalDuration: totalDuration + Math.min(endTime - startTime, 5),
    }
    console.log(`Posting data`)
    console.log(newPost)
    axios.post(
        REACT_APP_API_URI,
        {
            post: newPost
        }, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => console.log(res))
        .catch(e => console.log(e))
    return dispatch => {
        dispatch({
            type: "UPDATE_END_TIME",
            data: {
                post: newPost,
                currentIndex,
            }
        })
    }
}