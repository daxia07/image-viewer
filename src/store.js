import {removeByTopic} from "./utils";


function reducer(state = { posts: [], currentIndex: 0,
     fetchedMaxPage: 0, preTopic: "", 
     fetchInProcess: false, skipTopic: "", reFetch: false}, action) {
    switch (action.type) {
        case "FETCH_DATA": {
            const { skipTopic, fetchedMaxPage } = state
            const {data: { posts, fetchInProcess } } = action
            const selectedIndex = removeByTopic(posts, skipTopic, 0)
            const newPosts = posts.slice(selectedIndex)
            return {
                ...state,
                posts: [...state.posts, ...newPosts],
                fetchedMaxPage: newPosts? fetchedMaxPage+1: fetchedMaxPage,
                fetchInProcess,
                reFetch: newPosts.length === 0
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
