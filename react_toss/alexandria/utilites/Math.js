export function randomInRange(start, end) {
  var range = end - start;
  var result = Math.random() * range;
  result += start;
  // return Math.round(result);
  return result;
}
