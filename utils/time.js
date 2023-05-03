
function decodeTime(timeString) {
    // Get the numeric value from the time string
    const value = parseInt(timeString, 10);
    // Get the unit of time from the time string (default to milliseconds)
    const unit = timeString.replace(value, '').trim().toLowerCase() || 'ms';
  
    // Calculate the time value in milliseconds based on the unit of time
    switch (unit) {
      case 's':
        return value * 1000;
      case 'm':
        return value * 60 * 1000;
      case 'h':
        return value * 60 * 60 * 1000;
      default:
        return value;
    }
  }

module.exports = decodeTime