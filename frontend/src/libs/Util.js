/**
 * getDateSuffix
 * https://stackoverflow.com/questions/15397372/
 * Takes a date and returns the appropriate suffix
 * ex: 1 -> "st" = 1st, 2 -> "nd" = 2nd, 3 -> "rd" = 3rd
 * @param {number} date - Date to get ordinal suffix of
 * @return {string} Suffix for given date
 */
const getDateSuffix = (date) => {
  if (date > 3 && date < 21) return 'th';
  switch (date % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};

/**
   * formatDate
   * Takes a start and end date ISO timestamp string
   * and creates a formatted event date string
   * @param {string} startTimestamp event start timestamp
   * @param {string} endTimestamp event end timestamp
   * @return {string} formatted event date string
   */
exports.formatDate = (startTimestamp, endTimestamp) => {
  const now = new Date(Date.now());
  const start = new Date(startTimestamp);
  const end = new Date(endTimestamp);

  const startTime = start.toLocaleTimeString('en-US', {timeStyle: 'short'});
  const endTime = end.toLocaleTimeString('en-US', {timeStyle: 'short'});

  let startDate;
  let endDate = '';
  // if event starts and ends on same day, don't list end date separately
  if (start.getDate() === end.getDate() &&
  start.getMonth() === end.getMonth() &&
  start.getFullYear() === end.getFullYear()) {
    // don't show year if event is starting this year
    if (start.getFullYear() === now.getFullYear()) {
      startDate = start.toLocaleDateString('en-US',
          {weekday: 'long', month: 'long', day: 'numeric'});
    } else {
      startDate = start.toLocaleDateString('en-US',
          {weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'});
    }
  } else {
    // shortened weekday and month if start and end dates are different
    if (start.getFullYear() === now.getFullYear()) {
      startDate = start.toLocaleDateString('en-US',
          {weekday: 'short', month: 'short', day: 'numeric'});
    } else {
      startDate = start.toLocaleDateString('en-US',
          {weekday: 'short', month: 'short', day: 'numeric',
            year: 'numeric'});
    }
    // don't show year if event is ending this year
    if (end.getFullYear() === now.getFullYear()) {
      endDate = end.toLocaleDateString('en-US',
          {weekday: 'short', month: 'short', day: 'numeric'});
    } else {
      endDate = end.toLocaleDateString('en-US',
          {weekday: 'short', month: 'short', day: 'numeric',
            year: 'numeric'});
    }
  }

  // add suffix to date (ex: September 1 -> September 1st)
  const startSuffix = getDateSuffix(start.getDate());
  let endSuffix = '';
  if (endDate.length > 0) endSuffix = getDateSuffix(end.getDate());

  return startDate + startSuffix + ' ' + startTime +
      ' - ' + endDate + endSuffix + ' ' + endTime;
};

/**
 * cropImage - taken from https://pqina.nl/blog/cropping-images-to-an-aspect-
 *  ratio-with-javascript/
 * @param {string} url - The source image
 * @param {number} aspectRatio - The aspect ratio
 * @return {Promise<HTMLCanvasElement>} A Promise that resolves with the
 * resulting image as a canvas element
 */
exports.cropImage = (url, aspectRatio) => {
  // we return a Promise that gets resolved with our canvas element
  return new Promise((resolve) => {
    // this image will hold our source image data
    const inputImage = new Image();

    // we want to wait for our image to load
    inputImage.onload = () => {
      // let's store the width and height of our image
      const inputWidth = inputImage.naturalWidth;
      const inputHeight = inputImage.naturalHeight;

      // get the aspect ratio of the input image
      const inputImageAspectRatio = inputWidth / inputHeight;

      // if it's bigger than our target aspect ratio
      let outputWidth = inputWidth;
      let outputHeight = inputHeight;
      if (inputImageAspectRatio > aspectRatio) {
        outputWidth = inputHeight * aspectRatio;
      } else if (inputImageAspectRatio < aspectRatio) {
        outputHeight = inputWidth / aspectRatio;
      }

      // calculate the position to draw the image at
      const outputX = (outputWidth - inputWidth) * 0.5;
      const outputY = (outputHeight - inputHeight) * 0.5;

      // create a canvas that will present the output image
      const outputImage = document.createElement('canvas');

      // set it to the same size as the image
      outputImage.width = outputWidth;
      outputImage.height = outputHeight;

      // draw our image at position 0, 0 on the canvas
      const ctx = outputImage.getContext('2d');
      ctx.drawImage(inputImage, outputX, outputY);
      resolve(outputImage);
    };

    // start loading our image
    inputImage.src = url;
  });
};
