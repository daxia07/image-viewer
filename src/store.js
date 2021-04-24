function reducer(state = { posts: [], currentIndex: 0, fetchedMaxPage: 0}, action) {
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
            const { meta: { currentIndex, ratio, startTime } } = action.data
            const { posts } = state
            posts[currentIndex] = {...posts[currentIndex], ratio, startTime, view: 1}
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
