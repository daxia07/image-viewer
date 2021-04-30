import {removeByTopic} from "./utils";


function reducer(state = { posts: [], currentIndex: 0,
     fetchedMaxPage: 0, preTopic: "", 
     fetchInProcess: false, skipTopic: ""}, action) {
    switch (action.type) {
        case "FETCH_DATA": {
            const { skipTopic, currentIndex } = state
            const {data: { posts, fetchedMaxPage, fetchInProcess } } = action
            let updatedPosts = [...state.posts, ...posts]
            updatedPosts = removeByTopic(updatedPosts, skipTopic, currentIndex)
            return {
                ...state,
                posts: updatedPosts,
                fetchedMaxPage,
                fetchInProcess
            };
        }
        case "UPDATE_DATA": {
            const { data: updates } = action
            return {
                ...state,
                ...updates
            }
        }
        case "UPDATE_POST": {
            const { data: {index, post} } = action
            const { posts } = state
            posts[index] = post
            return {
                ...state,
                posts
            }
        }
        case "UPDATE_END_TIME": {
            const { currentIndex, post } = action.data
            const { posts } = state
            posts[currentIndex] = post
            return {
                ...state,
                posts
            }
        }
        default:
            return state;
    }
}

export default reducer;
