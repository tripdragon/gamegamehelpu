

export function findImportedModel(search, array) {
  for (var i = 0; i < array.length; i++) {
    if (array[i].name === search) {
      return array[i];
    }
  }
  return null;
}


// https://gist.github.com/JesterXL/8a124a812811f9df600e6a1fdc0013af
export function randomInRange(start, end) {
  var range = end - start;
  var result = Math.random() * range;
  result += start;
  // return Math.round(result);
  return result;
}
