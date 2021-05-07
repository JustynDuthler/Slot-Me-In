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

  return startDate + ' ' + startTime + ' - ' + endDate + ' ' + endTime;
};
