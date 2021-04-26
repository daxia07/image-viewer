function reducer(state = { posts: [], currentIndex: 0, fetchedMaxPage: 0, preTopic: ""}, action) {
    switch (action.type) {
        case "FETCH_DATA": {
            const {posts, fetchedMaxPage } = action.data
            return {
                ...state,
                posts: [...state.posts, ...posts],
                fetchedMaxPage
            };
        }
        case "UPDATE_INDEX": {
            const { currentIndex } = action.data
            return {
                ...state,
                currentIndex
            };
        }
        case "UPDATE_META": {
            const { meta: { currentIndex, startTime } } = action.data
            const { posts } = state
            posts[currentIndex] = {...posts[currentIndex], startTime}
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
        case "UPDATE_TOPIC": {
            const { data: { preTopic } } = action
            return {
                ...state,
                preTopic
            };
        }
        default:
            return state;
    }
}

export default reducer;
