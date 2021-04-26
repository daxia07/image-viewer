export const getNextTopicIndex = (topic, currentIndex, posts) => {
    for (let i = currentIndex; i < posts.length; i++) {
        if (topic !== posts[currentIndex].topic) {
            return i
        }
    }
    return posts.length - 1
}
