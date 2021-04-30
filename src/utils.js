export const removeByTopic = (arr, topic, startIndex) => {
    var i = startIndex;
    while (i < arr.length) {
      if (arr[i].topic === topic) {
        arr.splice(i, 1);
      } else {
        ++i;
      }
    }
    return arr;
  }