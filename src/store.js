function reducer(state = { posts: [], currentIndex: 0, fetchedMaxPage: 0, preTopic: ""}, action) {
    switch (action.type) {
        case "FETCH_DATA": {
            const {data: { posts, fetchedMaxPage} } = action
            return {
                ...state,
                posts: [...state.posts, ...posts],
                fetchedMaxPage
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
