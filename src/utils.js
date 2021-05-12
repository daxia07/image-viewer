export const removeByTopic = (arr, topic, startIndex) => {
    let i = startIndex;
    while (i < arr.length) {
      if (arr[i].topic === topic) {
        ++i;
      } else {
        break;
      }
    }
    return Math.min(i, arr.length-1);
  }