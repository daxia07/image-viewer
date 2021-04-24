import axios from "axios";
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