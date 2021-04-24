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
            const { meta: { currentIndex, startTime } } = action.data
            const { posts } = state
            posts[currentIndex] = {...posts[currentIndex], startTime}
            return {
                ...state,
                posts
            }
        }
        case "UPDATE_END_TIME": {
            const { currentIndex, endTime } = action.data
            const { posts } = state
            const { views = 0, totalDuration = 0 , startTime} = posts[currentIndex]
            const visitedDate = Date.now()
            posts[currentIndex] = {
                ...posts[currentIndex],
                visitedDate,
                views: views + 1,
                totalDuration: totalDuration + Math.min(endTime - startTime, 5)
            }
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
