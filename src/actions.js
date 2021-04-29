import axios from "axios";
import sleep from "sleep-promise";

const { REACT_APP_API_URI, REACT_APP_PAGE_LIMIT } = process.env;


export const waitForData = () => {
    console.log(`Waiting for data`)
    return dispatch => {
        sleep(2000).then(() => {
            dispatch({
                type: "UPDATE_DATA",
                data: {
                }
            })
        })
    }
}


export const fetchData = page => {
    console.log(`Fetching data for page ${page}`)
    return dispatch => {
        axios.get(`${REACT_APP_API_URI}?page=${page}&limit=${REACT_APP_PAGE_LIMIT}`).then(res =>
            dispatch({
                type: "FETCH_DATA",
                data: {
                    ...res.data,
                    fetchedMaxPage: page,
                    fetchInProcess: false
                }
            })
        );
    };
}

export const updateData = data => {
    console.log(`Update data`)
    return dispatch => {
        dispatch({
            type: "UPDATE_DATA",
            data: {
                ...data
            }
        })
    }
}

export const updatePost = data => {
    console.log(`Update post`)
    const { post } = data
    // delete topic url posted date
    const { startTime, updateDB=true } = post
    delete post["startTime"]
    delete post["updateDB"]
    updateDB && axios.post(
        REACT_APP_API_URI,
        {
            post
        })
        .then(res => console.log(res))
        .catch(e => console.log(e))
    post["startTime"] = startTime
    return dispatch => {
        dispatch({
            type: "UPDATE_POST",
            data: {
                ...data
            }
        })
    }
}