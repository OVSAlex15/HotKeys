// node_modules/date-fns/esm/_lib/toInteger/index.js
function toInteger(dirtyNumber) {
  if (dirtyNumber === null || dirtyNumber === true || dirtyNumber === false) {
    return NaN;
  }
  var number = Number(dirtyNumber);
  if (isNaN(number)) {
    return number;
  }
  return number < 0 ? Math.ceil(number) : Math.floor(number);
}

// node_modules/date-fns/esm/_lib/requiredArgs/index.js
function requiredArgs(required, args) {
  if (args.length < required) {
    throw new TypeError(required + " argument" + (required > 1 ? "s" : "") + " required, but only " + args.length + " present");
  }
}

// node_modules/date-fns/esm/toDate/index.js
function toDate(argument) {
  requiredArgs(1, arguments);
  var argStr = Object.prototype.toString.call(argument);
  if (argument instanceof Date || typeof argument === "object" && argStr === "[object Date]") {
    return new Date(argument.getTime());
  } else if (typeof argument === "number" || argStr === "[object Number]") {
    return new Date(argument);
  } else {
    if ((typeof argument === "string" || argStr === "[object String]") && typeof console !== "undefined") {
      console.warn("Starting with v2.0.0-beta.1 date-fns doesn't accept strings as date arguments. Please use `parseISO` to parse strings. See: https://git.io/fjule");
      console.warn(new Error().stack);
    }
    return /* @__PURE__ */ new Date(NaN);
  }
}

// node_modules/date-fns/esm/addDays/index.js
function addDays(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var date = toDate(dirtyDate);
  var amount = toInteger(dirtyAmount);
  if (isNaN(amount)) {
    return /* @__PURE__ */ new Date(NaN);
  }
  if (!amount) {
    return date;
  }
  date.setDate(date.getDate() + amount);
  return date;
}

// node_modules/date-fns/esm/addMonths/index.js
function addMonths(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var date = toDate(dirtyDate);
  var amount = toInteger(dirtyAmount);
  if (isNaN(amount)) {
    return /* @__PURE__ */ new Date(NaN);
  }
  if (!amount) {
    return date;
  }
  var dayOfMonth = date.getDate();
  var endOfDesiredMonth = new Date(date.getTime());
  endOfDesiredMonth.setMonth(date.getMonth() + amount + 1, 0);
  var daysInMonth = endOfDesiredMonth.getDate();
  if (dayOfMonth >= daysInMonth) {
    return endOfDesiredMonth;
  } else {
    date.setFullYear(endOfDesiredMonth.getFullYear(), endOfDesiredMonth.getMonth(), dayOfMonth);
    return date;
  }
}

// node_modules/date-fns/esm/add/index.js
function add(dirtyDate, duration) {
  requiredArgs(2, arguments);
  if (!duration || typeof duration !== "object") return /* @__PURE__ */ new Date(NaN);
  var years = duration.years ? toInteger(duration.years) : 0;
  var months2 = duration.months ? toInteger(duration.months) : 0;
  var weeks = duration.weeks ? toInteger(duration.weeks) : 0;
  var days2 = duration.days ? toInteger(duration.days) : 0;
  var hours = duration.hours ? toInteger(duration.hours) : 0;
  var minutes = duration.minutes ? toInteger(duration.minutes) : 0;
  var seconds = duration.seconds ? toInteger(duration.seconds) : 0;
  var date = toDate(dirtyDate);
  var dateWithMonths = months2 || years ? addMonths(date, months2 + years * 12) : date;
  var dateWithDays = days2 || weeks ? addDays(dateWithMonths, days2 + weeks * 7) : dateWithMonths;
  var minutesToAdd = minutes + hours * 60;
  var secondsToAdd = seconds + minutesToAdd * 60;
  var msToAdd = secondsToAdd * 1e3;
  var finalDate = new Date(dateWithDays.getTime() + msToAdd);
  return finalDate;
}

// node_modules/date-fns/esm/isWeekend/index.js
function isWeekend(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var day = date.getDay();
  return day === 0 || day === 6;
}

// node_modules/date-fns/esm/isSunday/index.js
function isSunday(dirtyDate) {
  requiredArgs(1, arguments);
  return toDate(dirtyDate).getDay() === 0;
}

// node_modules/date-fns/esm/isSaturday/index.js
function isSaturday(dirtyDate) {
  requiredArgs(1, arguments);
  return toDate(dirtyDate).getDay() === 6;
}

// node_modules/date-fns/esm/addBusinessDays/index.js
function addBusinessDays(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var date = toDate(dirtyDate);
  var startedOnWeekend = isWeekend(date);
  var amount = toInteger(dirtyAmount);
  if (isNaN(amount)) return /* @__PURE__ */ new Date(NaN);
  var hours = date.getHours();
  var sign = amount < 0 ? -1 : 1;
  var fullWeeks = toInteger(amount / 5);
  date.setDate(date.getDate() + fullWeeks * 7);
  var restDays = Math.abs(amount % 5);
  while (restDays > 0) {
    date.setDate(date.getDate() + sign);
    if (!isWeekend(date)) restDays -= 1;
  }
  if (startedOnWeekend && isWeekend(date) && amount !== 0) {
    if (isSaturday(date)) date.setDate(date.getDate() + (sign < 0 ? 2 : -1));
    if (isSunday(date)) date.setDate(date.getDate() + (sign < 0 ? 1 : -2));
  }
  date.setHours(hours);
  return date;
}

// node_modules/date-fns/esm/addMilliseconds/index.js
function addMilliseconds(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var timestamp = toDate(dirtyDate).getTime();
  var amount = toInteger(dirtyAmount);
  return new Date(timestamp + amount);
}

// node_modules/date-fns/esm/addHours/index.js
var MILLISECONDS_IN_HOUR = 36e5;
function addHours(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var amount = toInteger(dirtyAmount);
  return addMilliseconds(dirtyDate, amount * MILLISECONDS_IN_HOUR);
}

// node_modules/date-fns/esm/startOfWeek/index.js
function startOfWeek(dirtyDate, dirtyOptions) {
  requiredArgs(1, arguments);
  var options = dirtyOptions || {};
  var locale2 = options.locale;
  var localeWeekStartsOn = locale2 && locale2.options && locale2.options.weekStartsOn;
  var defaultWeekStartsOn = localeWeekStartsOn == null ? 0 : toInteger(localeWeekStartsOn);
  var weekStartsOn = options.weekStartsOn == null ? defaultWeekStartsOn : toInteger(options.weekStartsOn);
  if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
    throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
  }
  var date = toDate(dirtyDate);
  var day = date.getDay();
  var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  date.setDate(date.getDate() - diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

// node_modules/date-fns/esm/startOfISOWeek/index.js
function startOfISOWeek(dirtyDate) {
  requiredArgs(1, arguments);
  return startOfWeek(dirtyDate, {
    weekStartsOn: 1
  });
}

// node_modules/date-fns/esm/getISOWeekYear/index.js
function getISOWeekYear(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var year = date.getFullYear();
  var fourthOfJanuaryOfNextYear = /* @__PURE__ */ new Date(0);
  fourthOfJanuaryOfNextYear.setFullYear(year + 1, 0, 4);
  fourthOfJanuaryOfNextYear.setHours(0, 0, 0, 0);
  var startOfNextYear = startOfISOWeek(fourthOfJanuaryOfNextYear);
  var fourthOfJanuaryOfThisYear = /* @__PURE__ */ new Date(0);
  fourthOfJanuaryOfThisYear.setFullYear(year, 0, 4);
  fourthOfJanuaryOfThisYear.setHours(0, 0, 0, 0);
  var startOfThisYear = startOfISOWeek(fourthOfJanuaryOfThisYear);
  if (date.getTime() >= startOfNextYear.getTime()) {
    return year + 1;
  } else if (date.getTime() >= startOfThisYear.getTime()) {
    return year;
  } else {
    return year - 1;
  }
}

// node_modules/date-fns/esm/startOfISOWeekYear/index.js
function startOfISOWeekYear(dirtyDate) {
  requiredArgs(1, arguments);
  var year = getISOWeekYear(dirtyDate);
  var fourthOfJanuary = /* @__PURE__ */ new Date(0);
  fourthOfJanuary.setFullYear(year, 0, 4);
  fourthOfJanuary.setHours(0, 0, 0, 0);
  var date = startOfISOWeek(fourthOfJanuary);
  return date;
}

// node_modules/date-fns/esm/_lib/getTimezoneOffsetInMilliseconds/index.js
function getTimezoneOffsetInMilliseconds(date) {
  var utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
  utcDate.setUTCFullYear(date.getFullYear());
  return date.getTime() - utcDate.getTime();
}

// node_modules/date-fns/esm/startOfDay/index.js
function startOfDay(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  date.setHours(0, 0, 0, 0);
  return date;
}

// node_modules/date-fns/esm/differenceInCalendarDays/index.js
var MILLISECONDS_IN_DAY = 864e5;
function differenceInCalendarDays(dirtyDateLeft, dirtyDateRight) {
  requiredArgs(2, arguments);
  var startOfDayLeft = startOfDay(dirtyDateLeft);
  var startOfDayRight = startOfDay(dirtyDateRight);
  var timestampLeft = startOfDayLeft.getTime() - getTimezoneOffsetInMilliseconds(startOfDayLeft);
  var timestampRight = startOfDayRight.getTime() - getTimezoneOffsetInMilliseconds(startOfDayRight);
  return Math.round((timestampLeft - timestampRight) / MILLISECONDS_IN_DAY);
}

// node_modules/date-fns/esm/setISOWeekYear/index.js
function setISOWeekYear(dirtyDate, dirtyISOWeekYear) {
  requiredArgs(2, arguments);
  var date = toDate(dirtyDate);
  var isoWeekYear = toInteger(dirtyISOWeekYear);
  var diff = differenceInCalendarDays(date, startOfISOWeekYear(date));
  var fourthOfJanuary = /* @__PURE__ */ new Date(0);
  fourthOfJanuary.setFullYear(isoWeekYear, 0, 4);
  fourthOfJanuary.setHours(0, 0, 0, 0);
  date = startOfISOWeekYear(fourthOfJanuary);
  date.setDate(date.getDate() + diff);
  return date;
}

// node_modules/date-fns/esm/addISOWeekYears/index.js
function addISOWeekYears(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var amount = toInteger(dirtyAmount);
  return setISOWeekYear(dirtyDate, getISOWeekYear(dirtyDate) + amount);
}

// node_modules/date-fns/esm/addMinutes/index.js
var MILLISECONDS_IN_MINUTE = 6e4;
function addMinutes(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var amount = toInteger(dirtyAmount);
  return addMilliseconds(dirtyDate, amount * MILLISECONDS_IN_MINUTE);
}

// node_modules/date-fns/esm/addQuarters/index.js
function addQuarters(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var amount = toInteger(dirtyAmount);
  var months2 = amount * 3;
  return addMonths(dirtyDate, months2);
}

// node_modules/date-fns/esm/addSeconds/index.js
function addSeconds(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var amount = toInteger(dirtyAmount);
  return addMilliseconds(dirtyDate, amount * 1e3);
}

// node_modules/date-fns/esm/addWeeks/index.js
function addWeeks(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var amount = toInteger(dirtyAmount);
  var days2 = amount * 7;
  return addDays(dirtyDate, days2);
}

// node_modules/date-fns/esm/addYears/index.js
function addYears(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var amount = toInteger(dirtyAmount);
  return addMonths(dirtyDate, amount * 12);
}

// node_modules/date-fns/esm/areIntervalsOverlapping/index.js
function areIntervalsOverlapping(dirtyIntervalLeft, dirtyIntervalRight) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {
    inclusive: false
  };
  requiredArgs(2, arguments);
  var intervalLeft = dirtyIntervalLeft || {};
  var intervalRight = dirtyIntervalRight || {};
  var leftStartTime = toDate(intervalLeft.start).getTime();
  var leftEndTime = toDate(intervalLeft.end).getTime();
  var rightStartTime = toDate(intervalRight.start).getTime();
  var rightEndTime = toDate(intervalRight.end).getTime();
  if (!(leftStartTime <= leftEndTime && rightStartTime <= rightEndTime)) {
    throw new RangeError("Invalid interval");
  }
  if (options.inclusive) {
    return leftStartTime <= rightEndTime && rightStartTime <= leftEndTime;
  }
  return leftStartTime < rightEndTime && rightStartTime < leftEndTime;
}

// node_modules/date-fns/esm/max/index.js
function max(dirtyDatesArray) {
  requiredArgs(1, arguments);
  var datesArray;
  if (dirtyDatesArray && typeof dirtyDatesArray.forEach === "function") {
    datesArray = dirtyDatesArray;
  } else if (typeof dirtyDatesArray === "object" && dirtyDatesArray !== null) {
    datesArray = Array.prototype.slice.call(dirtyDatesArray);
  } else {
    return /* @__PURE__ */ new Date(NaN);
  }
  var result;
  datesArray.forEach(function(dirtyDate) {
    var currentDate = toDate(dirtyDate);
    if (result === void 0 || result < currentDate || isNaN(Number(currentDate))) {
      result = currentDate;
    }
  });
  return result || /* @__PURE__ */ new Date(NaN);
}

// node_modules/date-fns/esm/min/index.js
function min(dirtyDatesArray) {
  requiredArgs(1, arguments);
  var datesArray;
  if (dirtyDatesArray && typeof dirtyDatesArray.forEach === "function") {
    datesArray = dirtyDatesArray;
  } else if (typeof dirtyDatesArray === "object" && dirtyDatesArray !== null) {
    datesArray = Array.prototype.slice.call(dirtyDatesArray);
  } else {
    return /* @__PURE__ */ new Date(NaN);
  }
  var result;
  datesArray.forEach(function(dirtyDate) {
    var currentDate = toDate(dirtyDate);
    if (result === void 0 || result > currentDate || isNaN(currentDate.getDate())) {
      result = currentDate;
    }
  });
  return result || /* @__PURE__ */ new Date(NaN);
}

// node_modules/date-fns/esm/clamp/index.js
function clamp(date, _ref) {
  var start = _ref.start, end = _ref.end;
  requiredArgs(2, arguments);
  return min([max([date, start]), end]);
}

// node_modules/date-fns/esm/closestIndexTo/index.js
function closestIndexTo(dirtyDateToCompare, dirtyDatesArray) {
  requiredArgs(2, arguments);
  var dateToCompare = toDate(dirtyDateToCompare);
  if (isNaN(Number(dateToCompare))) return NaN;
  var timeToCompare = dateToCompare.getTime();
  var datesArray;
  if (dirtyDatesArray == null) {
    datesArray = [];
  } else if (typeof dirtyDatesArray.forEach === "function") {
    datesArray = dirtyDatesArray;
  } else {
    datesArray = Array.prototype.slice.call(dirtyDatesArray);
  }
  var result;
  var minDistance;
  datesArray.forEach(function(dirtyDate, index) {
    var currentDate = toDate(dirtyDate);
    if (isNaN(Number(currentDate))) {
      result = NaN;
      minDistance = NaN;
      return;
    }
    var distance = Math.abs(timeToCompare - currentDate.getTime());
    if (result == null || distance < Number(minDistance)) {
      result = index;
      minDistance = distance;
    }
  });
  return result;
}

// node_modules/date-fns/esm/closestTo/index.js
function closestTo(dirtyDateToCompare, dirtyDatesArray) {
  requiredArgs(2, arguments);
  var dateToCompare = toDate(dirtyDateToCompare);
  if (isNaN(Number(dateToCompare))) return /* @__PURE__ */ new Date(NaN);
  var timeToCompare = dateToCompare.getTime();
  var datesArray;
  if (dirtyDatesArray == null) {
    datesArray = [];
  } else if (typeof dirtyDatesArray.forEach === "function") {
    datesArray = dirtyDatesArray;
  } else {
    datesArray = Array.prototype.slice.call(dirtyDatesArray);
  }
  var result;
  var minDistance;
  datesArray.forEach(function(dirtyDate) {
    var currentDate = toDate(dirtyDate);
    if (isNaN(Number(currentDate))) {
      result = /* @__PURE__ */ new Date(NaN);
      minDistance = NaN;
      return;
    }
    var distance = Math.abs(timeToCompare - currentDate.getTime());
    if (result == null || distance < Number(minDistance)) {
      result = currentDate;
      minDistance = distance;
    }
  });
  return result;
}

// node_modules/date-fns/esm/compareAsc/index.js
function compareAsc(dirtyDateLeft, dirtyDateRight) {
  requiredArgs(2, arguments);
  var dateLeft = toDate(dirtyDateLeft);
  var dateRight = toDate(dirtyDateRight);
  var diff = dateLeft.getTime() - dateRight.getTime();
  if (diff < 0) {
    return -1;
  } else if (diff > 0) {
    return 1;
  } else {
    return diff;
  }
}

// node_modules/date-fns/esm/compareDesc/index.js
function compareDesc(dirtyDateLeft, dirtyDateRight) {
  requiredArgs(2, arguments);
  var dateLeft = toDate(dirtyDateLeft);
  var dateRight = toDate(dirtyDateRight);
  var diff = dateLeft.getTime() - dateRight.getTime();
  if (diff > 0) {
    return -1;
  } else if (diff < 0) {
    return 1;
  } else {
    return diff;
  }
}

// node_modules/date-fns/esm/constants/index.js
var daysInWeek = 7;
var maxTime = Math.pow(10, 8) * 24 * 60 * 60 * 1e3;
var millisecondsInMinute = 6e4;
var millisecondsInHour = 36e5;
var millisecondsInSecond = 1e3;
var minTime = -maxTime;
var minutesInHour = 60;
var monthsInQuarter = 3;
var monthsInYear = 12;
var quartersInYear = 4;
var secondsInHour = 3600;
var secondsInMinute = 60;

// node_modules/date-fns/esm/daysToWeeks/index.js
function daysToWeeks(days2) {
  requiredArgs(1, arguments);
  var weeks = days2 / daysInWeek;
  return Math.floor(weeks);
}

// node_modules/date-fns/esm/isSameDay/index.js
function isSameDay(dirtyDateLeft, dirtyDateRight) {
  requiredArgs(2, arguments);
  var dateLeftStartOfDay = startOfDay(dirtyDateLeft);
  var dateRightStartOfDay = startOfDay(dirtyDateRight);
  return dateLeftStartOfDay.getTime() === dateRightStartOfDay.getTime();
}

// node_modules/date-fns/esm/isDate/index.js
function isDate(value) {
  requiredArgs(1, arguments);
  return value instanceof Date || typeof value === "object" && Object.prototype.toString.call(value) === "[object Date]";
}

// node_modules/date-fns/esm/isValid/index.js
function isValid(dirtyDate) {
  requiredArgs(1, arguments);
  if (!isDate(dirtyDate) && typeof dirtyDate !== "number") {
    return false;
  }
  var date = toDate(dirtyDate);
  return !isNaN(Number(date));
}

// node_modules/date-fns/esm/differenceInBusinessDays/index.js
function differenceInBusinessDays(dirtyDateLeft, dirtyDateRight) {
  requiredArgs(2, arguments);
  var dateLeft = toDate(dirtyDateLeft);
  var dateRight = toDate(dirtyDateRight);
  if (!isValid(dateLeft) || !isValid(dateRight)) return NaN;
  var calendarDifference = differenceInCalendarDays(dateLeft, dateRight);
  var sign = calendarDifference < 0 ? -1 : 1;
  var weeks = toInteger(calendarDifference / 7);
  var result = weeks * 5;
  dateRight = addDays(dateRight, weeks * 7);
  while (!isSameDay(dateLeft, dateRight)) {
    result += isWeekend(dateRight) ? 0 : sign;
    dateRight = addDays(dateRight, sign);
  }
  return result === 0 ? 0 : result;
}

// node_modules/date-fns/esm/differenceInCalendarISOWeekYears/index.js
function differenceInCalendarISOWeekYears(dirtyDateLeft, dirtyDateRight) {
  requiredArgs(2, arguments);
  return getISOWeekYear(dirtyDateLeft) - getISOWeekYear(dirtyDateRight);
}

// node_modules/date-fns/esm/differenceInCalendarISOWeeks/index.js
var MILLISECONDS_IN_WEEK = 6048e5;
function differenceInCalendarISOWeeks(dirtyDateLeft, dirtyDateRight) {
  requiredArgs(2, arguments);
  var startOfISOWeekLeft = startOfISOWeek(dirtyDateLeft);
  var startOfISOWeekRight = startOfISOWeek(dirtyDateRight);
  var timestampLeft = startOfISOWeekLeft.getTime() - getTimezoneOffsetInMilliseconds(startOfISOWeekLeft);
  var timestampRight = startOfISOWeekRight.getTime() - getTimezoneOffsetInMilliseconds(startOfISOWeekRight);
  return Math.round((timestampLeft - timestampRight) / MILLISECONDS_IN_WEEK);
}

// node_modules/date-fns/esm/differenceInCalendarMonths/index.js
function differenceInCalendarMonths(dirtyDateLeft, dirtyDateRight) {
  requiredArgs(2, arguments);
  var dateLeft = toDate(dirtyDateLeft);
  var dateRight = toDate(dirtyDateRight);
  var yearDiff = dateLeft.getFullYear() - dateRight.getFullYear();
  var monthDiff = dateLeft.getMonth() - dateRight.getMonth();
  return yearDiff * 12 + monthDiff;
}

// node_modules/date-fns/esm/getQuarter/index.js
function getQuarter(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var quarter = Math.floor(date.getMonth() / 3) + 1;
  return quarter;
}

// node_modules/date-fns/esm/differenceInCalendarQuarters/index.js
function differenceInCalendarQuarters(dirtyDateLeft, dirtyDateRight) {
  requiredArgs(2, arguments);
  var dateLeft = toDate(dirtyDateLeft);
  var dateRight = toDate(dirtyDateRight);
  var yearDiff = dateLeft.getFullYear() - dateRight.getFullYear();
  var quarterDiff = getQuarter(dateLeft) - getQuarter(dateRight);
  return yearDiff * 4 + quarterDiff;
}

// node_modules/date-fns/esm/differenceInCalendarWeeks/index.js
var MILLISECONDS_IN_WEEK2 = 6048e5;
function differenceInCalendarWeeks(dirtyDateLeft, dirtyDateRight, dirtyOptions) {
  requiredArgs(2, arguments);
  var startOfWeekLeft = startOfWeek(dirtyDateLeft, dirtyOptions);
  var startOfWeekRight = startOfWeek(dirtyDateRight, dirtyOptions);
  var timestampLeft = startOfWeekLeft.getTime() - getTimezoneOffsetInMilliseconds(startOfWeekLeft);
  var timestampRight = startOfWeekRight.getTime() - getTimezoneOffsetInMilliseconds(startOfWeekRight);
  return Math.round((timestampLeft - timestampRight) / MILLISECONDS_IN_WEEK2);
}

// node_modules/date-fns/esm/differenceInCalendarYears/index.js
function differenceInCalendarYears(dirtyDateLeft, dirtyDateRight) {
  requiredArgs(2, arguments);
  var dateLeft = toDate(dirtyDateLeft);
  var dateRight = toDate(dirtyDateRight);
  return dateLeft.getFullYear() - dateRight.getFullYear();
}

// node_modules/date-fns/esm/differenceInDays/index.js
function compareLocalAsc(dateLeft, dateRight) {
  var diff = dateLeft.getFullYear() - dateRight.getFullYear() || dateLeft.getMonth() - dateRight.getMonth() || dateLeft.getDate() - dateRight.getDate() || dateLeft.getHours() - dateRight.getHours() || dateLeft.getMinutes() - dateRight.getMinutes() || dateLeft.getSeconds() - dateRight.getSeconds() || dateLeft.getMilliseconds() - dateRight.getMilliseconds();
  if (diff < 0) {
    return -1;
  } else if (diff > 0) {
    return 1;
  } else {
    return diff;
  }
}
function differenceInDays(dirtyDateLeft, dirtyDateRight) {
  requiredArgs(2, arguments);
  var dateLeft = toDate(dirtyDateLeft);
  var dateRight = toDate(dirtyDateRight);
  var sign = compareLocalAsc(dateLeft, dateRight);
  var difference = Math.abs(differenceInCalendarDays(dateLeft, dateRight));
  dateLeft.setDate(dateLeft.getDate() - sign * difference);
  var isLastDayNotFull = Number(compareLocalAsc(dateLeft, dateRight) === -sign);
  var result = sign * (difference - isLastDayNotFull);
  return result === 0 ? 0 : result;
}

// node_modules/date-fns/esm/differenceInMilliseconds/index.js
function differenceInMilliseconds(dateLeft, dateRight) {
  requiredArgs(2, arguments);
  return toDate(dateLeft).getTime() - toDate(dateRight).getTime();
}

// node_modules/date-fns/esm/_lib/roundingMethods/index.js
var roundingMap = {
  ceil: Math.ceil,
  round: Math.round,
  floor: Math.floor,
  trunc: function(value) {
    return value < 0 ? Math.ceil(value) : Math.floor(value);
  }
  // Math.trunc is not supported by IE
};
var defaultRoundingMethod = "trunc";
function getRoundingMethod(method) {
  return method ? roundingMap[method] : roundingMap[defaultRoundingMethod];
}

// node_modules/date-fns/esm/differenceInHours/index.js
function differenceInHours(dateLeft, dateRight, options) {
  requiredArgs(2, arguments);
  var diff = differenceInMilliseconds(dateLeft, dateRight) / millisecondsInHour;
  return getRoundingMethod(options === null || options === void 0 ? void 0 : options.roundingMethod)(diff);
}

// node_modules/date-fns/esm/subISOWeekYears/index.js
function subISOWeekYears(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var amount = toInteger(dirtyAmount);
  return addISOWeekYears(dirtyDate, -amount);
}

// node_modules/date-fns/esm/differenceInISOWeekYears/index.js
function differenceInISOWeekYears(dirtyDateLeft, dirtyDateRight) {
  requiredArgs(2, arguments);
  var dateLeft = toDate(dirtyDateLeft);
  var dateRight = toDate(dirtyDateRight);
  var sign = compareAsc(dateLeft, dateRight);
  var difference = Math.abs(differenceInCalendarISOWeekYears(dateLeft, dateRight));
  dateLeft = subISOWeekYears(dateLeft, sign * difference);
  var isLastISOWeekYearNotFull = Number(compareAsc(dateLeft, dateRight) === -sign);
  var result = sign * (difference - isLastISOWeekYearNotFull);
  return result === 0 ? 0 : result;
}

// node_modules/date-fns/esm/differenceInMinutes/index.js
function differenceInMinutes(dateLeft, dateRight, options) {
  requiredArgs(2, arguments);
  var diff = differenceInMilliseconds(dateLeft, dateRight) / millisecondsInMinute;
  return getRoundingMethod(options === null || options === void 0 ? void 0 : options.roundingMethod)(diff);
}

// node_modules/date-fns/esm/endOfDay/index.js
function endOfDay(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  date.setHours(23, 59, 59, 999);
  return date;
}

// node_modules/date-fns/esm/endOfMonth/index.js
function endOfMonth(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var month = date.getMonth();
  date.setFullYear(date.getFullYear(), month + 1, 0);
  date.setHours(23, 59, 59, 999);
  return date;
}

// node_modules/date-fns/esm/isLastDayOfMonth/index.js
function isLastDayOfMonth(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  return endOfDay(date).getTime() === endOfMonth(date).getTime();
}

// node_modules/date-fns/esm/differenceInMonths/index.js
function differenceInMonths(dirtyDateLeft, dirtyDateRight) {
  requiredArgs(2, arguments);
  var dateLeft = toDate(dirtyDateLeft);
  var dateRight = toDate(dirtyDateRight);
  var sign = compareAsc(dateLeft, dateRight);
  var difference = Math.abs(differenceInCalendarMonths(dateLeft, dateRight));
  var result;
  if (difference < 1) {
    result = 0;
  } else {
    if (dateLeft.getMonth() === 1 && dateLeft.getDate() > 27) {
      dateLeft.setDate(30);
    }
    dateLeft.setMonth(dateLeft.getMonth() - sign * difference);
    var isLastMonthNotFull = compareAsc(dateLeft, dateRight) === -sign;
    if (isLastDayOfMonth(toDate(dirtyDateLeft)) && difference === 1 && compareAsc(dirtyDateLeft, dateRight) === 1) {
      isLastMonthNotFull = false;
    }
    result = sign * (difference - Number(isLastMonthNotFull));
  }
  return result === 0 ? 0 : result;
}

// node_modules/date-fns/esm/differenceInQuarters/index.js
function differenceInQuarters(dateLeft, dateRight, options) {
  requiredArgs(2, arguments);
  var diff = differenceInMonths(dateLeft, dateRight) / 3;
  return getRoundingMethod(options === null || options === void 0 ? void 0 : options.roundingMethod)(diff);
}

// node_modules/date-fns/esm/differenceInSeconds/index.js
function differenceInSeconds(dateLeft, dateRight, options) {
  requiredArgs(2, arguments);
  var diff = differenceInMilliseconds(dateLeft, dateRight) / 1e3;
  return getRoundingMethod(options === null || options === void 0 ? void 0 : options.roundingMethod)(diff);
}

// node_modules/date-fns/esm/differenceInWeeks/index.js
function differenceInWeeks(dateLeft, dateRight, options) {
  requiredArgs(2, arguments);
  var diff = differenceInDays(dateLeft, dateRight) / 7;
  return getRoundingMethod(options === null || options === void 0 ? void 0 : options.roundingMethod)(diff);
}

// node_modules/date-fns/esm/differenceInYears/index.js
function differenceInYears(dirtyDateLeft, dirtyDateRight) {
  requiredArgs(2, arguments);
  var dateLeft = toDate(dirtyDateLeft);
  var dateRight = toDate(dirtyDateRight);
  var sign = compareAsc(dateLeft, dateRight);
  var difference = Math.abs(differenceInCalendarYears(dateLeft, dateRight));
  dateLeft.setFullYear(1584);
  dateRight.setFullYear(1584);
  var isLastYearNotFull = compareAsc(dateLeft, dateRight) === -sign;
  var result = sign * (difference - Number(isLastYearNotFull));
  return result === 0 ? 0 : result;
}

// node_modules/date-fns/esm/eachDayOfInterval/index.js
function eachDayOfInterval(dirtyInterval, options) {
  requiredArgs(1, arguments);
  var interval = dirtyInterval || {};
  var startDate = toDate(interval.start);
  var endDate = toDate(interval.end);
  var endTime = endDate.getTime();
  if (!(startDate.getTime() <= endTime)) {
    throw new RangeError("Invalid interval");
  }
  var dates = [];
  var currentDate = startDate;
  currentDate.setHours(0, 0, 0, 0);
  var step = options && "step" in options ? Number(options.step) : 1;
  if (step < 1 || isNaN(step)) throw new RangeError("`options.step` must be a number greater than 1");
  while (currentDate.getTime() <= endTime) {
    dates.push(toDate(currentDate));
    currentDate.setDate(currentDate.getDate() + step);
    currentDate.setHours(0, 0, 0, 0);
  }
  return dates;
}

// node_modules/date-fns/esm/eachHourOfInterval/index.js
function eachHourOfInterval(dirtyInterval, options) {
  requiredArgs(1, arguments);
  var interval = dirtyInterval || {};
  var startDate = toDate(interval.start);
  var endDate = toDate(interval.end);
  var startTime = startDate.getTime();
  var endTime = endDate.getTime();
  if (!(startTime <= endTime)) {
    throw new RangeError("Invalid interval");
  }
  var dates = [];
  var currentDate = startDate;
  currentDate.setMinutes(0, 0, 0);
  var step = options && "step" in options ? Number(options.step) : 1;
  if (step < 1 || isNaN(step)) throw new RangeError("`options.step` must be a number greater than 1");
  while (currentDate.getTime() <= endTime) {
    dates.push(toDate(currentDate));
    currentDate = addHours(currentDate, step);
  }
  return dates;
}

// node_modules/date-fns/esm/startOfMinute/index.js
function startOfMinute(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  date.setSeconds(0, 0);
  return date;
}

// node_modules/date-fns/esm/eachMinuteOfInterval/index.js
function eachMinuteOfInterval(interval, options) {
  requiredArgs(1, arguments);
  var startDate = startOfMinute(toDate(interval.start));
  var endDate = toDate(interval.end);
  var startTime = startDate.getTime();
  var endTime = endDate.getTime();
  if (startTime >= endTime) {
    throw new RangeError("Invalid interval");
  }
  var dates = [];
  var currentDate = startDate;
  var step = options && "step" in options ? Number(options.step) : 1;
  if (step < 1 || isNaN(step)) throw new RangeError("`options.step` must be a number equal or greater than 1");
  while (currentDate.getTime() <= endTime) {
    dates.push(toDate(currentDate));
    currentDate = addMinutes(currentDate, step);
  }
  return dates;
}

// node_modules/date-fns/esm/eachMonthOfInterval/index.js
function eachMonthOfInterval(dirtyInterval) {
  requiredArgs(1, arguments);
  var interval = dirtyInterval || {};
  var startDate = toDate(interval.start);
  var endDate = toDate(interval.end);
  var endTime = endDate.getTime();
  var dates = [];
  if (!(startDate.getTime() <= endTime)) {
    throw new RangeError("Invalid interval");
  }
  var currentDate = startDate;
  currentDate.setHours(0, 0, 0, 0);
  currentDate.setDate(1);
  while (currentDate.getTime() <= endTime) {
    dates.push(toDate(currentDate));
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  return dates;
}

// node_modules/date-fns/esm/startOfQuarter/index.js
function startOfQuarter(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var currentMonth = date.getMonth();
  var month = currentMonth - currentMonth % 3;
  date.setMonth(month, 1);
  date.setHours(0, 0, 0, 0);
  return date;
}

// node_modules/date-fns/esm/eachQuarterOfInterval/index.js
function eachQuarterOfInterval(dirtyInterval) {
  requiredArgs(1, arguments);
  var interval = dirtyInterval || {};
  var startDate = toDate(interval.start);
  var endDate = toDate(interval.end);
  var endTime = endDate.getTime();
  if (!(startDate.getTime() <= endTime)) {
    throw new RangeError("Invalid interval");
  }
  var startDateQuarter = startOfQuarter(startDate);
  var endDateQuarter = startOfQuarter(endDate);
  endTime = endDateQuarter.getTime();
  var quarters = [];
  var currentQuarter = startDateQuarter;
  while (currentQuarter.getTime() <= endTime) {
    quarters.push(toDate(currentQuarter));
    currentQuarter = addQuarters(currentQuarter, 1);
  }
  return quarters;
}

// node_modules/date-fns/esm/eachWeekOfInterval/index.js
function eachWeekOfInterval(dirtyInterval, options) {
  requiredArgs(1, arguments);
  var interval = dirtyInterval || {};
  var startDate = toDate(interval.start);
  var endDate = toDate(interval.end);
  var endTime = endDate.getTime();
  if (!(startDate.getTime() <= endTime)) {
    throw new RangeError("Invalid interval");
  }
  var startDateWeek = startOfWeek(startDate, options);
  var endDateWeek = startOfWeek(endDate, options);
  startDateWeek.setHours(15);
  endDateWeek.setHours(15);
  endTime = endDateWeek.getTime();
  var weeks = [];
  var currentWeek = startDateWeek;
  while (currentWeek.getTime() <= endTime) {
    currentWeek.setHours(0);
    weeks.push(toDate(currentWeek));
    currentWeek = addWeeks(currentWeek, 1);
    currentWeek.setHours(15);
  }
  return weeks;
}

// node_modules/date-fns/esm/eachWeekendOfInterval/index.js
function eachWeekendOfInterval(interval) {
  requiredArgs(1, arguments);
  var dateInterval = eachDayOfInterval(interval);
  var weekends = [];
  var index = 0;
  while (index < dateInterval.length) {
    var date = dateInterval[index++];
    if (isWeekend(date)) {
      weekends.push(date);
      if (isSunday(date)) index = index + 5;
    }
  }
  return weekends;
}

// node_modules/date-fns/esm/startOfMonth/index.js
function startOfMonth(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date;
}

// node_modules/date-fns/esm/eachWeekendOfMonth/index.js
function eachWeekendOfMonth(dirtyDate) {
  requiredArgs(1, arguments);
  var startDate = startOfMonth(dirtyDate);
  if (isNaN(startDate.getTime())) throw new RangeError("The passed date is invalid");
  var endDate = endOfMonth(dirtyDate);
  return eachWeekendOfInterval({
    start: startDate,
    end: endDate
  });
}

// node_modules/date-fns/esm/startOfYear/index.js
function startOfYear(dirtyDate) {
  requiredArgs(1, arguments);
  var cleanDate = toDate(dirtyDate);
  var date = /* @__PURE__ */ new Date(0);
  date.setFullYear(cleanDate.getFullYear(), 0, 1);
  date.setHours(0, 0, 0, 0);
  return date;
}

// node_modules/date-fns/esm/endOfYear/index.js
function endOfYear(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var year = date.getFullYear();
  date.setFullYear(year + 1, 0, 0);
  date.setHours(23, 59, 59, 999);
  return date;
}

// node_modules/date-fns/esm/eachWeekendOfYear/index.js
function eachWeekendOfYear(dirtyDate) {
  requiredArgs(1, arguments);
  var startDate = startOfYear(dirtyDate);
  if (isNaN(startDate)) throw new RangeError("The passed date is invalid");
  var endDate = endOfYear(dirtyDate);
  return eachWeekendOfInterval({
    start: startDate,
    end: endDate
  });
}

// node_modules/date-fns/esm/eachYearOfInterval/index.js
function eachYearOfInterval(dirtyInterval) {
  requiredArgs(1, arguments);
  var interval = dirtyInterval || {};
  var startDate = toDate(interval.start);
  var endDate = toDate(interval.end);
  var endTime = endDate.getTime();
  if (!(startDate.getTime() <= endTime)) {
    throw new RangeError("Invalid interval");
  }
  var dates = [];
  var currentDate = startDate;
  currentDate.setHours(0, 0, 0, 0);
  currentDate.setMonth(0, 1);
  while (currentDate.getTime() <= endTime) {
    dates.push(toDate(currentDate));
    currentDate.setFullYear(currentDate.getFullYear() + 1);
  }
  return dates;
}

// node_modules/date-fns/esm/endOfDecade/index.js
function endOfDecade(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var year = date.getFullYear();
  var decade = 9 + Math.floor(year / 10) * 10;
  date.setFullYear(decade, 11, 31);
  date.setHours(23, 59, 59, 999);
  return date;
}

// node_modules/date-fns/esm/endOfHour/index.js
function endOfHour(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  date.setMinutes(59, 59, 999);
  return date;
}

// node_modules/date-fns/esm/endOfWeek/index.js
function endOfWeek(dirtyDate, dirtyOptions) {
  requiredArgs(1, arguments);
  var options = dirtyOptions || {};
  var locale2 = options.locale;
  var localeWeekStartsOn = locale2 && locale2.options && locale2.options.weekStartsOn;
  var defaultWeekStartsOn = localeWeekStartsOn == null ? 0 : toInteger(localeWeekStartsOn);
  var weekStartsOn = options.weekStartsOn == null ? defaultWeekStartsOn : toInteger(options.weekStartsOn);
  if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
    throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
  }
  var date = toDate(dirtyDate);
  var day = date.getDay();
  var diff = (day < weekStartsOn ? -7 : 0) + 6 - (day - weekStartsOn);
  date.setDate(date.getDate() + diff);
  date.setHours(23, 59, 59, 999);
  return date;
}

// node_modules/date-fns/esm/endOfISOWeek/index.js
function endOfISOWeek(dirtyDate) {
  requiredArgs(1, arguments);
  return endOfWeek(dirtyDate, {
    weekStartsOn: 1
  });
}

// node_modules/date-fns/esm/endOfISOWeekYear/index.js
function endOfISOWeekYear(dirtyDate) {
  requiredArgs(1, arguments);
  var year = getISOWeekYear(dirtyDate);
  var fourthOfJanuaryOfNextYear = /* @__PURE__ */ new Date(0);
  fourthOfJanuaryOfNextYear.setFullYear(year + 1, 0, 4);
  fourthOfJanuaryOfNextYear.setHours(0, 0, 0, 0);
  var date = startOfISOWeek(fourthOfJanuaryOfNextYear);
  date.setMilliseconds(date.getMilliseconds() - 1);
  return date;
}

// node_modules/date-fns/esm/endOfMinute/index.js
function endOfMinute(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  date.setSeconds(59, 999);
  return date;
}

// node_modules/date-fns/esm/endOfQuarter/index.js
function endOfQuarter(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var currentMonth = date.getMonth();
  var month = currentMonth - currentMonth % 3 + 3;
  date.setMonth(month, 0);
  date.setHours(23, 59, 59, 999);
  return date;
}

// node_modules/date-fns/esm/endOfSecond/index.js
function endOfSecond(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  date.setMilliseconds(999);
  return date;
}

// node_modules/date-fns/esm/endOfToday/index.js
function endOfToday() {
  return endOfDay(Date.now());
}

// node_modules/date-fns/esm/endOfTomorrow/index.js
function endOfTomorrow() {
  var now = /* @__PURE__ */ new Date();
  var year = now.getFullYear();
  var month = now.getMonth();
  var day = now.getDate();
  var date = /* @__PURE__ */ new Date(0);
  date.setFullYear(year, month, day + 1);
  date.setHours(23, 59, 59, 999);
  return date;
}

// node_modules/date-fns/esm/endOfYesterday/index.js
function endOfYesterday() {
  var now = /* @__PURE__ */ new Date();
  var year = now.getFullYear();
  var month = now.getMonth();
  var day = now.getDate();
  var date = /* @__PURE__ */ new Date(0);
  date.setFullYear(year, month, day - 1);
  date.setHours(23, 59, 59, 999);
  return date;
}

// node_modules/date-fns/esm/locale/en-US/_lib/formatDistance/index.js
var formatDistanceLocale = {
  lessThanXSeconds: {
    one: "less than a second",
    other: "less than {{count}} seconds"
  },
  xSeconds: {
    one: "1 second",
    other: "{{count}} seconds"
  },
  halfAMinute: "half a minute",
  lessThanXMinutes: {
    one: "less than a minute",
    other: "less than {{count}} minutes"
  },
  xMinutes: {
    one: "1 minute",
    other: "{{count}} minutes"
  },
  aboutXHours: {
    one: "about 1 hour",
    other: "about {{count}} hours"
  },
  xHours: {
    one: "1 hour",
    other: "{{count}} hours"
  },
  xDays: {
    one: "1 day",
    other: "{{count}} days"
  },
  aboutXWeeks: {
    one: "about 1 week",
    other: "about {{count}} weeks"
  },
  xWeeks: {
    one: "1 week",
    other: "{{count}} weeks"
  },
  aboutXMonths: {
    one: "about 1 month",
    other: "about {{count}} months"
  },
  xMonths: {
    one: "1 month",
    other: "{{count}} months"
  },
  aboutXYears: {
    one: "about 1 year",
    other: "about {{count}} years"
  },
  xYears: {
    one: "1 year",
    other: "{{count}} years"
  },
  overXYears: {
    one: "over 1 year",
    other: "over {{count}} years"
  },
  almostXYears: {
    one: "almost 1 year",
    other: "almost {{count}} years"
  }
};
var formatDistance = function(token, count, options) {
  var result;
  var tokenValue = formatDistanceLocale[token];
  if (typeof tokenValue === "string") {
    result = tokenValue;
  } else if (count === 1) {
    result = tokenValue.one;
  } else {
    result = tokenValue.other.replace("{{count}}", count.toString());
  }
  if (options !== null && options !== void 0 && options.addSuffix) {
    if (options.comparison && options.comparison > 0) {
      return "in " + result;
    } else {
      return result + " ago";
    }
  }
  return result;
};
var formatDistance_default = formatDistance;

// node_modules/date-fns/esm/locale/_lib/buildFormatLongFn/index.js
function buildFormatLongFn(args) {
  return function() {
    var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    var width = options.width ? String(options.width) : args.defaultWidth;
    var format2 = args.formats[width] || args.formats[args.defaultWidth];
    return format2;
  };
}

// node_modules/date-fns/esm/locale/en-US/_lib/formatLong/index.js
var dateFormats = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
};
var timeFormats = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
};
var dateTimeFormats = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong = {
  date: buildFormatLongFn({
    formats: dateFormats,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats,
    defaultWidth: "full"
  })
};
var formatLong_default = formatLong;

// node_modules/date-fns/esm/locale/en-US/_lib/formatRelative/index.js
var formatRelativeLocale = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "P"
};
var formatRelative = function(token, _date, _baseDate, _options) {
  return formatRelativeLocale[token];
};
var formatRelative_default = formatRelative;

// node_modules/date-fns/esm/locale/_lib/buildLocalizeFn/index.js
function buildLocalizeFn(args) {
  return function(dirtyIndex, dirtyOptions) {
    var options = dirtyOptions || {};
    var context = options.context ? String(options.context) : "standalone";
    var valuesArray;
    if (context === "formatting" && args.formattingValues) {
      var defaultWidth = args.defaultFormattingWidth || args.defaultWidth;
      var width = options.width ? String(options.width) : defaultWidth;
      valuesArray = args.formattingValues[width] || args.formattingValues[defaultWidth];
    } else {
      var _defaultWidth = args.defaultWidth;
      var _width = options.width ? String(options.width) : args.defaultWidth;
      valuesArray = args.values[_width] || args.values[_defaultWidth];
    }
    var index = args.argumentCallback ? args.argumentCallback(dirtyIndex) : dirtyIndex;
    return valuesArray[index];
  };
}

// node_modules/date-fns/esm/locale/en-US/_lib/localize/index.js
var eraValues = {
  narrow: ["B", "A"],
  abbreviated: ["BC", "AD"],
  wide: ["Before Christ", "Anno Domini"]
};
var quarterValues = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
};
var monthValues = {
  narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  abbreviated: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  wide: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
};
var dayValues = {
  narrow: ["S", "M", "T", "W", "T", "F", "S"],
  short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  wide: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
};
var dayPeriodValues = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  }
};
var formattingDayPeriodValues = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  }
};
var ordinalNumber = function(dirtyNumber, _options) {
  var number = Number(dirtyNumber);
  var rem100 = number % 100;
  if (rem100 > 20 || rem100 < 10) {
    switch (rem100 % 10) {
      case 1:
        return number + "st";
      case 2:
        return number + "nd";
      case 3:
        return number + "rd";
    }
  }
  return number + "th";
};
var localize = {
  ordinalNumber,
  era: buildLocalizeFn({
    values: eraValues,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues,
    defaultWidth: "wide",
    argumentCallback: function(quarter) {
      return quarter - 1;
    }
  }),
  month: buildLocalizeFn({
    values: monthValues,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues,
    defaultFormattingWidth: "wide"
  })
};
var localize_default = localize;

// node_modules/date-fns/esm/locale/_lib/buildMatchFn/index.js
function buildMatchFn(args) {
  return function(string) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var width = options.width;
    var matchPattern = width && args.matchPatterns[width] || args.matchPatterns[args.defaultMatchWidth];
    var matchResult = string.match(matchPattern);
    if (!matchResult) {
      return null;
    }
    var matchedString = matchResult[0];
    var parsePatterns = width && args.parsePatterns[width] || args.parsePatterns[args.defaultParseWidth];
    var key = Array.isArray(parsePatterns) ? findIndex(parsePatterns, function(pattern) {
      return pattern.test(matchedString);
    }) : findKey(parsePatterns, function(pattern) {
      return pattern.test(matchedString);
    });
    var value;
    value = args.valueCallback ? args.valueCallback(key) : key;
    value = options.valueCallback ? options.valueCallback(value) : value;
    var rest = string.slice(matchedString.length);
    return {
      value,
      rest
    };
  };
}
function findKey(object, predicate) {
  for (var key in object) {
    if (object.hasOwnProperty(key) && predicate(object[key])) {
      return key;
    }
  }
  return void 0;
}
function findIndex(array, predicate) {
  for (var key = 0; key < array.length; key++) {
    if (predicate(array[key])) {
      return key;
    }
  }
  return void 0;
}

// node_modules/date-fns/esm/locale/_lib/buildMatchPatternFn/index.js
function buildMatchPatternFn(args) {
  return function(string) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var matchResult = string.match(args.matchPattern);
    if (!matchResult) return null;
    var matchedString = matchResult[0];
    var parseResult = string.match(args.parsePattern);
    if (!parseResult) return null;
    var value = args.valueCallback ? args.valueCallback(parseResult[0]) : parseResult[0];
    value = options.valueCallback ? options.valueCallback(value) : value;
    var rest = string.slice(matchedString.length);
    return {
      value,
      rest
    };
  };
}

// node_modules/date-fns/esm/locale/en-US/_lib/match/index.js
var matchOrdinalNumberPattern = /^(\d+)(th|st|nd|rd)?/i;
var parseOrdinalNumberPattern = /\d+/i;
var matchEraPatterns = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i
};
var parseEraPatterns = {
  any: [/^b/i, /^(a|c)/i]
};
var matchQuarterPatterns = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i
};
var parseQuarterPatterns = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
};
var parseMonthPatterns = {
  narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
  any: [/^ja/i, /^f/i, /^mar/i, /^ap/i, /^may/i, /^jun/i, /^jul/i, /^au/i, /^s/i, /^o/i, /^n/i, /^d/i]
};
var matchDayPatterns = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
};
var parseDayPatterns = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
};
var matchDayPeriodPatterns = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
};
var parseDayPeriodPatterns = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^mi/i,
    noon: /^no/i,
    morning: /morning/i,
    afternoon: /afternoon/i,
    evening: /evening/i,
    night: /night/i
  }
};
var match = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern,
    parsePattern: parseOrdinalNumberPattern,
    valueCallback: function(value) {
      return parseInt(value, 10);
    }
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns,
    defaultParseWidth: "any",
    valueCallback: function(index) {
      return index + 1;
    }
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns,
    defaultParseWidth: "any"
  })
};
var match_default = match;

// node_modules/date-fns/esm/locale/en-US/index.js
var locale = {
  code: "en-US",
  formatDistance: formatDistance_default,
  formatLong: formatLong_default,
  formatRelative: formatRelative_default,
  localize: localize_default,
  match: match_default,
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
};
var en_US_default = locale;

// node_modules/date-fns/esm/subMilliseconds/index.js
function subMilliseconds(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var amount = toInteger(dirtyAmount);
  return addMilliseconds(dirtyDate, -amount);
}

// node_modules/date-fns/esm/_lib/getUTCDayOfYear/index.js
var MILLISECONDS_IN_DAY2 = 864e5;
function getUTCDayOfYear(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var timestamp = date.getTime();
  date.setUTCMonth(0, 1);
  date.setUTCHours(0, 0, 0, 0);
  var startOfYearTimestamp = date.getTime();
  var difference = timestamp - startOfYearTimestamp;
  return Math.floor(difference / MILLISECONDS_IN_DAY2) + 1;
}

// node_modules/date-fns/esm/_lib/startOfUTCISOWeek/index.js
function startOfUTCISOWeek(dirtyDate) {
  requiredArgs(1, arguments);
  var weekStartsOn = 1;
  var date = toDate(dirtyDate);
  var day = date.getUTCDay();
  var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  date.setUTCDate(date.getUTCDate() - diff);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

// node_modules/date-fns/esm/_lib/getUTCISOWeekYear/index.js
function getUTCISOWeekYear(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var year = date.getUTCFullYear();
  var fourthOfJanuaryOfNextYear = /* @__PURE__ */ new Date(0);
  fourthOfJanuaryOfNextYear.setUTCFullYear(year + 1, 0, 4);
  fourthOfJanuaryOfNextYear.setUTCHours(0, 0, 0, 0);
  var startOfNextYear = startOfUTCISOWeek(fourthOfJanuaryOfNextYear);
  var fourthOfJanuaryOfThisYear = /* @__PURE__ */ new Date(0);
  fourthOfJanuaryOfThisYear.setUTCFullYear(year, 0, 4);
  fourthOfJanuaryOfThisYear.setUTCHours(0, 0, 0, 0);
  var startOfThisYear = startOfUTCISOWeek(fourthOfJanuaryOfThisYear);
  if (date.getTime() >= startOfNextYear.getTime()) {
    return year + 1;
  } else if (date.getTime() >= startOfThisYear.getTime()) {
    return year;
  } else {
    return year - 1;
  }
}

// node_modules/date-fns/esm/_lib/startOfUTCISOWeekYear/index.js
function startOfUTCISOWeekYear(dirtyDate) {
  requiredArgs(1, arguments);
  var year = getUTCISOWeekYear(dirtyDate);
  var fourthOfJanuary = /* @__PURE__ */ new Date(0);
  fourthOfJanuary.setUTCFullYear(year, 0, 4);
  fourthOfJanuary.setUTCHours(0, 0, 0, 0);
  var date = startOfUTCISOWeek(fourthOfJanuary);
  return date;
}

// node_modules/date-fns/esm/_lib/getUTCISOWeek/index.js
var MILLISECONDS_IN_WEEK3 = 6048e5;
function getUTCISOWeek(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var diff = startOfUTCISOWeek(date).getTime() - startOfUTCISOWeekYear(date).getTime();
  return Math.round(diff / MILLISECONDS_IN_WEEK3) + 1;
}

// node_modules/date-fns/esm/_lib/startOfUTCWeek/index.js
function startOfUTCWeek(dirtyDate, dirtyOptions) {
  requiredArgs(1, arguments);
  var options = dirtyOptions || {};
  var locale2 = options.locale;
  var localeWeekStartsOn = locale2 && locale2.options && locale2.options.weekStartsOn;
  var defaultWeekStartsOn = localeWeekStartsOn == null ? 0 : toInteger(localeWeekStartsOn);
  var weekStartsOn = options.weekStartsOn == null ? defaultWeekStartsOn : toInteger(options.weekStartsOn);
  if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
    throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
  }
  var date = toDate(dirtyDate);
  var day = date.getUTCDay();
  var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  date.setUTCDate(date.getUTCDate() - diff);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

// node_modules/date-fns/esm/_lib/getUTCWeekYear/index.js
function getUTCWeekYear(dirtyDate, dirtyOptions) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var year = date.getUTCFullYear();
  var options = dirtyOptions || {};
  var locale2 = options.locale;
  var localeFirstWeekContainsDate = locale2 && locale2.options && locale2.options.firstWeekContainsDate;
  var defaultFirstWeekContainsDate = localeFirstWeekContainsDate == null ? 1 : toInteger(localeFirstWeekContainsDate);
  var firstWeekContainsDate = options.firstWeekContainsDate == null ? defaultFirstWeekContainsDate : toInteger(options.firstWeekContainsDate);
  if (!(firstWeekContainsDate >= 1 && firstWeekContainsDate <= 7)) {
    throw new RangeError("firstWeekContainsDate must be between 1 and 7 inclusively");
  }
  var firstWeekOfNextYear = /* @__PURE__ */ new Date(0);
  firstWeekOfNextYear.setUTCFullYear(year + 1, 0, firstWeekContainsDate);
  firstWeekOfNextYear.setUTCHours(0, 0, 0, 0);
  var startOfNextYear = startOfUTCWeek(firstWeekOfNextYear, dirtyOptions);
  var firstWeekOfThisYear = /* @__PURE__ */ new Date(0);
  firstWeekOfThisYear.setUTCFullYear(year, 0, firstWeekContainsDate);
  firstWeekOfThisYear.setUTCHours(0, 0, 0, 0);
  var startOfThisYear = startOfUTCWeek(firstWeekOfThisYear, dirtyOptions);
  if (date.getTime() >= startOfNextYear.getTime()) {
    return year + 1;
  } else if (date.getTime() >= startOfThisYear.getTime()) {
    return year;
  } else {
    return year - 1;
  }
}

// node_modules/date-fns/esm/_lib/startOfUTCWeekYear/index.js
function startOfUTCWeekYear(dirtyDate, dirtyOptions) {
  requiredArgs(1, arguments);
  var options = dirtyOptions || {};
  var locale2 = options.locale;
  var localeFirstWeekContainsDate = locale2 && locale2.options && locale2.options.firstWeekContainsDate;
  var defaultFirstWeekContainsDate = localeFirstWeekContainsDate == null ? 1 : toInteger(localeFirstWeekContainsDate);
  var firstWeekContainsDate = options.firstWeekContainsDate == null ? defaultFirstWeekContainsDate : toInteger(options.firstWeekContainsDate);
  var year = getUTCWeekYear(dirtyDate, dirtyOptions);
  var firstWeek = /* @__PURE__ */ new Date(0);
  firstWeek.setUTCFullYear(year, 0, firstWeekContainsDate);
  firstWeek.setUTCHours(0, 0, 0, 0);
  var date = startOfUTCWeek(firstWeek, dirtyOptions);
  return date;
}

// node_modules/date-fns/esm/_lib/getUTCWeek/index.js
var MILLISECONDS_IN_WEEK4 = 6048e5;
function getUTCWeek(dirtyDate, options) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var diff = startOfUTCWeek(date, options).getTime() - startOfUTCWeekYear(date, options).getTime();
  return Math.round(diff / MILLISECONDS_IN_WEEK4) + 1;
}

// node_modules/date-fns/esm/_lib/addLeadingZeros/index.js
function addLeadingZeros(number, targetLength) {
  var sign = number < 0 ? "-" : "";
  var output = Math.abs(number).toString();
  while (output.length < targetLength) {
    output = "0" + output;
  }
  return sign + output;
}

// node_modules/date-fns/esm/_lib/format/lightFormatters/index.js
var formatters = {
  // Year
  y: function(date, token) {
    var signedYear = date.getUTCFullYear();
    var year = signedYear > 0 ? signedYear : 1 - signedYear;
    return addLeadingZeros(token === "yy" ? year % 100 : year, token.length);
  },
  // Month
  M: function(date, token) {
    var month = date.getUTCMonth();
    return token === "M" ? String(month + 1) : addLeadingZeros(month + 1, 2);
  },
  // Day of the month
  d: function(date, token) {
    return addLeadingZeros(date.getUTCDate(), token.length);
  },
  // AM or PM
  a: function(date, token) {
    var dayPeriodEnumValue = date.getUTCHours() / 12 >= 1 ? "pm" : "am";
    switch (token) {
      case "a":
      case "aa":
        return dayPeriodEnumValue.toUpperCase();
      case "aaa":
        return dayPeriodEnumValue;
      case "aaaaa":
        return dayPeriodEnumValue[0];
      case "aaaa":
      default:
        return dayPeriodEnumValue === "am" ? "a.m." : "p.m.";
    }
  },
  // Hour [1-12]
  h: function(date, token) {
    return addLeadingZeros(date.getUTCHours() % 12 || 12, token.length);
  },
  // Hour [0-23]
  H: function(date, token) {
    return addLeadingZeros(date.getUTCHours(), token.length);
  },
  // Minute
  m: function(date, token) {
    return addLeadingZeros(date.getUTCMinutes(), token.length);
  },
  // Second
  s: function(date, token) {
    return addLeadingZeros(date.getUTCSeconds(), token.length);
  },
  // Fraction of second
  S: function(date, token) {
    var numberOfDigits = token.length;
    var milliseconds2 = date.getUTCMilliseconds();
    var fractionalSeconds = Math.floor(milliseconds2 * Math.pow(10, numberOfDigits - 3));
    return addLeadingZeros(fractionalSeconds, token.length);
  }
};
var lightFormatters_default = formatters;

// node_modules/date-fns/esm/_lib/format/formatters/index.js
var dayPeriodEnum = {
  am: "am",
  pm: "pm",
  midnight: "midnight",
  noon: "noon",
  morning: "morning",
  afternoon: "afternoon",
  evening: "evening",
  night: "night"
};
var formatters2 = {
  // Era
  G: function(date, token, localize2) {
    var era = date.getUTCFullYear() > 0 ? 1 : 0;
    switch (token) {
      case "G":
      case "GG":
      case "GGG":
        return localize2.era(era, {
          width: "abbreviated"
        });
      case "GGGGG":
        return localize2.era(era, {
          width: "narrow"
        });
      case "GGGG":
      default:
        return localize2.era(era, {
          width: "wide"
        });
    }
  },
  // Year
  y: function(date, token, localize2) {
    if (token === "yo") {
      var signedYear = date.getUTCFullYear();
      var year = signedYear > 0 ? signedYear : 1 - signedYear;
      return localize2.ordinalNumber(year, {
        unit: "year"
      });
    }
    return lightFormatters_default.y(date, token);
  },
  // Local week-numbering year
  Y: function(date, token, localize2, options) {
    var signedWeekYear = getUTCWeekYear(date, options);
    var weekYear = signedWeekYear > 0 ? signedWeekYear : 1 - signedWeekYear;
    if (token === "YY") {
      var twoDigitYear = weekYear % 100;
      return addLeadingZeros(twoDigitYear, 2);
    }
    if (token === "Yo") {
      return localize2.ordinalNumber(weekYear, {
        unit: "year"
      });
    }
    return addLeadingZeros(weekYear, token.length);
  },
  // ISO week-numbering year
  R: function(date, token) {
    var isoWeekYear = getUTCISOWeekYear(date);
    return addLeadingZeros(isoWeekYear, token.length);
  },
  // Extended year. This is a single number designating the year of this calendar system.
  // The main difference between `y` and `u` localizers are B.C. years:
  // | Year | `y` | `u` |
  // |------|-----|-----|
  // | AC 1 |   1 |   1 |
  // | BC 1 |   1 |   0 |
  // | BC 2 |   2 |  -1 |
  // Also `yy` always returns the last two digits of a year,
  // while `uu` pads single digit years to 2 characters and returns other years unchanged.
  u: function(date, token) {
    var year = date.getUTCFullYear();
    return addLeadingZeros(year, token.length);
  },
  // Quarter
  Q: function(date, token, localize2) {
    var quarter = Math.ceil((date.getUTCMonth() + 1) / 3);
    switch (token) {
      case "Q":
        return String(quarter);
      case "QQ":
        return addLeadingZeros(quarter, 2);
      case "Qo":
        return localize2.ordinalNumber(quarter, {
          unit: "quarter"
        });
      case "QQQ":
        return localize2.quarter(quarter, {
          width: "abbreviated",
          context: "formatting"
        });
      case "QQQQQ":
        return localize2.quarter(quarter, {
          width: "narrow",
          context: "formatting"
        });
      case "QQQQ":
      default:
        return localize2.quarter(quarter, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone quarter
  q: function(date, token, localize2) {
    var quarter = Math.ceil((date.getUTCMonth() + 1) / 3);
    switch (token) {
      case "q":
        return String(quarter);
      case "qq":
        return addLeadingZeros(quarter, 2);
      case "qo":
        return localize2.ordinalNumber(quarter, {
          unit: "quarter"
        });
      case "qqq":
        return localize2.quarter(quarter, {
          width: "abbreviated",
          context: "standalone"
        });
      case "qqqqq":
        return localize2.quarter(quarter, {
          width: "narrow",
          context: "standalone"
        });
      case "qqqq":
      default:
        return localize2.quarter(quarter, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // Month
  M: function(date, token, localize2) {
    var month = date.getUTCMonth();
    switch (token) {
      case "M":
      case "MM":
        return lightFormatters_default.M(date, token);
      case "Mo":
        return localize2.ordinalNumber(month + 1, {
          unit: "month"
        });
      case "MMM":
        return localize2.month(month, {
          width: "abbreviated",
          context: "formatting"
        });
      case "MMMMM":
        return localize2.month(month, {
          width: "narrow",
          context: "formatting"
        });
      case "MMMM":
      default:
        return localize2.month(month, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone month
  L: function(date, token, localize2) {
    var month = date.getUTCMonth();
    switch (token) {
      case "L":
        return String(month + 1);
      case "LL":
        return addLeadingZeros(month + 1, 2);
      case "Lo":
        return localize2.ordinalNumber(month + 1, {
          unit: "month"
        });
      case "LLL":
        return localize2.month(month, {
          width: "abbreviated",
          context: "standalone"
        });
      case "LLLLL":
        return localize2.month(month, {
          width: "narrow",
          context: "standalone"
        });
      case "LLLL":
      default:
        return localize2.month(month, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // Local week of year
  w: function(date, token, localize2, options) {
    var week = getUTCWeek(date, options);
    if (token === "wo") {
      return localize2.ordinalNumber(week, {
        unit: "week"
      });
    }
    return addLeadingZeros(week, token.length);
  },
  // ISO week of year
  I: function(date, token, localize2) {
    var isoWeek = getUTCISOWeek(date);
    if (token === "Io") {
      return localize2.ordinalNumber(isoWeek, {
        unit: "week"
      });
    }
    return addLeadingZeros(isoWeek, token.length);
  },
  // Day of the month
  d: function(date, token, localize2) {
    if (token === "do") {
      return localize2.ordinalNumber(date.getUTCDate(), {
        unit: "date"
      });
    }
    return lightFormatters_default.d(date, token);
  },
  // Day of year
  D: function(date, token, localize2) {
    var dayOfYear = getUTCDayOfYear(date);
    if (token === "Do") {
      return localize2.ordinalNumber(dayOfYear, {
        unit: "dayOfYear"
      });
    }
    return addLeadingZeros(dayOfYear, token.length);
  },
  // Day of week
  E: function(date, token, localize2) {
    var dayOfWeek = date.getUTCDay();
    switch (token) {
      case "E":
      case "EE":
      case "EEE":
        return localize2.day(dayOfWeek, {
          width: "abbreviated",
          context: "formatting"
        });
      case "EEEEE":
        return localize2.day(dayOfWeek, {
          width: "narrow",
          context: "formatting"
        });
      case "EEEEEE":
        return localize2.day(dayOfWeek, {
          width: "short",
          context: "formatting"
        });
      case "EEEE":
      default:
        return localize2.day(dayOfWeek, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Local day of week
  e: function(date, token, localize2, options) {
    var dayOfWeek = date.getUTCDay();
    var localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
    switch (token) {
      case "e":
        return String(localDayOfWeek);
      case "ee":
        return addLeadingZeros(localDayOfWeek, 2);
      case "eo":
        return localize2.ordinalNumber(localDayOfWeek, {
          unit: "day"
        });
      case "eee":
        return localize2.day(dayOfWeek, {
          width: "abbreviated",
          context: "formatting"
        });
      case "eeeee":
        return localize2.day(dayOfWeek, {
          width: "narrow",
          context: "formatting"
        });
      case "eeeeee":
        return localize2.day(dayOfWeek, {
          width: "short",
          context: "formatting"
        });
      case "eeee":
      default:
        return localize2.day(dayOfWeek, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone local day of week
  c: function(date, token, localize2, options) {
    var dayOfWeek = date.getUTCDay();
    var localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
    switch (token) {
      case "c":
        return String(localDayOfWeek);
      case "cc":
        return addLeadingZeros(localDayOfWeek, token.length);
      case "co":
        return localize2.ordinalNumber(localDayOfWeek, {
          unit: "day"
        });
      case "ccc":
        return localize2.day(dayOfWeek, {
          width: "abbreviated",
          context: "standalone"
        });
      case "ccccc":
        return localize2.day(dayOfWeek, {
          width: "narrow",
          context: "standalone"
        });
      case "cccccc":
        return localize2.day(dayOfWeek, {
          width: "short",
          context: "standalone"
        });
      case "cccc":
      default:
        return localize2.day(dayOfWeek, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // ISO day of week
  i: function(date, token, localize2) {
    var dayOfWeek = date.getUTCDay();
    var isoDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
    switch (token) {
      case "i":
        return String(isoDayOfWeek);
      case "ii":
        return addLeadingZeros(isoDayOfWeek, token.length);
      case "io":
        return localize2.ordinalNumber(isoDayOfWeek, {
          unit: "day"
        });
      case "iii":
        return localize2.day(dayOfWeek, {
          width: "abbreviated",
          context: "formatting"
        });
      case "iiiii":
        return localize2.day(dayOfWeek, {
          width: "narrow",
          context: "formatting"
        });
      case "iiiiii":
        return localize2.day(dayOfWeek, {
          width: "short",
          context: "formatting"
        });
      case "iiii":
      default:
        return localize2.day(dayOfWeek, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // AM or PM
  a: function(date, token, localize2) {
    var hours = date.getUTCHours();
    var dayPeriodEnumValue = hours / 12 >= 1 ? "pm" : "am";
    switch (token) {
      case "a":
      case "aa":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        });
      case "aaa":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "aaaaa":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "narrow",
          context: "formatting"
        });
      case "aaaa":
      default:
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // AM, PM, midnight, noon
  b: function(date, token, localize2) {
    var hours = date.getUTCHours();
    var dayPeriodEnumValue;
    if (hours === 12) {
      dayPeriodEnumValue = dayPeriodEnum.noon;
    } else if (hours === 0) {
      dayPeriodEnumValue = dayPeriodEnum.midnight;
    } else {
      dayPeriodEnumValue = hours / 12 >= 1 ? "pm" : "am";
    }
    switch (token) {
      case "b":
      case "bb":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        });
      case "bbb":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "bbbbb":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "narrow",
          context: "formatting"
        });
      case "bbbb":
      default:
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // in the morning, in the afternoon, in the evening, at night
  B: function(date, token, localize2) {
    var hours = date.getUTCHours();
    var dayPeriodEnumValue;
    if (hours >= 17) {
      dayPeriodEnumValue = dayPeriodEnum.evening;
    } else if (hours >= 12) {
      dayPeriodEnumValue = dayPeriodEnum.afternoon;
    } else if (hours >= 4) {
      dayPeriodEnumValue = dayPeriodEnum.morning;
    } else {
      dayPeriodEnumValue = dayPeriodEnum.night;
    }
    switch (token) {
      case "B":
      case "BB":
      case "BBB":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        });
      case "BBBBB":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "narrow",
          context: "formatting"
        });
      case "BBBB":
      default:
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Hour [1-12]
  h: function(date, token, localize2) {
    if (token === "ho") {
      var hours = date.getUTCHours() % 12;
      if (hours === 0) hours = 12;
      return localize2.ordinalNumber(hours, {
        unit: "hour"
      });
    }
    return lightFormatters_default.h(date, token);
  },
  // Hour [0-23]
  H: function(date, token, localize2) {
    if (token === "Ho") {
      return localize2.ordinalNumber(date.getUTCHours(), {
        unit: "hour"
      });
    }
    return lightFormatters_default.H(date, token);
  },
  // Hour [0-11]
  K: function(date, token, localize2) {
    var hours = date.getUTCHours() % 12;
    if (token === "Ko") {
      return localize2.ordinalNumber(hours, {
        unit: "hour"
      });
    }
    return addLeadingZeros(hours, token.length);
  },
  // Hour [1-24]
  k: function(date, token, localize2) {
    var hours = date.getUTCHours();
    if (hours === 0) hours = 24;
    if (token === "ko") {
      return localize2.ordinalNumber(hours, {
        unit: "hour"
      });
    }
    return addLeadingZeros(hours, token.length);
  },
  // Minute
  m: function(date, token, localize2) {
    if (token === "mo") {
      return localize2.ordinalNumber(date.getUTCMinutes(), {
        unit: "minute"
      });
    }
    return lightFormatters_default.m(date, token);
  },
  // Second
  s: function(date, token, localize2) {
    if (token === "so") {
      return localize2.ordinalNumber(date.getUTCSeconds(), {
        unit: "second"
      });
    }
    return lightFormatters_default.s(date, token);
  },
  // Fraction of second
  S: function(date, token) {
    return lightFormatters_default.S(date, token);
  },
  // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
  X: function(date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timezoneOffset = originalDate.getTimezoneOffset();
    if (timezoneOffset === 0) {
      return "Z";
    }
    switch (token) {
      case "X":
        return formatTimezoneWithOptionalMinutes(timezoneOffset);
      case "XXXX":
      case "XX":
        return formatTimezone(timezoneOffset);
      case "XXXXX":
      case "XXX":
      default:
        return formatTimezone(timezoneOffset, ":");
    }
  },
  // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
  x: function(date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timezoneOffset = originalDate.getTimezoneOffset();
    switch (token) {
      case "x":
        return formatTimezoneWithOptionalMinutes(timezoneOffset);
      case "xxxx":
      case "xx":
        return formatTimezone(timezoneOffset);
      case "xxxxx":
      case "xxx":
      default:
        return formatTimezone(timezoneOffset, ":");
    }
  },
  // Timezone (GMT)
  O: function(date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timezoneOffset = originalDate.getTimezoneOffset();
    switch (token) {
      case "O":
      case "OO":
      case "OOO":
        return "GMT" + formatTimezoneShort(timezoneOffset, ":");
      case "OOOO":
      default:
        return "GMT" + formatTimezone(timezoneOffset, ":");
    }
  },
  // Timezone (specific non-location)
  z: function(date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timezoneOffset = originalDate.getTimezoneOffset();
    switch (token) {
      case "z":
      case "zz":
      case "zzz":
        return "GMT" + formatTimezoneShort(timezoneOffset, ":");
      case "zzzz":
      default:
        return "GMT" + formatTimezone(timezoneOffset, ":");
    }
  },
  // Seconds timestamp
  t: function(date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timestamp = Math.floor(originalDate.getTime() / 1e3);
    return addLeadingZeros(timestamp, token.length);
  },
  // Milliseconds timestamp
  T: function(date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timestamp = originalDate.getTime();
    return addLeadingZeros(timestamp, token.length);
  }
};
function formatTimezoneShort(offset, dirtyDelimiter) {
  var sign = offset > 0 ? "-" : "+";
  var absOffset = Math.abs(offset);
  var hours = Math.floor(absOffset / 60);
  var minutes = absOffset % 60;
  if (minutes === 0) {
    return sign + String(hours);
  }
  var delimiter = dirtyDelimiter || "";
  return sign + String(hours) + delimiter + addLeadingZeros(minutes, 2);
}
function formatTimezoneWithOptionalMinutes(offset, dirtyDelimiter) {
  if (offset % 60 === 0) {
    var sign = offset > 0 ? "-" : "+";
    return sign + addLeadingZeros(Math.abs(offset) / 60, 2);
  }
  return formatTimezone(offset, dirtyDelimiter);
}
function formatTimezone(offset, dirtyDelimiter) {
  var delimiter = dirtyDelimiter || "";
  var sign = offset > 0 ? "-" : "+";
  var absOffset = Math.abs(offset);
  var hours = addLeadingZeros(Math.floor(absOffset / 60), 2);
  var minutes = addLeadingZeros(absOffset % 60, 2);
  return sign + hours + delimiter + minutes;
}
var formatters_default = formatters2;

// node_modules/date-fns/esm/_lib/format/longFormatters/index.js
function dateLongFormatter(pattern, formatLong2) {
  switch (pattern) {
    case "P":
      return formatLong2.date({
        width: "short"
      });
    case "PP":
      return formatLong2.date({
        width: "medium"
      });
    case "PPP":
      return formatLong2.date({
        width: "long"
      });
    case "PPPP":
    default:
      return formatLong2.date({
        width: "full"
      });
  }
}
function timeLongFormatter(pattern, formatLong2) {
  switch (pattern) {
    case "p":
      return formatLong2.time({
        width: "short"
      });
    case "pp":
      return formatLong2.time({
        width: "medium"
      });
    case "ppp":
      return formatLong2.time({
        width: "long"
      });
    case "pppp":
    default:
      return formatLong2.time({
        width: "full"
      });
  }
}
function dateTimeLongFormatter(pattern, formatLong2) {
  var matchResult = pattern.match(/(P+)(p+)?/) || [];
  var datePattern = matchResult[1];
  var timePattern = matchResult[2];
  if (!timePattern) {
    return dateLongFormatter(pattern, formatLong2);
  }
  var dateTimeFormat;
  switch (datePattern) {
    case "P":
      dateTimeFormat = formatLong2.dateTime({
        width: "short"
      });
      break;
    case "PP":
      dateTimeFormat = formatLong2.dateTime({
        width: "medium"
      });
      break;
    case "PPP":
      dateTimeFormat = formatLong2.dateTime({
        width: "long"
      });
      break;
    case "PPPP":
    default:
      dateTimeFormat = formatLong2.dateTime({
        width: "full"
      });
      break;
  }
  return dateTimeFormat.replace("{{date}}", dateLongFormatter(datePattern, formatLong2)).replace("{{time}}", timeLongFormatter(timePattern, formatLong2));
}
var longFormatters = {
  p: timeLongFormatter,
  P: dateTimeLongFormatter
};
var longFormatters_default = longFormatters;

// node_modules/date-fns/esm/_lib/protectedTokens/index.js
var protectedDayOfYearTokens = ["D", "DD"];
var protectedWeekYearTokens = ["YY", "YYYY"];
function isProtectedDayOfYearToken(token) {
  return protectedDayOfYearTokens.indexOf(token) !== -1;
}
function isProtectedWeekYearToken(token) {
  return protectedWeekYearTokens.indexOf(token) !== -1;
}
function throwProtectedError(token, format2, input) {
  if (token === "YYYY") {
    throw new RangeError("Use `yyyy` instead of `YYYY` (in `".concat(format2, "`) for formatting years to the input `").concat(input, "`; see: https://git.io/fxCyr"));
  } else if (token === "YY") {
    throw new RangeError("Use `yy` instead of `YY` (in `".concat(format2, "`) for formatting years to the input `").concat(input, "`; see: https://git.io/fxCyr"));
  } else if (token === "D") {
    throw new RangeError("Use `d` instead of `D` (in `".concat(format2, "`) for formatting days of the month to the input `").concat(input, "`; see: https://git.io/fxCyr"));
  } else if (token === "DD") {
    throw new RangeError("Use `dd` instead of `DD` (in `".concat(format2, "`) for formatting days of the month to the input `").concat(input, "`; see: https://git.io/fxCyr"));
  }
}

// node_modules/date-fns/esm/format/index.js
var formattingTokensRegExp = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g;
var longFormattingTokensRegExp = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;
var escapedStringRegExp = /^'([^]*?)'?$/;
var doubleQuoteRegExp = /''/g;
var unescapedLatinCharacterRegExp = /[a-zA-Z]/;
function format(dirtyDate, dirtyFormatStr, dirtyOptions) {
  requiredArgs(2, arguments);
  var formatStr = String(dirtyFormatStr);
  var options = dirtyOptions || {};
  var locale2 = options.locale || en_US_default;
  var localeFirstWeekContainsDate = locale2.options && locale2.options.firstWeekContainsDate;
  var defaultFirstWeekContainsDate = localeFirstWeekContainsDate == null ? 1 : toInteger(localeFirstWeekContainsDate);
  var firstWeekContainsDate = options.firstWeekContainsDate == null ? defaultFirstWeekContainsDate : toInteger(options.firstWeekContainsDate);
  if (!(firstWeekContainsDate >= 1 && firstWeekContainsDate <= 7)) {
    throw new RangeError("firstWeekContainsDate must be between 1 and 7 inclusively");
  }
  var localeWeekStartsOn = locale2.options && locale2.options.weekStartsOn;
  var defaultWeekStartsOn = localeWeekStartsOn == null ? 0 : toInteger(localeWeekStartsOn);
  var weekStartsOn = options.weekStartsOn == null ? defaultWeekStartsOn : toInteger(options.weekStartsOn);
  if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
    throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
  }
  if (!locale2.localize) {
    throw new RangeError("locale must contain localize property");
  }
  if (!locale2.formatLong) {
    throw new RangeError("locale must contain formatLong property");
  }
  var originalDate = toDate(dirtyDate);
  if (!isValid(originalDate)) {
    throw new RangeError("Invalid time value");
  }
  var timezoneOffset = getTimezoneOffsetInMilliseconds(originalDate);
  var utcDate = subMilliseconds(originalDate, timezoneOffset);
  var formatterOptions = {
    firstWeekContainsDate,
    weekStartsOn,
    locale: locale2,
    _originalDate: originalDate
  };
  var result = formatStr.match(longFormattingTokensRegExp).map(function(substring) {
    var firstCharacter = substring[0];
    if (firstCharacter === "p" || firstCharacter === "P") {
      var longFormatter = longFormatters_default[firstCharacter];
      return longFormatter(substring, locale2.formatLong, formatterOptions);
    }
    return substring;
  }).join("").match(formattingTokensRegExp).map(function(substring) {
    if (substring === "''") {
      return "'";
    }
    var firstCharacter = substring[0];
    if (firstCharacter === "'") {
      return cleanEscapedString(substring);
    }
    var formatter = formatters_default[firstCharacter];
    if (formatter) {
      if (!options.useAdditionalWeekYearTokens && isProtectedWeekYearToken(substring)) {
        throwProtectedError(substring, dirtyFormatStr, dirtyDate);
      }
      if (!options.useAdditionalDayOfYearTokens && isProtectedDayOfYearToken(substring)) {
        throwProtectedError(substring, dirtyFormatStr, dirtyDate);
      }
      return formatter(utcDate, substring, locale2.localize, formatterOptions);
    }
    if (firstCharacter.match(unescapedLatinCharacterRegExp)) {
      throw new RangeError("Format string contains an unescaped latin alphabet character `" + firstCharacter + "`");
    }
    return substring;
  }).join("");
  return result;
}
function cleanEscapedString(input) {
  return input.match(escapedStringRegExp)[1].replace(doubleQuoteRegExp, "'");
}

// node_modules/date-fns/esm/_lib/assign/index.js
function assign(target, dirtyObject) {
  if (target == null) {
    throw new TypeError("assign requires that input parameter not be null or undefined");
  }
  dirtyObject = dirtyObject || {};
  for (var property in dirtyObject) {
    if (Object.prototype.hasOwnProperty.call(dirtyObject, property)) {
      target[property] = dirtyObject[property];
    }
  }
  return target;
}

// node_modules/date-fns/esm/_lib/cloneObject/index.js
function cloneObject(dirtyObject) {
  return assign({}, dirtyObject);
}

// node_modules/date-fns/esm/formatDistance/index.js
var MINUTES_IN_DAY = 1440;
var MINUTES_IN_ALMOST_TWO_DAYS = 2520;
var MINUTES_IN_MONTH = 43200;
var MINUTES_IN_TWO_MONTHS = 86400;
function formatDistance2(dirtyDate, dirtyBaseDate) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  requiredArgs(2, arguments);
  var locale2 = options.locale || en_US_default;
  if (!locale2.formatDistance) {
    throw new RangeError("locale must contain formatDistance property");
  }
  var comparison = compareAsc(dirtyDate, dirtyBaseDate);
  if (isNaN(comparison)) {
    throw new RangeError("Invalid time value");
  }
  var localizeOptions = cloneObject(options);
  localizeOptions.addSuffix = Boolean(options.addSuffix);
  localizeOptions.comparison = comparison;
  var dateLeft;
  var dateRight;
  if (comparison > 0) {
    dateLeft = toDate(dirtyBaseDate);
    dateRight = toDate(dirtyDate);
  } else {
    dateLeft = toDate(dirtyDate);
    dateRight = toDate(dirtyBaseDate);
  }
  var seconds = differenceInSeconds(dateRight, dateLeft);
  var offsetInSeconds = (getTimezoneOffsetInMilliseconds(dateRight) - getTimezoneOffsetInMilliseconds(dateLeft)) / 1e3;
  var minutes = Math.round((seconds - offsetInSeconds) / 60);
  var months2;
  if (minutes < 2) {
    if (options.includeSeconds) {
      if (seconds < 5) {
        return locale2.formatDistance("lessThanXSeconds", 5, localizeOptions);
      } else if (seconds < 10) {
        return locale2.formatDistance("lessThanXSeconds", 10, localizeOptions);
      } else if (seconds < 20) {
        return locale2.formatDistance("lessThanXSeconds", 20, localizeOptions);
      } else if (seconds < 40) {
        return locale2.formatDistance("halfAMinute", null, localizeOptions);
      } else if (seconds < 60) {
        return locale2.formatDistance("lessThanXMinutes", 1, localizeOptions);
      } else {
        return locale2.formatDistance("xMinutes", 1, localizeOptions);
      }
    } else {
      if (minutes === 0) {
        return locale2.formatDistance("lessThanXMinutes", 1, localizeOptions);
      } else {
        return locale2.formatDistance("xMinutes", minutes, localizeOptions);
      }
    }
  } else if (minutes < 45) {
    return locale2.formatDistance("xMinutes", minutes, localizeOptions);
  } else if (minutes < 90) {
    return locale2.formatDistance("aboutXHours", 1, localizeOptions);
  } else if (minutes < MINUTES_IN_DAY) {
    var hours = Math.round(minutes / 60);
    return locale2.formatDistance("aboutXHours", hours, localizeOptions);
  } else if (minutes < MINUTES_IN_ALMOST_TWO_DAYS) {
    return locale2.formatDistance("xDays", 1, localizeOptions);
  } else if (minutes < MINUTES_IN_MONTH) {
    var days2 = Math.round(minutes / MINUTES_IN_DAY);
    return locale2.formatDistance("xDays", days2, localizeOptions);
  } else if (minutes < MINUTES_IN_TWO_MONTHS) {
    months2 = Math.round(minutes / MINUTES_IN_MONTH);
    return locale2.formatDistance("aboutXMonths", months2, localizeOptions);
  }
  months2 = differenceInMonths(dateRight, dateLeft);
  if (months2 < 12) {
    var nearestMonth = Math.round(minutes / MINUTES_IN_MONTH);
    return locale2.formatDistance("xMonths", nearestMonth, localizeOptions);
  } else {
    var monthsSinceStartOfYear = months2 % 12;
    var years = Math.floor(months2 / 12);
    if (monthsSinceStartOfYear < 3) {
      return locale2.formatDistance("aboutXYears", years, localizeOptions);
    } else if (monthsSinceStartOfYear < 9) {
      return locale2.formatDistance("overXYears", years, localizeOptions);
    } else {
      return locale2.formatDistance("almostXYears", years + 1, localizeOptions);
    }
  }
}

// node_modules/date-fns/esm/formatDistanceStrict/index.js
var MILLISECONDS_IN_MINUTE2 = 1e3 * 60;
var MINUTES_IN_DAY2 = 60 * 24;
var MINUTES_IN_MONTH2 = MINUTES_IN_DAY2 * 30;
var MINUTES_IN_YEAR = MINUTES_IN_DAY2 * 365;
function formatDistanceStrict(dirtyDate, dirtyBaseDate) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  requiredArgs(2, arguments);
  var locale2 = options.locale || en_US_default;
  if (!locale2.formatDistance) {
    throw new RangeError("locale must contain localize.formatDistance property");
  }
  var comparison = compareAsc(dirtyDate, dirtyBaseDate);
  if (isNaN(comparison)) {
    throw new RangeError("Invalid time value");
  }
  var localizeOptions = cloneObject(options);
  localizeOptions.addSuffix = Boolean(options.addSuffix);
  localizeOptions.comparison = comparison;
  var dateLeft;
  var dateRight;
  if (comparison > 0) {
    dateLeft = toDate(dirtyBaseDate);
    dateRight = toDate(dirtyDate);
  } else {
    dateLeft = toDate(dirtyDate);
    dateRight = toDate(dirtyBaseDate);
  }
  var roundingMethod = options.roundingMethod == null ? "round" : String(options.roundingMethod);
  var roundingMethodFn;
  if (roundingMethod === "floor") {
    roundingMethodFn = Math.floor;
  } else if (roundingMethod === "ceil") {
    roundingMethodFn = Math.ceil;
  } else if (roundingMethod === "round") {
    roundingMethodFn = Math.round;
  } else {
    throw new RangeError("roundingMethod must be 'floor', 'ceil' or 'round'");
  }
  var milliseconds2 = dateRight.getTime() - dateLeft.getTime();
  var minutes = milliseconds2 / MILLISECONDS_IN_MINUTE2;
  var timezoneOffset = getTimezoneOffsetInMilliseconds(dateRight) - getTimezoneOffsetInMilliseconds(dateLeft);
  var dstNormalizedMinutes = (milliseconds2 - timezoneOffset) / MILLISECONDS_IN_MINUTE2;
  var unit;
  if (options.unit == null) {
    if (minutes < 1) {
      unit = "second";
    } else if (minutes < 60) {
      unit = "minute";
    } else if (minutes < MINUTES_IN_DAY2) {
      unit = "hour";
    } else if (dstNormalizedMinutes < MINUTES_IN_MONTH2) {
      unit = "day";
    } else if (dstNormalizedMinutes < MINUTES_IN_YEAR) {
      unit = "month";
    } else {
      unit = "year";
    }
  } else {
    unit = String(options.unit);
  }
  if (unit === "second") {
    var seconds = roundingMethodFn(milliseconds2 / 1e3);
    return locale2.formatDistance("xSeconds", seconds, localizeOptions);
  } else if (unit === "minute") {
    var roundedMinutes = roundingMethodFn(minutes);
    return locale2.formatDistance("xMinutes", roundedMinutes, localizeOptions);
  } else if (unit === "hour") {
    var hours = roundingMethodFn(minutes / 60);
    return locale2.formatDistance("xHours", hours, localizeOptions);
  } else if (unit === "day") {
    var days2 = roundingMethodFn(dstNormalizedMinutes / MINUTES_IN_DAY2);
    return locale2.formatDistance("xDays", days2, localizeOptions);
  } else if (unit === "month") {
    var months2 = roundingMethodFn(dstNormalizedMinutes / MINUTES_IN_MONTH2);
    return months2 === 12 && options.unit !== "month" ? locale2.formatDistance("xYears", 1, localizeOptions) : locale2.formatDistance("xMonths", months2, localizeOptions);
  } else if (unit === "year") {
    var years = roundingMethodFn(dstNormalizedMinutes / MINUTES_IN_YEAR);
    return locale2.formatDistance("xYears", years, localizeOptions);
  }
  throw new RangeError("unit must be 'second', 'minute', 'hour', 'day', 'month' or 'year'");
}

// node_modules/date-fns/esm/formatDistanceToNow/index.js
function formatDistanceToNow(dirtyDate, dirtyOptions) {
  requiredArgs(1, arguments);
  return formatDistance2(dirtyDate, Date.now(), dirtyOptions);
}

// node_modules/date-fns/esm/formatDistanceToNowStrict/index.js
function formatDistanceToNowStrict(dirtyDate, dirtyOptions) {
  requiredArgs(1, arguments);
  return formatDistanceStrict(dirtyDate, Date.now(), dirtyOptions);
}

// node_modules/date-fns/esm/formatDuration/index.js
var defaultFormat = ["years", "months", "weeks", "days", "hours", "minutes", "seconds"];
function formatDuration(duration) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  if (arguments.length < 1) {
    throw new TypeError("1 argument required, but only ".concat(arguments.length, " present"));
  }
  var format2 = (options === null || options === void 0 ? void 0 : options.format) || defaultFormat;
  var locale2 = (options === null || options === void 0 ? void 0 : options.locale) || en_US_default;
  var zero = (options === null || options === void 0 ? void 0 : options.zero) || false;
  var delimiter = (options === null || options === void 0 ? void 0 : options.delimiter) || " ";
  var result = format2.reduce(function(acc, unit) {
    var token = "x".concat(unit.replace(/(^.)/, function(m) {
      return m.toUpperCase();
    }));
    var addChunk = typeof duration[unit] === "number" && (zero || duration[unit]);
    return addChunk && locale2.formatDistance ? acc.concat(locale2.formatDistance(token, duration[unit])) : acc;
  }, []).join(delimiter);
  return result;
}

// node_modules/date-fns/esm/formatISO/index.js
function formatISO(date, options) {
  requiredArgs(1, arguments);
  var originalDate = toDate(date);
  if (isNaN(originalDate.getTime())) {
    throw new RangeError("Invalid time value");
  }
  var format2 = !(options !== null && options !== void 0 && options.format) ? "extended" : String(options.format);
  var representation = !(options !== null && options !== void 0 && options.representation) ? "complete" : String(options.representation);
  if (format2 !== "extended" && format2 !== "basic") {
    throw new RangeError("format must be 'extended' or 'basic'");
  }
  if (representation !== "date" && representation !== "time" && representation !== "complete") {
    throw new RangeError("representation must be 'date', 'time', or 'complete'");
  }
  var result = "";
  var tzOffset = "";
  var dateDelimiter = format2 === "extended" ? "-" : "";
  var timeDelimiter = format2 === "extended" ? ":" : "";
  if (representation !== "time") {
    var day = addLeadingZeros(originalDate.getDate(), 2);
    var month = addLeadingZeros(originalDate.getMonth() + 1, 2);
    var year = addLeadingZeros(originalDate.getFullYear(), 4);
    result = "".concat(year).concat(dateDelimiter).concat(month).concat(dateDelimiter).concat(day);
  }
  if (representation !== "date") {
    var offset = originalDate.getTimezoneOffset();
    if (offset !== 0) {
      var absoluteOffset = Math.abs(offset);
      var hourOffset = addLeadingZeros(Math.floor(absoluteOffset / 60), 2);
      var minuteOffset = addLeadingZeros(absoluteOffset % 60, 2);
      var sign = offset < 0 ? "+" : "-";
      tzOffset = "".concat(sign).concat(hourOffset, ":").concat(minuteOffset);
    } else {
      tzOffset = "Z";
    }
    var hour = addLeadingZeros(originalDate.getHours(), 2);
    var minute = addLeadingZeros(originalDate.getMinutes(), 2);
    var second = addLeadingZeros(originalDate.getSeconds(), 2);
    var separator = result === "" ? "" : "T";
    var time = [hour, minute, second].join(timeDelimiter);
    result = "".concat(result).concat(separator).concat(time).concat(tzOffset);
  }
  return result;
}

// node_modules/date-fns/esm/formatISO9075/index.js
function formatISO9075(dirtyDate, dirtyOptions) {
  if (arguments.length < 1) {
    throw new TypeError("1 argument required, but only ".concat(arguments.length, " present"));
  }
  var originalDate = toDate(dirtyDate);
  if (!isValid(originalDate)) {
    throw new RangeError("Invalid time value");
  }
  var options = dirtyOptions || {};
  var format2 = options.format == null ? "extended" : String(options.format);
  var representation = options.representation == null ? "complete" : String(options.representation);
  if (format2 !== "extended" && format2 !== "basic") {
    throw new RangeError("format must be 'extended' or 'basic'");
  }
  if (representation !== "date" && representation !== "time" && representation !== "complete") {
    throw new RangeError("representation must be 'date', 'time', or 'complete'");
  }
  var result = "";
  var dateDelimiter = format2 === "extended" ? "-" : "";
  var timeDelimiter = format2 === "extended" ? ":" : "";
  if (representation !== "time") {
    var day = addLeadingZeros(originalDate.getDate(), 2);
    var month = addLeadingZeros(originalDate.getMonth() + 1, 2);
    var year = addLeadingZeros(originalDate.getFullYear(), 4);
    result = "".concat(year).concat(dateDelimiter).concat(month).concat(dateDelimiter).concat(day);
  }
  if (representation !== "date") {
    var hour = addLeadingZeros(originalDate.getHours(), 2);
    var minute = addLeadingZeros(originalDate.getMinutes(), 2);
    var second = addLeadingZeros(originalDate.getSeconds(), 2);
    var separator = result === "" ? "" : " ";
    result = "".concat(result).concat(separator).concat(hour).concat(timeDelimiter).concat(minute).concat(timeDelimiter).concat(second);
  }
  return result;
}

// node_modules/date-fns/esm/formatISODuration/index.js
function formatISODuration(duration) {
  requiredArgs(1, arguments);
  if (typeof duration !== "object") throw new Error("Duration must be an object");
  var _duration$years = duration.years, years = _duration$years === void 0 ? 0 : _duration$years, _duration$months = duration.months, months2 = _duration$months === void 0 ? 0 : _duration$months, _duration$days = duration.days, days2 = _duration$days === void 0 ? 0 : _duration$days, _duration$hours = duration.hours, hours = _duration$hours === void 0 ? 0 : _duration$hours, _duration$minutes = duration.minutes, minutes = _duration$minutes === void 0 ? 0 : _duration$minutes, _duration$seconds = duration.seconds, seconds = _duration$seconds === void 0 ? 0 : _duration$seconds;
  return "P".concat(years, "Y").concat(months2, "M").concat(days2, "DT").concat(hours, "H").concat(minutes, "M").concat(seconds, "S");
}

// node_modules/date-fns/esm/formatRFC3339/index.js
function formatRFC3339(dirtyDate, dirtyOptions) {
  if (arguments.length < 1) {
    throw new TypeError("1 arguments required, but only ".concat(arguments.length, " present"));
  }
  var originalDate = toDate(dirtyDate);
  if (!isValid(originalDate)) {
    throw new RangeError("Invalid time value");
  }
  var _ref = dirtyOptions || {}, _ref$fractionDigits = _ref.fractionDigits, fractionDigits = _ref$fractionDigits === void 0 ? 0 : _ref$fractionDigits;
  if (!(fractionDigits >= 0 && fractionDigits <= 3)) {
    throw new RangeError("fractionDigits must be between 0 and 3 inclusively");
  }
  var day = addLeadingZeros(originalDate.getDate(), 2);
  var month = addLeadingZeros(originalDate.getMonth() + 1, 2);
  var year = originalDate.getFullYear();
  var hour = addLeadingZeros(originalDate.getHours(), 2);
  var minute = addLeadingZeros(originalDate.getMinutes(), 2);
  var second = addLeadingZeros(originalDate.getSeconds(), 2);
  var fractionalSecond = "";
  if (fractionDigits > 0) {
    var milliseconds2 = originalDate.getMilliseconds();
    var fractionalSeconds = Math.floor(milliseconds2 * Math.pow(10, fractionDigits - 3));
    fractionalSecond = "." + addLeadingZeros(fractionalSeconds, fractionDigits);
  }
  var offset = "";
  var tzOffset = originalDate.getTimezoneOffset();
  if (tzOffset !== 0) {
    var absoluteOffset = Math.abs(tzOffset);
    var hourOffset = addLeadingZeros(toInteger(absoluteOffset / 60), 2);
    var minuteOffset = addLeadingZeros(absoluteOffset % 60, 2);
    var sign = tzOffset < 0 ? "+" : "-";
    offset = "".concat(sign).concat(hourOffset, ":").concat(minuteOffset);
  } else {
    offset = "Z";
  }
  return "".concat(year, "-").concat(month, "-").concat(day, "T").concat(hour, ":").concat(minute, ":").concat(second).concat(fractionalSecond).concat(offset);
}

// node_modules/date-fns/esm/formatRFC7231/index.js
var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function formatRFC7231(dirtyDate) {
  if (arguments.length < 1) {
    throw new TypeError("1 arguments required, but only ".concat(arguments.length, " present"));
  }
  var originalDate = toDate(dirtyDate);
  if (!isValid(originalDate)) {
    throw new RangeError("Invalid time value");
  }
  var dayName = days[originalDate.getUTCDay()];
  var dayOfMonth = addLeadingZeros(originalDate.getUTCDate(), 2);
  var monthName = months[originalDate.getUTCMonth()];
  var year = originalDate.getUTCFullYear();
  var hour = addLeadingZeros(originalDate.getUTCHours(), 2);
  var minute = addLeadingZeros(originalDate.getUTCMinutes(), 2);
  var second = addLeadingZeros(originalDate.getUTCSeconds(), 2);
  return "".concat(dayName, ", ").concat(dayOfMonth, " ").concat(monthName, " ").concat(year, " ").concat(hour, ":").concat(minute, ":").concat(second, " GMT");
}

// node_modules/date-fns/esm/formatRelative/index.js
function formatRelative2(dirtyDate, dirtyBaseDate, dirtyOptions) {
  requiredArgs(2, arguments);
  var date = toDate(dirtyDate);
  var baseDate = toDate(dirtyBaseDate);
  var _ref = dirtyOptions || {}, _ref$locale = _ref.locale, locale2 = _ref$locale === void 0 ? en_US_default : _ref$locale, _ref$weekStartsOn = _ref.weekStartsOn, weekStartsOn = _ref$weekStartsOn === void 0 ? 0 : _ref$weekStartsOn;
  if (!locale2.localize) {
    throw new RangeError("locale must contain localize property");
  }
  if (!locale2.formatLong) {
    throw new RangeError("locale must contain formatLong property");
  }
  if (!locale2.formatRelative) {
    throw new RangeError("locale must contain formatRelative property");
  }
  var diff = differenceInCalendarDays(date, baseDate);
  if (isNaN(diff)) {
    throw new RangeError("Invalid time value");
  }
  var token;
  if (diff < -6) {
    token = "other";
  } else if (diff < -1) {
    token = "lastWeek";
  } else if (diff < 0) {
    token = "yesterday";
  } else if (diff < 1) {
    token = "today";
  } else if (diff < 2) {
    token = "tomorrow";
  } else if (diff < 7) {
    token = "nextWeek";
  } else {
    token = "other";
  }
  var utcDate = subMilliseconds(date, getTimezoneOffsetInMilliseconds(date));
  var utcBaseDate = subMilliseconds(baseDate, getTimezoneOffsetInMilliseconds(baseDate));
  var formatStr = locale2.formatRelative(token, utcDate, utcBaseDate, {
    locale: locale2,
    weekStartsOn
  });
  return format(date, formatStr, {
    locale: locale2,
    weekStartsOn
  });
}

// node_modules/date-fns/esm/fromUnixTime/index.js
function fromUnixTime(dirtyUnixTime) {
  requiredArgs(1, arguments);
  var unixTime = toInteger(dirtyUnixTime);
  return toDate(unixTime * 1e3);
}

// node_modules/date-fns/esm/getDate/index.js
function getDate(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var dayOfMonth = date.getDate();
  return dayOfMonth;
}

// node_modules/date-fns/esm/getDay/index.js
function getDay(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var day = date.getDay();
  return day;
}

// node_modules/date-fns/esm/getDayOfYear/index.js
function getDayOfYear(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var diff = differenceInCalendarDays(date, startOfYear(date));
  var dayOfYear = diff + 1;
  return dayOfYear;
}

// node_modules/date-fns/esm/getDaysInMonth/index.js
function getDaysInMonth(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var year = date.getFullYear();
  var monthIndex = date.getMonth();
  var lastDayOfMonth2 = /* @__PURE__ */ new Date(0);
  lastDayOfMonth2.setFullYear(year, monthIndex + 1, 0);
  lastDayOfMonth2.setHours(0, 0, 0, 0);
  return lastDayOfMonth2.getDate();
}

// node_modules/date-fns/esm/isLeapYear/index.js
function isLeapYear(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var year = date.getFullYear();
  return year % 400 === 0 || year % 4 === 0 && year % 100 !== 0;
}

// node_modules/date-fns/esm/getDaysInYear/index.js
function getDaysInYear(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  if (String(new Date(date)) === "Invalid Date") {
    return NaN;
  }
  return isLeapYear(date) ? 366 : 365;
}

// node_modules/date-fns/esm/getDecade/index.js
function getDecade(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var year = date.getFullYear();
  var decade = Math.floor(year / 10) * 10;
  return decade;
}

// node_modules/date-fns/esm/getHours/index.js
function getHours(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var hours = date.getHours();
  return hours;
}

// node_modules/date-fns/esm/getISODay/index.js
function getISODay(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var day = date.getDay();
  if (day === 0) {
    day = 7;
  }
  return day;
}

// node_modules/date-fns/esm/getISOWeek/index.js
var MILLISECONDS_IN_WEEK5 = 6048e5;
function getISOWeek(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var diff = startOfISOWeek(date).getTime() - startOfISOWeekYear(date).getTime();
  return Math.round(diff / MILLISECONDS_IN_WEEK5) + 1;
}

// node_modules/date-fns/esm/getISOWeeksInYear/index.js
var MILLISECONDS_IN_WEEK6 = 6048e5;
function getISOWeeksInYear(dirtyDate) {
  requiredArgs(1, arguments);
  var thisYear = startOfISOWeekYear(dirtyDate);
  var nextYear = startOfISOWeekYear(addWeeks(thisYear, 60));
  var diff = nextYear.valueOf() - thisYear.valueOf();
  return Math.round(diff / MILLISECONDS_IN_WEEK6);
}

// node_modules/date-fns/esm/getMilliseconds/index.js
function getMilliseconds(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var milliseconds2 = date.getMilliseconds();
  return milliseconds2;
}

// node_modules/date-fns/esm/getMinutes/index.js
function getMinutes(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var minutes = date.getMinutes();
  return minutes;
}

// node_modules/date-fns/esm/getMonth/index.js
function getMonth(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var month = date.getMonth();
  return month;
}

// node_modules/date-fns/esm/getOverlappingDaysInIntervals/index.js
var MILLISECONDS_IN_DAY3 = 24 * 60 * 60 * 1e3;
function getOverlappingDaysInIntervals(dirtyIntervalLeft, dirtyIntervalRight) {
  requiredArgs(2, arguments);
  var intervalLeft = dirtyIntervalLeft || {};
  var intervalRight = dirtyIntervalRight || {};
  var leftStartTime = toDate(intervalLeft.start).getTime();
  var leftEndTime = toDate(intervalLeft.end).getTime();
  var rightStartTime = toDate(intervalRight.start).getTime();
  var rightEndTime = toDate(intervalRight.end).getTime();
  if (!(leftStartTime <= leftEndTime && rightStartTime <= rightEndTime)) {
    throw new RangeError("Invalid interval");
  }
  var isOverlapping = leftStartTime < rightEndTime && rightStartTime < leftEndTime;
  if (!isOverlapping) {
    return 0;
  }
  var overlapStartDate = rightStartTime < leftStartTime ? leftStartTime : rightStartTime;
  var overlapEndDate = rightEndTime > leftEndTime ? leftEndTime : rightEndTime;
  var differenceInMs = overlapEndDate - overlapStartDate;
  return Math.ceil(differenceInMs / MILLISECONDS_IN_DAY3);
}

// node_modules/date-fns/esm/getSeconds/index.js
function getSeconds(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var seconds = date.getSeconds();
  return seconds;
}

// node_modules/date-fns/esm/getTime/index.js
function getTime(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var timestamp = date.getTime();
  return timestamp;
}

// node_modules/date-fns/esm/getUnixTime/index.js
function getUnixTime(dirtyDate) {
  requiredArgs(1, arguments);
  return Math.floor(getTime(dirtyDate) / 1e3);
}

// node_modules/date-fns/esm/getWeekYear/index.js
function getWeekYear(dirtyDate, options) {
  var _options$locale, _options$locale$optio;
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var year = date.getFullYear();
  var localeFirstWeekContainsDate = options === null || options === void 0 ? void 0 : (_options$locale = options.locale) === null || _options$locale === void 0 ? void 0 : (_options$locale$optio = _options$locale.options) === null || _options$locale$optio === void 0 ? void 0 : _options$locale$optio.firstWeekContainsDate;
  var defaultFirstWeekContainsDate = localeFirstWeekContainsDate == null ? 1 : toInteger(localeFirstWeekContainsDate);
  var firstWeekContainsDate = (options === null || options === void 0 ? void 0 : options.firstWeekContainsDate) == null ? defaultFirstWeekContainsDate : toInteger(options.firstWeekContainsDate);
  if (!(firstWeekContainsDate >= 1 && firstWeekContainsDate <= 7)) {
    throw new RangeError("firstWeekContainsDate must be between 1 and 7 inclusively");
  }
  var firstWeekOfNextYear = /* @__PURE__ */ new Date(0);
  firstWeekOfNextYear.setFullYear(year + 1, 0, firstWeekContainsDate);
  firstWeekOfNextYear.setHours(0, 0, 0, 0);
  var startOfNextYear = startOfWeek(firstWeekOfNextYear, options);
  var firstWeekOfThisYear = /* @__PURE__ */ new Date(0);
  firstWeekOfThisYear.setFullYear(year, 0, firstWeekContainsDate);
  firstWeekOfThisYear.setHours(0, 0, 0, 0);
  var startOfThisYear = startOfWeek(firstWeekOfThisYear, options);
  if (date.getTime() >= startOfNextYear.getTime()) {
    return year + 1;
  } else if (date.getTime() >= startOfThisYear.getTime()) {
    return year;
  } else {
    return year - 1;
  }
}

// node_modules/date-fns/esm/startOfWeekYear/index.js
function startOfWeekYear(dirtyDate, dirtyOptions) {
  requiredArgs(1, arguments);
  var options = dirtyOptions || {};
  var locale2 = options.locale;
  var localeFirstWeekContainsDate = locale2 && locale2.options && locale2.options.firstWeekContainsDate;
  var defaultFirstWeekContainsDate = localeFirstWeekContainsDate == null ? 1 : toInteger(localeFirstWeekContainsDate);
  var firstWeekContainsDate = options.firstWeekContainsDate == null ? defaultFirstWeekContainsDate : toInteger(options.firstWeekContainsDate);
  var year = getWeekYear(dirtyDate, dirtyOptions);
  var firstWeek = /* @__PURE__ */ new Date(0);
  firstWeek.setFullYear(year, 0, firstWeekContainsDate);
  firstWeek.setHours(0, 0, 0, 0);
  var date = startOfWeek(firstWeek, dirtyOptions);
  return date;
}

// node_modules/date-fns/esm/getWeek/index.js
var MILLISECONDS_IN_WEEK7 = 6048e5;
function getWeek(dirtyDate, options) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var diff = startOfWeek(date, options).getTime() - startOfWeekYear(date, options).getTime();
  return Math.round(diff / MILLISECONDS_IN_WEEK7) + 1;
}

// node_modules/date-fns/esm/getWeekOfMonth/index.js
function getWeekOfMonth(date, options) {
  var _options$locale, _options$locale$optio;
  requiredArgs(1, arguments);
  var defaultWeekStartsOn = (options === null || options === void 0 ? void 0 : (_options$locale = options.locale) === null || _options$locale === void 0 ? void 0 : (_options$locale$optio = _options$locale.options) === null || _options$locale$optio === void 0 ? void 0 : _options$locale$optio.weekStartsOn) || 0;
  var weekStartsOn = (options === null || options === void 0 ? void 0 : options.weekStartsOn) == null ? toInteger(defaultWeekStartsOn) : toInteger(options.weekStartsOn);
  if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
    throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
  }
  var currentDayOfMonth = getDate(date);
  if (isNaN(currentDayOfMonth)) return NaN;
  var startWeekDay = getDay(startOfMonth(date));
  var lastDayOfFirstWeek = weekStartsOn - startWeekDay;
  if (lastDayOfFirstWeek <= 0) lastDayOfFirstWeek += 7;
  var remainingDaysAfterFirstWeek = currentDayOfMonth - lastDayOfFirstWeek;
  return Math.ceil(remainingDaysAfterFirstWeek / 7) + 1;
}

// node_modules/date-fns/esm/lastDayOfMonth/index.js
function lastDayOfMonth(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var month = date.getMonth();
  date.setFullYear(date.getFullYear(), month + 1, 0);
  date.setHours(0, 0, 0, 0);
  return date;
}

// node_modules/date-fns/esm/getWeeksInMonth/index.js
function getWeeksInMonth(date, options) {
  requiredArgs(1, arguments);
  return differenceInCalendarWeeks(lastDayOfMonth(date), startOfMonth(date), options) + 1;
}

// node_modules/date-fns/esm/getYear/index.js
function getYear(dirtyDate) {
  requiredArgs(1, arguments);
  return toDate(dirtyDate).getFullYear();
}

// node_modules/date-fns/esm/hoursToMilliseconds/index.js
function hoursToMilliseconds(hours) {
  requiredArgs(1, arguments);
  return Math.floor(hours * millisecondsInHour);
}

// node_modules/date-fns/esm/hoursToMinutes/index.js
function hoursToMinutes(hours) {
  requiredArgs(1, arguments);
  return Math.floor(hours * minutesInHour);
}

// node_modules/date-fns/esm/hoursToSeconds/index.js
function hoursToSeconds(hours) {
  requiredArgs(1, arguments);
  return Math.floor(hours * secondsInHour);
}

// node_modules/date-fns/esm/subDays/index.js
function subDays(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var amount = toInteger(dirtyAmount);
  return addDays(dirtyDate, -amount);
}

// node_modules/date-fns/esm/subMonths/index.js
function subMonths(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var amount = toInteger(dirtyAmount);
  return addMonths(dirtyDate, -amount);
}

// node_modules/date-fns/esm/sub/index.js
function sub(date, duration) {
  requiredArgs(2, arguments);
  if (!duration || typeof duration !== "object") return /* @__PURE__ */ new Date(NaN);
  var years = duration.years ? toInteger(duration.years) : 0;
  var months2 = duration.months ? toInteger(duration.months) : 0;
  var weeks = duration.weeks ? toInteger(duration.weeks) : 0;
  var days2 = duration.days ? toInteger(duration.days) : 0;
  var hours = duration.hours ? toInteger(duration.hours) : 0;
  var minutes = duration.minutes ? toInteger(duration.minutes) : 0;
  var seconds = duration.seconds ? toInteger(duration.seconds) : 0;
  var dateWithoutMonths = subMonths(date, months2 + years * 12);
  var dateWithoutDays = subDays(dateWithoutMonths, days2 + weeks * 7);
  var minutestoSub = minutes + hours * 60;
  var secondstoSub = seconds + minutestoSub * 60;
  var mstoSub = secondstoSub * 1e3;
  var finalDate = new Date(dateWithoutDays.getTime() - mstoSub);
  return finalDate;
}

// node_modules/date-fns/esm/intervalToDuration/index.js
function intervalToDuration(_ref) {
  var start = _ref.start, end = _ref.end;
  requiredArgs(1, arguments);
  var dateLeft = toDate(start);
  var dateRight = toDate(end);
  if (!isValid(dateLeft)) {
    throw new RangeError("Start Date is invalid");
  }
  if (!isValid(dateRight)) {
    throw new RangeError("End Date is invalid");
  }
  var duration = {
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  };
  var sign = compareAsc(dateLeft, dateRight);
  duration.years = Math.abs(differenceInYears(dateLeft, dateRight));
  var remainingMonths = sub(dateLeft, {
    years: sign * duration.years
  });
  duration.months = Math.abs(differenceInMonths(remainingMonths, dateRight));
  var remainingDays = sub(remainingMonths, {
    months: sign * duration.months
  });
  duration.days = Math.abs(differenceInDays(remainingDays, dateRight));
  var remainingHours = sub(remainingDays, {
    days: sign * duration.days
  });
  duration.hours = Math.abs(differenceInHours(remainingHours, dateRight));
  var remainingMinutes = sub(remainingHours, {
    hours: sign * duration.hours
  });
  duration.minutes = Math.abs(differenceInMinutes(remainingMinutes, dateRight));
  var remainingSeconds = sub(remainingMinutes, {
    minutes: sign * duration.minutes
  });
  duration.seconds = Math.abs(differenceInSeconds(remainingSeconds, dateRight));
  return duration;
}

// node_modules/date-fns/esm/intlFormat/index.js
function intlFormat(date, formatOrLocale, localeOptions) {
  var _localeOptions;
  requiredArgs(1, arguments);
  var formatOptions;
  if (isFormatOptions(formatOrLocale)) {
    formatOptions = formatOrLocale;
  } else {
    localeOptions = formatOrLocale;
  }
  return new Intl.DateTimeFormat((_localeOptions = localeOptions) === null || _localeOptions === void 0 ? void 0 : _localeOptions.locale, formatOptions).format(date);
}
function isFormatOptions(opts) {
  return opts !== void 0 && !("locale" in opts);
}

// node_modules/date-fns/esm/isAfter/index.js
function isAfter(dirtyDate, dirtyDateToCompare) {
  requiredArgs(2, arguments);
  var date = toDate(dirtyDate);
  var dateToCompare = toDate(dirtyDateToCompare);
  return date.getTime() > dateToCompare.getTime();
}

// node_modules/date-fns/esm/isBefore/index.js
function isBefore(dirtyDate, dirtyDateToCompare) {
  requiredArgs(2, arguments);
  var date = toDate(dirtyDate);
  var dateToCompare = toDate(dirtyDateToCompare);
  return date.getTime() < dateToCompare.getTime();
}

// node_modules/date-fns/esm/isEqual/index.js
function isEqual(dirtyLeftDate, dirtyRightDate) {
  requiredArgs(2, arguments);
  var dateLeft = toDate(dirtyLeftDate);
  var dateRight = toDate(dirtyRightDate);
  return dateLeft.getTime() === dateRight.getTime();
}

// node_modules/date-fns/esm/isExists/index.js
function isExists(year, month, day) {
  if (arguments.length < 3) {
    throw new TypeError("3 argument required, but only " + arguments.length + " present");
  }
  var date = new Date(year, month, day);
  return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day;
}

// node_modules/date-fns/esm/isFirstDayOfMonth/index.js
function isFirstDayOfMonth(dirtyDate) {
  requiredArgs(1, arguments);
  return toDate(dirtyDate).getDate() === 1;
}

// node_modules/date-fns/esm/isFriday/index.js
function isFriday(dirtyDate) {
  requiredArgs(1, arguments);
  return toDate(dirtyDate).getDay() === 5;
}

// node_modules/date-fns/esm/isFuture/index.js
function isFuture(dirtyDate) {
  requiredArgs(1, arguments);
  return toDate(dirtyDate).getTime() > Date.now();
}

// node_modules/date-fns/esm/_lib/setUTCDay/index.js
function setUTCDay(dirtyDate, dirtyDay, dirtyOptions) {
  requiredArgs(2, arguments);
  var options = dirtyOptions || {};
  var locale2 = options.locale;
  var localeWeekStartsOn = locale2 && locale2.options && locale2.options.weekStartsOn;
  var defaultWeekStartsOn = localeWeekStartsOn == null ? 0 : toInteger(localeWeekStartsOn);
  var weekStartsOn = options.weekStartsOn == null ? defaultWeekStartsOn : toInteger(options.weekStartsOn);
  if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
    throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
  }
  var date = toDate(dirtyDate);
  var day = toInteger(dirtyDay);
  var currentDay = date.getUTCDay();
  var remainder = day % 7;
  var dayIndex = (remainder + 7) % 7;
  var diff = (dayIndex < weekStartsOn ? 7 : 0) + day - currentDay;
  date.setUTCDate(date.getUTCDate() + diff);
  return date;
}

// node_modules/date-fns/esm/_lib/setUTCISODay/index.js
function setUTCISODay(dirtyDate, dirtyDay) {
  requiredArgs(2, arguments);
  var day = toInteger(dirtyDay);
  if (day % 7 === 0) {
    day = day - 7;
  }
  var weekStartsOn = 1;
  var date = toDate(dirtyDate);
  var currentDay = date.getUTCDay();
  var remainder = day % 7;
  var dayIndex = (remainder + 7) % 7;
  var diff = (dayIndex < weekStartsOn ? 7 : 0) + day - currentDay;
  date.setUTCDate(date.getUTCDate() + diff);
  return date;
}

// node_modules/date-fns/esm/_lib/setUTCISOWeek/index.js
function setUTCISOWeek(dirtyDate, dirtyISOWeek) {
  requiredArgs(2, arguments);
  var date = toDate(dirtyDate);
  var isoWeek = toInteger(dirtyISOWeek);
  var diff = getUTCISOWeek(date) - isoWeek;
  date.setUTCDate(date.getUTCDate() - diff * 7);
  return date;
}

// node_modules/date-fns/esm/_lib/setUTCWeek/index.js
function setUTCWeek(dirtyDate, dirtyWeek, options) {
  requiredArgs(2, arguments);
  var date = toDate(dirtyDate);
  var week = toInteger(dirtyWeek);
  var diff = getUTCWeek(date, options) - week;
  date.setUTCDate(date.getUTCDate() - diff * 7);
  return date;
}

// node_modules/date-fns/esm/parse/_lib/parsers/index.js
var MILLISECONDS_IN_HOUR2 = 36e5;
var MILLISECONDS_IN_MINUTE3 = 6e4;
var MILLISECONDS_IN_SECOND = 1e3;
var numericPatterns = {
  month: /^(1[0-2]|0?\d)/,
  // 0 to 12
  date: /^(3[0-1]|[0-2]?\d)/,
  // 0 to 31
  dayOfYear: /^(36[0-6]|3[0-5]\d|[0-2]?\d?\d)/,
  // 0 to 366
  week: /^(5[0-3]|[0-4]?\d)/,
  // 0 to 53
  hour23h: /^(2[0-3]|[0-1]?\d)/,
  // 0 to 23
  hour24h: /^(2[0-4]|[0-1]?\d)/,
  // 0 to 24
  hour11h: /^(1[0-1]|0?\d)/,
  // 0 to 11
  hour12h: /^(1[0-2]|0?\d)/,
  // 0 to 12
  minute: /^[0-5]?\d/,
  // 0 to 59
  second: /^[0-5]?\d/,
  // 0 to 59
  singleDigit: /^\d/,
  // 0 to 9
  twoDigits: /^\d{1,2}/,
  // 0 to 99
  threeDigits: /^\d{1,3}/,
  // 0 to 999
  fourDigits: /^\d{1,4}/,
  // 0 to 9999
  anyDigitsSigned: /^-?\d+/,
  singleDigitSigned: /^-?\d/,
  // 0 to 9, -0 to -9
  twoDigitsSigned: /^-?\d{1,2}/,
  // 0 to 99, -0 to -99
  threeDigitsSigned: /^-?\d{1,3}/,
  // 0 to 999, -0 to -999
  fourDigitsSigned: /^-?\d{1,4}/
  // 0 to 9999, -0 to -9999
};
var timezonePatterns = {
  basicOptionalMinutes: /^([+-])(\d{2})(\d{2})?|Z/,
  basic: /^([+-])(\d{2})(\d{2})|Z/,
  basicOptionalSeconds: /^([+-])(\d{2})(\d{2})((\d{2}))?|Z/,
  extended: /^([+-])(\d{2}):(\d{2})|Z/,
  extendedOptionalSeconds: /^([+-])(\d{2}):(\d{2})(:(\d{2}))?|Z/
};
function parseNumericPattern(pattern, string, valueCallback) {
  var matchResult = string.match(pattern);
  if (!matchResult) {
    return null;
  }
  var value = parseInt(matchResult[0], 10);
  return {
    value: valueCallback ? valueCallback(value) : value,
    rest: string.slice(matchResult[0].length)
  };
}
function parseTimezonePattern(pattern, string) {
  var matchResult = string.match(pattern);
  if (!matchResult) {
    return null;
  }
  if (matchResult[0] === "Z") {
    return {
      value: 0,
      rest: string.slice(1)
    };
  }
  var sign = matchResult[1] === "+" ? 1 : -1;
  var hours = matchResult[2] ? parseInt(matchResult[2], 10) : 0;
  var minutes = matchResult[3] ? parseInt(matchResult[3], 10) : 0;
  var seconds = matchResult[5] ? parseInt(matchResult[5], 10) : 0;
  return {
    value: sign * (hours * MILLISECONDS_IN_HOUR2 + minutes * MILLISECONDS_IN_MINUTE3 + seconds * MILLISECONDS_IN_SECOND),
    rest: string.slice(matchResult[0].length)
  };
}
function parseAnyDigitsSigned(string, valueCallback) {
  return parseNumericPattern(numericPatterns.anyDigitsSigned, string, valueCallback);
}
function parseNDigits(n, string, valueCallback) {
  switch (n) {
    case 1:
      return parseNumericPattern(numericPatterns.singleDigit, string, valueCallback);
    case 2:
      return parseNumericPattern(numericPatterns.twoDigits, string, valueCallback);
    case 3:
      return parseNumericPattern(numericPatterns.threeDigits, string, valueCallback);
    case 4:
      return parseNumericPattern(numericPatterns.fourDigits, string, valueCallback);
    default:
      return parseNumericPattern(new RegExp("^\\d{1," + n + "}"), string, valueCallback);
  }
}
function parseNDigitsSigned(n, string, valueCallback) {
  switch (n) {
    case 1:
      return parseNumericPattern(numericPatterns.singleDigitSigned, string, valueCallback);
    case 2:
      return parseNumericPattern(numericPatterns.twoDigitsSigned, string, valueCallback);
    case 3:
      return parseNumericPattern(numericPatterns.threeDigitsSigned, string, valueCallback);
    case 4:
      return parseNumericPattern(numericPatterns.fourDigitsSigned, string, valueCallback);
    default:
      return parseNumericPattern(new RegExp("^-?\\d{1," + n + "}"), string, valueCallback);
  }
}
function dayPeriodEnumToHours(enumValue) {
  switch (enumValue) {
    case "morning":
      return 4;
    case "evening":
      return 17;
    case "pm":
    case "noon":
    case "afternoon":
      return 12;
    case "am":
    case "midnight":
    case "night":
    default:
      return 0;
  }
}
function normalizeTwoDigitYear(twoDigitYear, currentYear) {
  var isCommonEra = currentYear > 0;
  var absCurrentYear = isCommonEra ? currentYear : 1 - currentYear;
  var result;
  if (absCurrentYear <= 50) {
    result = twoDigitYear || 100;
  } else {
    var rangeEnd = absCurrentYear + 50;
    var rangeEndCentury = Math.floor(rangeEnd / 100) * 100;
    var isPreviousCentury = twoDigitYear >= rangeEnd % 100;
    result = twoDigitYear + rangeEndCentury - (isPreviousCentury ? 100 : 0);
  }
  return isCommonEra ? result : 1 - result;
}
var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var DAYS_IN_MONTH_LEAP_YEAR = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
function isLeapYearIndex(year) {
  return year % 400 === 0 || year % 4 === 0 && year % 100 !== 0;
}
var parsers = {
  // Era
  G: {
    priority: 140,
    parse: function(string, token, match2, _options) {
      switch (token) {
        case "G":
        case "GG":
        case "GGG":
          return match2.era(string, {
            width: "abbreviated"
          }) || match2.era(string, {
            width: "narrow"
          });
        case "GGGGG":
          return match2.era(string, {
            width: "narrow"
          });
        case "GGGG":
        default:
          return match2.era(string, {
            width: "wide"
          }) || match2.era(string, {
            width: "abbreviated"
          }) || match2.era(string, {
            width: "narrow"
          });
      }
    },
    set: function(date, flags, value, _options) {
      flags.era = value;
      date.setUTCFullYear(value, 0, 1);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    },
    incompatibleTokens: ["R", "u", "t", "T"]
  },
  // Year
  y: {
    // From http://www.unicode.org/reports/tr35/tr35-31/tr35-dates.html#Date_Format_Patterns
    // | Year     |     y | yy |   yyy |  yyyy | yyyyy |
    // |----------|-------|----|-------|-------|-------|
    // | AD 1     |     1 | 01 |   001 |  0001 | 00001 |
    // | AD 12    |    12 | 12 |   012 |  0012 | 00012 |
    // | AD 123   |   123 | 23 |   123 |  0123 | 00123 |
    // | AD 1234  |  1234 | 34 |  1234 |  1234 | 01234 |
    // | AD 12345 | 12345 | 45 | 12345 | 12345 | 12345 |
    priority: 130,
    parse: function(string, token, match2, _options) {
      var valueCallback = function(year) {
        return {
          year,
          isTwoDigitYear: token === "yy"
        };
      };
      switch (token) {
        case "y":
          return parseNDigits(4, string, valueCallback);
        case "yo":
          return match2.ordinalNumber(string, {
            unit: "year",
            valueCallback
          });
        default:
          return parseNDigits(token.length, string, valueCallback);
      }
    },
    validate: function(_date, value, _options) {
      return value.isTwoDigitYear || value.year > 0;
    },
    set: function(date, flags, value, _options) {
      var currentYear = date.getUTCFullYear();
      if (value.isTwoDigitYear) {
        var normalizedTwoDigitYear = normalizeTwoDigitYear(value.year, currentYear);
        date.setUTCFullYear(normalizedTwoDigitYear, 0, 1);
        date.setUTCHours(0, 0, 0, 0);
        return date;
      }
      var year = !("era" in flags) || flags.era === 1 ? value.year : 1 - value.year;
      date.setUTCFullYear(year, 0, 1);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    },
    incompatibleTokens: ["Y", "R", "u", "w", "I", "i", "e", "c", "t", "T"]
  },
  // Local week-numbering year
  Y: {
    priority: 130,
    parse: function(string, token, match2, _options) {
      var valueCallback = function(year) {
        return {
          year,
          isTwoDigitYear: token === "YY"
        };
      };
      switch (token) {
        case "Y":
          return parseNDigits(4, string, valueCallback);
        case "Yo":
          return match2.ordinalNumber(string, {
            unit: "year",
            valueCallback
          });
        default:
          return parseNDigits(token.length, string, valueCallback);
      }
    },
    validate: function(_date, value, _options) {
      return value.isTwoDigitYear || value.year > 0;
    },
    set: function(date, flags, value, options) {
      var currentYear = getUTCWeekYear(date, options);
      if (value.isTwoDigitYear) {
        var normalizedTwoDigitYear = normalizeTwoDigitYear(value.year, currentYear);
        date.setUTCFullYear(normalizedTwoDigitYear, 0, options.firstWeekContainsDate);
        date.setUTCHours(0, 0, 0, 0);
        return startOfUTCWeek(date, options);
      }
      var year = !("era" in flags) || flags.era === 1 ? value.year : 1 - value.year;
      date.setUTCFullYear(year, 0, options.firstWeekContainsDate);
      date.setUTCHours(0, 0, 0, 0);
      return startOfUTCWeek(date, options);
    },
    incompatibleTokens: ["y", "R", "u", "Q", "q", "M", "L", "I", "d", "D", "i", "t", "T"]
  },
  // ISO week-numbering year
  R: {
    priority: 130,
    parse: function(string, token, _match, _options) {
      if (token === "R") {
        return parseNDigitsSigned(4, string);
      }
      return parseNDigitsSigned(token.length, string);
    },
    set: function(_date, _flags, value, _options) {
      var firstWeekOfYear = /* @__PURE__ */ new Date(0);
      firstWeekOfYear.setUTCFullYear(value, 0, 4);
      firstWeekOfYear.setUTCHours(0, 0, 0, 0);
      return startOfUTCISOWeek(firstWeekOfYear);
    },
    incompatibleTokens: ["G", "y", "Y", "u", "Q", "q", "M", "L", "w", "d", "D", "e", "c", "t", "T"]
  },
  // Extended year
  u: {
    priority: 130,
    parse: function(string, token, _match, _options) {
      if (token === "u") {
        return parseNDigitsSigned(4, string);
      }
      return parseNDigitsSigned(token.length, string);
    },
    set: function(date, _flags, value, _options) {
      date.setUTCFullYear(value, 0, 1);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    },
    incompatibleTokens: ["G", "y", "Y", "R", "w", "I", "i", "e", "c", "t", "T"]
  },
  // Quarter
  Q: {
    priority: 120,
    parse: function(string, token, match2, _options) {
      switch (token) {
        case "Q":
        case "QQ":
          return parseNDigits(token.length, string);
        case "Qo":
          return match2.ordinalNumber(string, {
            unit: "quarter"
          });
        case "QQQ":
          return match2.quarter(string, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.quarter(string, {
            width: "narrow",
            context: "formatting"
          });
        case "QQQQQ":
          return match2.quarter(string, {
            width: "narrow",
            context: "formatting"
          });
        case "QQQQ":
        default:
          return match2.quarter(string, {
            width: "wide",
            context: "formatting"
          }) || match2.quarter(string, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.quarter(string, {
            width: "narrow",
            context: "formatting"
          });
      }
    },
    validate: function(_date, value, _options) {
      return value >= 1 && value <= 4;
    },
    set: function(date, _flags, value, _options) {
      date.setUTCMonth((value - 1) * 3, 1);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    },
    incompatibleTokens: ["Y", "R", "q", "M", "L", "w", "I", "d", "D", "i", "e", "c", "t", "T"]
  },
  // Stand-alone quarter
  q: {
    priority: 120,
    parse: function(string, token, match2, _options) {
      switch (token) {
        case "q":
        case "qq":
          return parseNDigits(token.length, string);
        case "qo":
          return match2.ordinalNumber(string, {
            unit: "quarter"
          });
        case "qqq":
          return match2.quarter(string, {
            width: "abbreviated",
            context: "standalone"
          }) || match2.quarter(string, {
            width: "narrow",
            context: "standalone"
          });
        case "qqqqq":
          return match2.quarter(string, {
            width: "narrow",
            context: "standalone"
          });
        case "qqqq":
        default:
          return match2.quarter(string, {
            width: "wide",
            context: "standalone"
          }) || match2.quarter(string, {
            width: "abbreviated",
            context: "standalone"
          }) || match2.quarter(string, {
            width: "narrow",
            context: "standalone"
          });
      }
    },
    validate: function(_date, value, _options) {
      return value >= 1 && value <= 4;
    },
    set: function(date, _flags, value, _options) {
      date.setUTCMonth((value - 1) * 3, 1);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    },
    incompatibleTokens: ["Y", "R", "Q", "M", "L", "w", "I", "d", "D", "i", "e", "c", "t", "T"]
  },
  // Month
  M: {
    priority: 110,
    parse: function(string, token, match2, _options) {
      var valueCallback = function(value) {
        return value - 1;
      };
      switch (token) {
        case "M":
          return parseNumericPattern(numericPatterns.month, string, valueCallback);
        case "MM":
          return parseNDigits(2, string, valueCallback);
        case "Mo":
          return match2.ordinalNumber(string, {
            unit: "month",
            valueCallback
          });
        case "MMM":
          return match2.month(string, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.month(string, {
            width: "narrow",
            context: "formatting"
          });
        case "MMMMM":
          return match2.month(string, {
            width: "narrow",
            context: "formatting"
          });
        case "MMMM":
        default:
          return match2.month(string, {
            width: "wide",
            context: "formatting"
          }) || match2.month(string, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.month(string, {
            width: "narrow",
            context: "formatting"
          });
      }
    },
    validate: function(_date, value, _options) {
      return value >= 0 && value <= 11;
    },
    set: function(date, _flags, value, _options) {
      date.setUTCMonth(value, 1);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    },
    incompatibleTokens: ["Y", "R", "q", "Q", "L", "w", "I", "D", "i", "e", "c", "t", "T"]
  },
  // Stand-alone month
  L: {
    priority: 110,
    parse: function(string, token, match2, _options) {
      var valueCallback = function(value) {
        return value - 1;
      };
      switch (token) {
        case "L":
          return parseNumericPattern(numericPatterns.month, string, valueCallback);
        case "LL":
          return parseNDigits(2, string, valueCallback);
        case "Lo":
          return match2.ordinalNumber(string, {
            unit: "month",
            valueCallback
          });
        case "LLL":
          return match2.month(string, {
            width: "abbreviated",
            context: "standalone"
          }) || match2.month(string, {
            width: "narrow",
            context: "standalone"
          });
        case "LLLLL":
          return match2.month(string, {
            width: "narrow",
            context: "standalone"
          });
        case "LLLL":
        default:
          return match2.month(string, {
            width: "wide",
            context: "standalone"
          }) || match2.month(string, {
            width: "abbreviated",
            context: "standalone"
          }) || match2.month(string, {
            width: "narrow",
            context: "standalone"
          });
      }
    },
    validate: function(_date, value, _options) {
      return value >= 0 && value <= 11;
    },
    set: function(date, _flags, value, _options) {
      date.setUTCMonth(value, 1);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    },
    incompatibleTokens: ["Y", "R", "q", "Q", "M", "w", "I", "D", "i", "e", "c", "t", "T"]
  },
  // Local week of year
  w: {
    priority: 100,
    parse: function(string, token, match2, _options) {
      switch (token) {
        case "w":
          return parseNumericPattern(numericPatterns.week, string);
        case "wo":
          return match2.ordinalNumber(string, {
            unit: "week"
          });
        default:
          return parseNDigits(token.length, string);
      }
    },
    validate: function(_date, value, _options) {
      return value >= 1 && value <= 53;
    },
    set: function(date, _flags, value, options) {
      return startOfUTCWeek(setUTCWeek(date, value, options), options);
    },
    incompatibleTokens: ["y", "R", "u", "q", "Q", "M", "L", "I", "d", "D", "i", "t", "T"]
  },
  // ISO week of year
  I: {
    priority: 100,
    parse: function(string, token, match2, _options) {
      switch (token) {
        case "I":
          return parseNumericPattern(numericPatterns.week, string);
        case "Io":
          return match2.ordinalNumber(string, {
            unit: "week"
          });
        default:
          return parseNDigits(token.length, string);
      }
    },
    validate: function(_date, value, _options) {
      return value >= 1 && value <= 53;
    },
    set: function(date, _flags, value, options) {
      return startOfUTCISOWeek(setUTCISOWeek(date, value, options), options);
    },
    incompatibleTokens: ["y", "Y", "u", "q", "Q", "M", "L", "w", "d", "D", "e", "c", "t", "T"]
  },
  // Day of the month
  d: {
    priority: 90,
    subPriority: 1,
    parse: function(string, token, match2, _options) {
      switch (token) {
        case "d":
          return parseNumericPattern(numericPatterns.date, string);
        case "do":
          return match2.ordinalNumber(string, {
            unit: "date"
          });
        default:
          return parseNDigits(token.length, string);
      }
    },
    validate: function(date, value, _options) {
      var year = date.getUTCFullYear();
      var isLeapYear2 = isLeapYearIndex(year);
      var month = date.getUTCMonth();
      if (isLeapYear2) {
        return value >= 1 && value <= DAYS_IN_MONTH_LEAP_YEAR[month];
      } else {
        return value >= 1 && value <= DAYS_IN_MONTH[month];
      }
    },
    set: function(date, _flags, value, _options) {
      date.setUTCDate(value);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    },
    incompatibleTokens: ["Y", "R", "q", "Q", "w", "I", "D", "i", "e", "c", "t", "T"]
  },
  // Day of year
  D: {
    priority: 90,
    subPriority: 1,
    parse: function(string, token, match2, _options) {
      switch (token) {
        case "D":
        case "DD":
          return parseNumericPattern(numericPatterns.dayOfYear, string);
        case "Do":
          return match2.ordinalNumber(string, {
            unit: "date"
          });
        default:
          return parseNDigits(token.length, string);
      }
    },
    validate: function(date, value, _options) {
      var year = date.getUTCFullYear();
      var isLeapYear2 = isLeapYearIndex(year);
      if (isLeapYear2) {
        return value >= 1 && value <= 366;
      } else {
        return value >= 1 && value <= 365;
      }
    },
    set: function(date, _flags, value, _options) {
      date.setUTCMonth(0, value);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    },
    incompatibleTokens: ["Y", "R", "q", "Q", "M", "L", "w", "I", "d", "E", "i", "e", "c", "t", "T"]
  },
  // Day of week
  E: {
    priority: 90,
    parse: function(string, token, match2, _options) {
      switch (token) {
        case "E":
        case "EE":
        case "EEE":
          return match2.day(string, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.day(string, {
            width: "short",
            context: "formatting"
          }) || match2.day(string, {
            width: "narrow",
            context: "formatting"
          });
        case "EEEEE":
          return match2.day(string, {
            width: "narrow",
            context: "formatting"
          });
        case "EEEEEE":
          return match2.day(string, {
            width: "short",
            context: "formatting"
          }) || match2.day(string, {
            width: "narrow",
            context: "formatting"
          });
        case "EEEE":
        default:
          return match2.day(string, {
            width: "wide",
            context: "formatting"
          }) || match2.day(string, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.day(string, {
            width: "short",
            context: "formatting"
          }) || match2.day(string, {
            width: "narrow",
            context: "formatting"
          });
      }
    },
    validate: function(_date, value, _options) {
      return value >= 0 && value <= 6;
    },
    set: function(date, _flags, value, options) {
      date = setUTCDay(date, value, options);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    },
    incompatibleTokens: ["D", "i", "e", "c", "t", "T"]
  },
  // Local day of week
  e: {
    priority: 90,
    parse: function(string, token, match2, options) {
      var valueCallback = function(value) {
        var wholeWeekDays = Math.floor((value - 1) / 7) * 7;
        return (value + options.weekStartsOn + 6) % 7 + wholeWeekDays;
      };
      switch (token) {
        case "e":
        case "ee":
          return parseNDigits(token.length, string, valueCallback);
        case "eo":
          return match2.ordinalNumber(string, {
            unit: "day",
            valueCallback
          });
        case "eee":
          return match2.day(string, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.day(string, {
            width: "short",
            context: "formatting"
          }) || match2.day(string, {
            width: "narrow",
            context: "formatting"
          });
        case "eeeee":
          return match2.day(string, {
            width: "narrow",
            context: "formatting"
          });
        case "eeeeee":
          return match2.day(string, {
            width: "short",
            context: "formatting"
          }) || match2.day(string, {
            width: "narrow",
            context: "formatting"
          });
        case "eeee":
        default:
          return match2.day(string, {
            width: "wide",
            context: "formatting"
          }) || match2.day(string, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.day(string, {
            width: "short",
            context: "formatting"
          }) || match2.day(string, {
            width: "narrow",
            context: "formatting"
          });
      }
    },
    validate: function(_date, value, _options) {
      return value >= 0 && value <= 6;
    },
    set: function(date, _flags, value, options) {
      date = setUTCDay(date, value, options);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    },
    incompatibleTokens: ["y", "R", "u", "q", "Q", "M", "L", "I", "d", "D", "E", "i", "c", "t", "T"]
  },
  // Stand-alone local day of week
  c: {
    priority: 90,
    parse: function(string, token, match2, options) {
      var valueCallback = function(value) {
        var wholeWeekDays = Math.floor((value - 1) / 7) * 7;
        return (value + options.weekStartsOn + 6) % 7 + wholeWeekDays;
      };
      switch (token) {
        case "c":
        case "cc":
          return parseNDigits(token.length, string, valueCallback);
        case "co":
          return match2.ordinalNumber(string, {
            unit: "day",
            valueCallback
          });
        case "ccc":
          return match2.day(string, {
            width: "abbreviated",
            context: "standalone"
          }) || match2.day(string, {
            width: "short",
            context: "standalone"
          }) || match2.day(string, {
            width: "narrow",
            context: "standalone"
          });
        case "ccccc":
          return match2.day(string, {
            width: "narrow",
            context: "standalone"
          });
        case "cccccc":
          return match2.day(string, {
            width: "short",
            context: "standalone"
          }) || match2.day(string, {
            width: "narrow",
            context: "standalone"
          });
        case "cccc":
        default:
          return match2.day(string, {
            width: "wide",
            context: "standalone"
          }) || match2.day(string, {
            width: "abbreviated",
            context: "standalone"
          }) || match2.day(string, {
            width: "short",
            context: "standalone"
          }) || match2.day(string, {
            width: "narrow",
            context: "standalone"
          });
      }
    },
    validate: function(_date, value, _options) {
      return value >= 0 && value <= 6;
    },
    set: function(date, _flags, value, options) {
      date = setUTCDay(date, value, options);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    },
    incompatibleTokens: ["y", "R", "u", "q", "Q", "M", "L", "I", "d", "D", "E", "i", "e", "t", "T"]
  },
  // ISO day of week
  i: {
    priority: 90,
    parse: function(string, token, match2, _options) {
      var valueCallback = function(value) {
        if (value === 0) {
          return 7;
        }
        return value;
      };
      switch (token) {
        case "i":
        case "ii":
          return parseNDigits(token.length, string);
        case "io":
          return match2.ordinalNumber(string, {
            unit: "day"
          });
        case "iii":
          return match2.day(string, {
            width: "abbreviated",
            context: "formatting",
            valueCallback
          }) || match2.day(string, {
            width: "short",
            context: "formatting",
            valueCallback
          }) || match2.day(string, {
            width: "narrow",
            context: "formatting",
            valueCallback
          });
        case "iiiii":
          return match2.day(string, {
            width: "narrow",
            context: "formatting",
            valueCallback
          });
        case "iiiiii":
          return match2.day(string, {
            width: "short",
            context: "formatting",
            valueCallback
          }) || match2.day(string, {
            width: "narrow",
            context: "formatting",
            valueCallback
          });
        case "iiii":
        default:
          return match2.day(string, {
            width: "wide",
            context: "formatting",
            valueCallback
          }) || match2.day(string, {
            width: "abbreviated",
            context: "formatting",
            valueCallback
          }) || match2.day(string, {
            width: "short",
            context: "formatting",
            valueCallback
          }) || match2.day(string, {
            width: "narrow",
            context: "formatting",
            valueCallback
          });
      }
    },
    validate: function(_date, value, _options) {
      return value >= 1 && value <= 7;
    },
    set: function(date, _flags, value, options) {
      date = setUTCISODay(date, value, options);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    },
    incompatibleTokens: ["y", "Y", "u", "q", "Q", "M", "L", "w", "d", "D", "E", "e", "c", "t", "T"]
  },
  // AM or PM
  a: {
    priority: 80,
    parse: function(string, token, match2, _options) {
      switch (token) {
        case "a":
        case "aa":
        case "aaa":
          return match2.dayPeriod(string, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.dayPeriod(string, {
            width: "narrow",
            context: "formatting"
          });
        case "aaaaa":
          return match2.dayPeriod(string, {
            width: "narrow",
            context: "formatting"
          });
        case "aaaa":
        default:
          return match2.dayPeriod(string, {
            width: "wide",
            context: "formatting"
          }) || match2.dayPeriod(string, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.dayPeriod(string, {
            width: "narrow",
            context: "formatting"
          });
      }
    },
    set: function(date, _flags, value, _options) {
      date.setUTCHours(dayPeriodEnumToHours(value), 0, 0, 0);
      return date;
    },
    incompatibleTokens: ["b", "B", "H", "k", "t", "T"]
  },
  // AM, PM, midnight
  b: {
    priority: 80,
    parse: function(string, token, match2, _options) {
      switch (token) {
        case "b":
        case "bb":
        case "bbb":
          return match2.dayPeriod(string, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.dayPeriod(string, {
            width: "narrow",
            context: "formatting"
          });
        case "bbbbb":
          return match2.dayPeriod(string, {
            width: "narrow",
            context: "formatting"
          });
        case "bbbb":
        default:
          return match2.dayPeriod(string, {
            width: "wide",
            context: "formatting"
          }) || match2.dayPeriod(string, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.dayPeriod(string, {
            width: "narrow",
            context: "formatting"
          });
      }
    },
    set: function(date, _flags, value, _options) {
      date.setUTCHours(dayPeriodEnumToHours(value), 0, 0, 0);
      return date;
    },
    incompatibleTokens: ["a", "B", "H", "k", "t", "T"]
  },
  // in the morning, in the afternoon, in the evening, at night
  B: {
    priority: 80,
    parse: function(string, token, match2, _options) {
      switch (token) {
        case "B":
        case "BB":
        case "BBB":
          return match2.dayPeriod(string, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.dayPeriod(string, {
            width: "narrow",
            context: "formatting"
          });
        case "BBBBB":
          return match2.dayPeriod(string, {
            width: "narrow",
            context: "formatting"
          });
        case "BBBB":
        default:
          return match2.dayPeriod(string, {
            width: "wide",
            context: "formatting"
          }) || match2.dayPeriod(string, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.dayPeriod(string, {
            width: "narrow",
            context: "formatting"
          });
      }
    },
    set: function(date, _flags, value, _options) {
      date.setUTCHours(dayPeriodEnumToHours(value), 0, 0, 0);
      return date;
    },
    incompatibleTokens: ["a", "b", "t", "T"]
  },
  // Hour [1-12]
  h: {
    priority: 70,
    parse: function(string, token, match2, _options) {
      switch (token) {
        case "h":
          return parseNumericPattern(numericPatterns.hour12h, string);
        case "ho":
          return match2.ordinalNumber(string, {
            unit: "hour"
          });
        default:
          return parseNDigits(token.length, string);
      }
    },
    validate: function(_date, value, _options) {
      return value >= 1 && value <= 12;
    },
    set: function(date, _flags, value, _options) {
      var isPM = date.getUTCHours() >= 12;
      if (isPM && value < 12) {
        date.setUTCHours(value + 12, 0, 0, 0);
      } else if (!isPM && value === 12) {
        date.setUTCHours(0, 0, 0, 0);
      } else {
        date.setUTCHours(value, 0, 0, 0);
      }
      return date;
    },
    incompatibleTokens: ["H", "K", "k", "t", "T"]
  },
  // Hour [0-23]
  H: {
    priority: 70,
    parse: function(string, token, match2, _options) {
      switch (token) {
        case "H":
          return parseNumericPattern(numericPatterns.hour23h, string);
        case "Ho":
          return match2.ordinalNumber(string, {
            unit: "hour"
          });
        default:
          return parseNDigits(token.length, string);
      }
    },
    validate: function(_date, value, _options) {
      return value >= 0 && value <= 23;
    },
    set: function(date, _flags, value, _options) {
      date.setUTCHours(value, 0, 0, 0);
      return date;
    },
    incompatibleTokens: ["a", "b", "h", "K", "k", "t", "T"]
  },
  // Hour [0-11]
  K: {
    priority: 70,
    parse: function(string, token, match2, _options) {
      switch (token) {
        case "K":
          return parseNumericPattern(numericPatterns.hour11h, string);
        case "Ko":
          return match2.ordinalNumber(string, {
            unit: "hour"
          });
        default:
          return parseNDigits(token.length, string);
      }
    },
    validate: function(_date, value, _options) {
      return value >= 0 && value <= 11;
    },
    set: function(date, _flags, value, _options) {
      var isPM = date.getUTCHours() >= 12;
      if (isPM && value < 12) {
        date.setUTCHours(value + 12, 0, 0, 0);
      } else {
        date.setUTCHours(value, 0, 0, 0);
      }
      return date;
    },
    incompatibleTokens: ["h", "H", "k", "t", "T"]
  },
  // Hour [1-24]
  k: {
    priority: 70,
    parse: function(string, token, match2, _options) {
      switch (token) {
        case "k":
          return parseNumericPattern(numericPatterns.hour24h, string);
        case "ko":
          return match2.ordinalNumber(string, {
            unit: "hour"
          });
        default:
          return parseNDigits(token.length, string);
      }
    },
    validate: function(_date, value, _options) {
      return value >= 1 && value <= 24;
    },
    set: function(date, _flags, value, _options) {
      var hours = value <= 24 ? value % 24 : value;
      date.setUTCHours(hours, 0, 0, 0);
      return date;
    },
    incompatibleTokens: ["a", "b", "h", "H", "K", "t", "T"]
  },
  // Minute
  m: {
    priority: 60,
    parse: function(string, token, match2, _options) {
      switch (token) {
        case "m":
          return parseNumericPattern(numericPatterns.minute, string);
        case "mo":
          return match2.ordinalNumber(string, {
            unit: "minute"
          });
        default:
          return parseNDigits(token.length, string);
      }
    },
    validate: function(_date, value, _options) {
      return value >= 0 && value <= 59;
    },
    set: function(date, _flags, value, _options) {
      date.setUTCMinutes(value, 0, 0);
      return date;
    },
    incompatibleTokens: ["t", "T"]
  },
  // Second
  s: {
    priority: 50,
    parse: function(string, token, match2, _options) {
      switch (token) {
        case "s":
          return parseNumericPattern(numericPatterns.second, string);
        case "so":
          return match2.ordinalNumber(string, {
            unit: "second"
          });
        default:
          return parseNDigits(token.length, string);
      }
    },
    validate: function(_date, value, _options) {
      return value >= 0 && value <= 59;
    },
    set: function(date, _flags, value, _options) {
      date.setUTCSeconds(value, 0);
      return date;
    },
    incompatibleTokens: ["t", "T"]
  },
  // Fraction of second
  S: {
    priority: 30,
    parse: function(string, token, _match, _options) {
      var valueCallback = function(value) {
        return Math.floor(value * Math.pow(10, -token.length + 3));
      };
      return parseNDigits(token.length, string, valueCallback);
    },
    set: function(date, _flags, value, _options) {
      date.setUTCMilliseconds(value);
      return date;
    },
    incompatibleTokens: ["t", "T"]
  },
  // Timezone (ISO-8601. +00:00 is `'Z'`)
  X: {
    priority: 10,
    parse: function(string, token, _match, _options) {
      switch (token) {
        case "X":
          return parseTimezonePattern(timezonePatterns.basicOptionalMinutes, string);
        case "XX":
          return parseTimezonePattern(timezonePatterns.basic, string);
        case "XXXX":
          return parseTimezonePattern(timezonePatterns.basicOptionalSeconds, string);
        case "XXXXX":
          return parseTimezonePattern(timezonePatterns.extendedOptionalSeconds, string);
        case "XXX":
        default:
          return parseTimezonePattern(timezonePatterns.extended, string);
      }
    },
    set: function(date, flags, value, _options) {
      if (flags.timestampIsSet) {
        return date;
      }
      return new Date(date.getTime() - value);
    },
    incompatibleTokens: ["t", "T", "x"]
  },
  // Timezone (ISO-8601)
  x: {
    priority: 10,
    parse: function(string, token, _match, _options) {
      switch (token) {
        case "x":
          return parseTimezonePattern(timezonePatterns.basicOptionalMinutes, string);
        case "xx":
          return parseTimezonePattern(timezonePatterns.basic, string);
        case "xxxx":
          return parseTimezonePattern(timezonePatterns.basicOptionalSeconds, string);
        case "xxxxx":
          return parseTimezonePattern(timezonePatterns.extendedOptionalSeconds, string);
        case "xxx":
        default:
          return parseTimezonePattern(timezonePatterns.extended, string);
      }
    },
    set: function(date, flags, value, _options) {
      if (flags.timestampIsSet) {
        return date;
      }
      return new Date(date.getTime() - value);
    },
    incompatibleTokens: ["t", "T", "X"]
  },
  // Seconds timestamp
  t: {
    priority: 40,
    parse: function(string, _token, _match, _options) {
      return parseAnyDigitsSigned(string);
    },
    set: function(_date, _flags, value, _options) {
      return [new Date(value * 1e3), {
        timestampIsSet: true
      }];
    },
    incompatibleTokens: "*"
  },
  // Milliseconds timestamp
  T: {
    priority: 20,
    parse: function(string, _token, _match, _options) {
      return parseAnyDigitsSigned(string);
    },
    set: function(_date, _flags, value, _options) {
      return [new Date(value), {
        timestampIsSet: true
      }];
    },
    incompatibleTokens: "*"
  }
};
var parsers_default = parsers;

// node_modules/date-fns/esm/parse/index.js
var TIMEZONE_UNIT_PRIORITY = 10;
var formattingTokensRegExp2 = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g;
var longFormattingTokensRegExp2 = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;
var escapedStringRegExp2 = /^'([^]*?)'?$/;
var doubleQuoteRegExp2 = /''/g;
var notWhitespaceRegExp = /\S/;
var unescapedLatinCharacterRegExp2 = /[a-zA-Z]/;
function parse(dirtyDateString, dirtyFormatString, dirtyReferenceDate, dirtyOptions) {
  requiredArgs(3, arguments);
  var dateString = String(dirtyDateString);
  var formatString = String(dirtyFormatString);
  var options = dirtyOptions || {};
  var locale2 = options.locale || en_US_default;
  if (!locale2.match) {
    throw new RangeError("locale must contain match property");
  }
  var localeFirstWeekContainsDate = locale2.options && locale2.options.firstWeekContainsDate;
  var defaultFirstWeekContainsDate = localeFirstWeekContainsDate == null ? 1 : toInteger(localeFirstWeekContainsDate);
  var firstWeekContainsDate = options.firstWeekContainsDate == null ? defaultFirstWeekContainsDate : toInteger(options.firstWeekContainsDate);
  if (!(firstWeekContainsDate >= 1 && firstWeekContainsDate <= 7)) {
    throw new RangeError("firstWeekContainsDate must be between 1 and 7 inclusively");
  }
  var localeWeekStartsOn = locale2.options && locale2.options.weekStartsOn;
  var defaultWeekStartsOn = localeWeekStartsOn == null ? 0 : toInteger(localeWeekStartsOn);
  var weekStartsOn = options.weekStartsOn == null ? defaultWeekStartsOn : toInteger(options.weekStartsOn);
  if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
    throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
  }
  if (formatString === "") {
    if (dateString === "") {
      return toDate(dirtyReferenceDate);
    } else {
      return /* @__PURE__ */ new Date(NaN);
    }
  }
  var subFnOptions = {
    firstWeekContainsDate,
    weekStartsOn,
    locale: locale2
  };
  var setters = [{
    priority: TIMEZONE_UNIT_PRIORITY,
    subPriority: -1,
    set: dateToSystemTimezone,
    index: 0
  }];
  var i;
  var tokens = formatString.match(longFormattingTokensRegExp2).map(function(substring) {
    var firstCharacter2 = substring[0];
    if (firstCharacter2 === "p" || firstCharacter2 === "P") {
      var longFormatter = longFormatters_default[firstCharacter2];
      return longFormatter(substring, locale2.formatLong, subFnOptions);
    }
    return substring;
  }).join("").match(formattingTokensRegExp2);
  var usedTokens = [];
  for (i = 0; i < tokens.length; i++) {
    var token = tokens[i];
    if (!options.useAdditionalWeekYearTokens && isProtectedWeekYearToken(token)) {
      throwProtectedError(token, formatString, dirtyDateString);
    }
    if (!options.useAdditionalDayOfYearTokens && isProtectedDayOfYearToken(token)) {
      throwProtectedError(token, formatString, dirtyDateString);
    }
    var firstCharacter = token[0];
    var parser = parsers_default[firstCharacter];
    if (parser) {
      var incompatibleTokens = parser.incompatibleTokens;
      if (Array.isArray(incompatibleTokens)) {
        var incompatibleToken = void 0;
        for (var _i = 0; _i < usedTokens.length; _i++) {
          var usedToken = usedTokens[_i].token;
          if (incompatibleTokens.indexOf(usedToken) !== -1 || usedToken === firstCharacter) {
            incompatibleToken = usedTokens[_i];
            break;
          }
        }
        if (incompatibleToken) {
          throw new RangeError("The format string mustn't contain `".concat(incompatibleToken.fullToken, "` and `").concat(token, "` at the same time"));
        }
      } else if (parser.incompatibleTokens === "*" && usedTokens.length) {
        throw new RangeError("The format string mustn't contain `".concat(token, "` and any other token at the same time"));
      }
      usedTokens.push({
        token: firstCharacter,
        fullToken: token
      });
      var parseResult = parser.parse(dateString, token, locale2.match, subFnOptions);
      if (!parseResult) {
        return /* @__PURE__ */ new Date(NaN);
      }
      setters.push({
        priority: parser.priority,
        subPriority: parser.subPriority || 0,
        set: parser.set,
        validate: parser.validate,
        value: parseResult.value,
        index: setters.length
      });
      dateString = parseResult.rest;
    } else {
      if (firstCharacter.match(unescapedLatinCharacterRegExp2)) {
        throw new RangeError("Format string contains an unescaped latin alphabet character `" + firstCharacter + "`");
      }
      if (token === "''") {
        token = "'";
      } else if (firstCharacter === "'") {
        token = cleanEscapedString2(token);
      }
      if (dateString.indexOf(token) === 0) {
        dateString = dateString.slice(token.length);
      } else {
        return /* @__PURE__ */ new Date(NaN);
      }
    }
  }
  if (dateString.length > 0 && notWhitespaceRegExp.test(dateString)) {
    return /* @__PURE__ */ new Date(NaN);
  }
  var uniquePrioritySetters = setters.map(function(setter2) {
    return setter2.priority;
  }).sort(function(a, b) {
    return b - a;
  }).filter(function(priority, index, array) {
    return array.indexOf(priority) === index;
  }).map(function(priority) {
    return setters.filter(function(setter2) {
      return setter2.priority === priority;
    }).sort(function(a, b) {
      return b.subPriority - a.subPriority;
    });
  }).map(function(setterArray) {
    return setterArray[0];
  });
  var date = toDate(dirtyReferenceDate);
  if (isNaN(date)) {
    return /* @__PURE__ */ new Date(NaN);
  }
  var utcDate = subMilliseconds(date, getTimezoneOffsetInMilliseconds(date));
  var flags = {};
  for (i = 0; i < uniquePrioritySetters.length; i++) {
    var setter = uniquePrioritySetters[i];
    if (setter.validate && !setter.validate(utcDate, setter.value, subFnOptions)) {
      return /* @__PURE__ */ new Date(NaN);
    }
    var result = setter.set(utcDate, flags, setter.value, subFnOptions);
    if (result[0]) {
      utcDate = result[0];
      assign(flags, result[1]);
    } else {
      utcDate = result;
    }
  }
  return utcDate;
}
function dateToSystemTimezone(date, flags) {
  if (flags.timestampIsSet) {
    return date;
  }
  var convertedDate = /* @__PURE__ */ new Date(0);
  convertedDate.setFullYear(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  convertedDate.setHours(date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
  return convertedDate;
}
function cleanEscapedString2(input) {
  return input.match(escapedStringRegExp2)[1].replace(doubleQuoteRegExp2, "'");
}

// node_modules/date-fns/esm/isMatch/index.js
function isMatch(dateString, formatString, options) {
  requiredArgs(2, arguments);
  return isValid(parse(dateString, formatString, /* @__PURE__ */ new Date(), options));
}

// node_modules/date-fns/esm/isMonday/index.js
function isMonday(date) {
  requiredArgs(1, arguments);
  return toDate(date).getDay() === 1;
}

// node_modules/date-fns/esm/isPast/index.js
function isPast(dirtyDate) {
  requiredArgs(1, arguments);
  return toDate(dirtyDate).getTime() < Date.now();
}

// node_modules/date-fns/esm/startOfHour/index.js
function startOfHour(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  date.setMinutes(0, 0, 0);
  return date;
}

// node_modules/date-fns/esm/isSameHour/index.js
function isSameHour(dirtyDateLeft, dirtyDateRight) {
  requiredArgs(2, arguments);
  var dateLeftStartOfHour = startOfHour(dirtyDateLeft);
  var dateRightStartOfHour = startOfHour(dirtyDateRight);
  return dateLeftStartOfHour.getTime() === dateRightStartOfHour.getTime();
}

// node_modules/date-fns/esm/isSameWeek/index.js
function isSameWeek(dirtyDateLeft, dirtyDateRight, dirtyOptions) {
  requiredArgs(2, arguments);
  var dateLeftStartOfWeek = startOfWeek(dirtyDateLeft, dirtyOptions);
  var dateRightStartOfWeek = startOfWeek(dirtyDateRight, dirtyOptions);
  return dateLeftStartOfWeek.getTime() === dateRightStartOfWeek.getTime();
}

// node_modules/date-fns/esm/isSameISOWeek/index.js
function isSameISOWeek(dirtyDateLeft, dirtyDateRight) {
  requiredArgs(2, arguments);
  return isSameWeek(dirtyDateLeft, dirtyDateRight, {
    weekStartsOn: 1
  });
}

// node_modules/date-fns/esm/isSameISOWeekYear/index.js
function isSameISOWeekYear(dirtyDateLeft, dirtyDateRight) {
  requiredArgs(2, arguments);
  var dateLeftStartOfYear = startOfISOWeekYear(dirtyDateLeft);
  var dateRightStartOfYear = startOfISOWeekYear(dirtyDateRight);
  return dateLeftStartOfYear.getTime() === dateRightStartOfYear.getTime();
}

// node_modules/date-fns/esm/isSameMinute/index.js
function isSameMinute(dirtyDateLeft, dirtyDateRight) {
  requiredArgs(2, arguments);
  var dateLeftStartOfMinute = startOfMinute(dirtyDateLeft);
  var dateRightStartOfMinute = startOfMinute(dirtyDateRight);
  return dateLeftStartOfMinute.getTime() === dateRightStartOfMinute.getTime();
}

// node_modules/date-fns/esm/isSameMonth/index.js
function isSameMonth(dirtyDateLeft, dirtyDateRight) {
  requiredArgs(2, arguments);
  var dateLeft = toDate(dirtyDateLeft);
  var dateRight = toDate(dirtyDateRight);
  return dateLeft.getFullYear() === dateRight.getFullYear() && dateLeft.getMonth() === dateRight.getMonth();
}

// node_modules/date-fns/esm/isSameQuarter/index.js
function isSameQuarter(dirtyDateLeft, dirtyDateRight) {
  requiredArgs(2, arguments);
  var dateLeftStartOfQuarter = startOfQuarter(dirtyDateLeft);
  var dateRightStartOfQuarter = startOfQuarter(dirtyDateRight);
  return dateLeftStartOfQuarter.getTime() === dateRightStartOfQuarter.getTime();
}

// node_modules/date-fns/esm/startOfSecond/index.js
function startOfSecond(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  date.setMilliseconds(0);
  return date;
}

// node_modules/date-fns/esm/isSameSecond/index.js
function isSameSecond(dirtyDateLeft, dirtyDateRight) {
  requiredArgs(2, arguments);
  var dateLeftStartOfSecond = startOfSecond(dirtyDateLeft);
  var dateRightStartOfSecond = startOfSecond(dirtyDateRight);
  return dateLeftStartOfSecond.getTime() === dateRightStartOfSecond.getTime();
}

// node_modules/date-fns/esm/isSameYear/index.js
function isSameYear(dirtyDateLeft, dirtyDateRight) {
  requiredArgs(2, arguments);
  var dateLeft = toDate(dirtyDateLeft);
  var dateRight = toDate(dirtyDateRight);
  return dateLeft.getFullYear() === dateRight.getFullYear();
}

// node_modules/date-fns/esm/isThisHour/index.js
function isThisHour(dirtyDate) {
  requiredArgs(1, arguments);
  return isSameHour(Date.now(), dirtyDate);
}

// node_modules/date-fns/esm/isThisISOWeek/index.js
function isThisISOWeek(dirtyDate) {
  requiredArgs(1, arguments);
  return isSameISOWeek(dirtyDate, Date.now());
}

// node_modules/date-fns/esm/isThisMinute/index.js
function isThisMinute(dirtyDate) {
  requiredArgs(1, arguments);
  return isSameMinute(Date.now(), dirtyDate);
}

// node_modules/date-fns/esm/isThisMonth/index.js
function isThisMonth(dirtyDate) {
  requiredArgs(1, arguments);
  return isSameMonth(Date.now(), dirtyDate);
}

// node_modules/date-fns/esm/isThisQuarter/index.js
function isThisQuarter(dirtyDate) {
  requiredArgs(1, arguments);
  return isSameQuarter(Date.now(), dirtyDate);
}

// node_modules/date-fns/esm/isThisSecond/index.js
function isThisSecond(dirtyDate) {
  requiredArgs(1, arguments);
  return isSameSecond(Date.now(), dirtyDate);
}

// node_modules/date-fns/esm/isThisWeek/index.js
function isThisWeek(dirtyDate, options) {
  requiredArgs(1, arguments);
  return isSameWeek(dirtyDate, Date.now(), options);
}

// node_modules/date-fns/esm/isThisYear/index.js
function isThisYear(dirtyDate) {
  requiredArgs(1, arguments);
  return isSameYear(dirtyDate, Date.now());
}

// node_modules/date-fns/esm/isThursday/index.js
function isThursday(dirtyDate) {
  requiredArgs(1, arguments);
  return toDate(dirtyDate).getDay() === 4;
}

// node_modules/date-fns/esm/isToday/index.js
function isToday(dirtyDate) {
  requiredArgs(1, arguments);
  return isSameDay(dirtyDate, Date.now());
}

// node_modules/date-fns/esm/isTomorrow/index.js
function isTomorrow(dirtyDate) {
  requiredArgs(1, arguments);
  return isSameDay(dirtyDate, addDays(Date.now(), 1));
}

// node_modules/date-fns/esm/isTuesday/index.js
function isTuesday(dirtyDate) {
  requiredArgs(1, arguments);
  return toDate(dirtyDate).getDay() === 2;
}

// node_modules/date-fns/esm/isWednesday/index.js
function isWednesday(dirtyDate) {
  requiredArgs(1, arguments);
  return toDate(dirtyDate).getDay() === 3;
}

// node_modules/date-fns/esm/isWithinInterval/index.js
function isWithinInterval(dirtyDate, interval) {
  requiredArgs(2, arguments);
  var time = toDate(dirtyDate).getTime();
  var startTime = toDate(interval.start).getTime();
  var endTime = toDate(interval.end).getTime();
  if (!(startTime <= endTime)) {
    throw new RangeError("Invalid interval");
  }
  return time >= startTime && time <= endTime;
}

// node_modules/date-fns/esm/isYesterday/index.js
function isYesterday(dirtyDate) {
  requiredArgs(1, arguments);
  return isSameDay(dirtyDate, subDays(Date.now(), 1));
}

// node_modules/date-fns/esm/lastDayOfDecade/index.js
function lastDayOfDecade(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var year = date.getFullYear();
  var decade = 9 + Math.floor(year / 10) * 10;
  date.setFullYear(decade + 1, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date;
}

// node_modules/date-fns/esm/lastDayOfWeek/index.js
function lastDayOfWeek(dirtyDate, dirtyOptions) {
  requiredArgs(1, arguments);
  var options = dirtyOptions || {};
  var locale2 = options.locale;
  var localeWeekStartsOn = locale2 && locale2.options && locale2.options.weekStartsOn;
  var defaultWeekStartsOn = localeWeekStartsOn == null ? 0 : toInteger(localeWeekStartsOn);
  var weekStartsOn = options.weekStartsOn == null ? defaultWeekStartsOn : toInteger(options.weekStartsOn);
  if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
    throw new RangeError("weekStartsOn must be between 0 and 6");
  }
  var date = toDate(dirtyDate);
  var day = date.getDay();
  var diff = (day < weekStartsOn ? -7 : 0) + 6 - (day - weekStartsOn);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + diff);
  return date;
}

// node_modules/date-fns/esm/lastDayOfISOWeek/index.js
function lastDayOfISOWeek(dirtyDate) {
  requiredArgs(1, arguments);
  return lastDayOfWeek(dirtyDate, {
    weekStartsOn: 1
  });
}

// node_modules/date-fns/esm/lastDayOfISOWeekYear/index.js
function lastDayOfISOWeekYear(dirtyDate) {
  requiredArgs(1, arguments);
  var year = getISOWeekYear(dirtyDate);
  var fourthOfJanuary = /* @__PURE__ */ new Date(0);
  fourthOfJanuary.setFullYear(year + 1, 0, 4);
  fourthOfJanuary.setHours(0, 0, 0, 0);
  var date = startOfISOWeek(fourthOfJanuary);
  date.setDate(date.getDate() - 1);
  return date;
}

// node_modules/date-fns/esm/lastDayOfQuarter/index.js
function lastDayOfQuarter(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var currentMonth = date.getMonth();
  var month = currentMonth - currentMonth % 3 + 3;
  date.setMonth(month, 0);
  date.setHours(0, 0, 0, 0);
  return date;
}

// node_modules/date-fns/esm/lastDayOfYear/index.js
function lastDayOfYear(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var year = date.getFullYear();
  date.setFullYear(year + 1, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date;
}

// node_modules/date-fns/esm/lightFormat/index.js
var formattingTokensRegExp3 = /(\w)\1*|''|'(''|[^'])+('|$)|./g;
var escapedStringRegExp3 = /^'([^]*?)'?$/;
var doubleQuoteRegExp3 = /''/g;
var unescapedLatinCharacterRegExp3 = /[a-zA-Z]/;
function lightFormat(dirtyDate, formatStr) {
  requiredArgs(2, arguments);
  var originalDate = toDate(dirtyDate);
  if (!isValid(originalDate)) {
    throw new RangeError("Invalid time value");
  }
  var timezoneOffset = getTimezoneOffsetInMilliseconds(originalDate);
  var utcDate = subMilliseconds(originalDate, timezoneOffset);
  var tokens = formatStr.match(formattingTokensRegExp3);
  if (!tokens) return "";
  var result = tokens.map(function(substring) {
    if (substring === "''") {
      return "'";
    }
    var firstCharacter = substring[0];
    if (firstCharacter === "'") {
      return cleanEscapedString3(substring);
    }
    var formatter = lightFormatters_default[firstCharacter];
    if (formatter) {
      return formatter(utcDate, substring);
    }
    if (firstCharacter.match(unescapedLatinCharacterRegExp3)) {
      throw new RangeError("Format string contains an unescaped latin alphabet character `" + firstCharacter + "`");
    }
    return substring;
  }).join("");
  return result;
}
function cleanEscapedString3(input) {
  var matches = input.match(escapedStringRegExp3);
  if (!matches) {
    return input;
  }
  return matches[1].replace(doubleQuoteRegExp3, "'");
}

// node_modules/date-fns/esm/milliseconds/index.js
var daysInYear = 365.2425;
function milliseconds(_ref) {
  var years = _ref.years, months2 = _ref.months, weeks = _ref.weeks, days2 = _ref.days, hours = _ref.hours, minutes = _ref.minutes, seconds = _ref.seconds;
  requiredArgs(1, arguments);
  var totalDays = 0;
  if (years) totalDays += years * daysInYear;
  if (months2) totalDays += months2 * (daysInYear / 12);
  if (weeks) totalDays += weeks * 7;
  if (days2) totalDays += days2;
  var totalSeconds = totalDays * 24 * 60 * 60;
  if (hours) totalSeconds += hours * 60 * 60;
  if (minutes) totalSeconds += minutes * 60;
  if (seconds) totalSeconds += seconds;
  return Math.round(totalSeconds * 1e3);
}

// node_modules/date-fns/esm/millisecondsToHours/index.js
function millisecondsToHours(milliseconds2) {
  requiredArgs(1, arguments);
  var hours = milliseconds2 / millisecondsInHour;
  return Math.floor(hours);
}

// node_modules/date-fns/esm/millisecondsToMinutes/index.js
function millisecondsToMinutes(milliseconds2) {
  requiredArgs(1, arguments);
  var minutes = milliseconds2 / millisecondsInMinute;
  return Math.floor(minutes);
}

// node_modules/date-fns/esm/millisecondsToSeconds/index.js
function millisecondsToSeconds(milliseconds2) {
  requiredArgs(1, arguments);
  var seconds = milliseconds2 / millisecondsInSecond;
  return Math.floor(seconds);
}

// node_modules/date-fns/esm/minutesToHours/index.js
function minutesToHours(minutes) {
  requiredArgs(1, arguments);
  var hours = minutes / minutesInHour;
  return Math.floor(hours);
}

// node_modules/date-fns/esm/minutesToMilliseconds/index.js
function minutesToMilliseconds(minutes) {
  requiredArgs(1, arguments);
  return Math.floor(minutes * millisecondsInMinute);
}

// node_modules/date-fns/esm/minutesToSeconds/index.js
function minutesToSeconds(minutes) {
  requiredArgs(1, arguments);
  return Math.floor(minutes * secondsInMinute);
}

// node_modules/date-fns/esm/monthsToQuarters/index.js
function monthsToQuarters(months2) {
  requiredArgs(1, arguments);
  var quarters = months2 / monthsInQuarter;
  return Math.floor(quarters);
}

// node_modules/date-fns/esm/monthsToYears/index.js
function monthsToYears(months2) {
  requiredArgs(1, arguments);
  var years = months2 / monthsInYear;
  return Math.floor(years);
}

// node_modules/date-fns/esm/nextDay/index.js
function nextDay(date, day) {
  requiredArgs(2, arguments);
  var delta = day - getDay(date);
  if (delta <= 0) delta += 7;
  return addDays(date, delta);
}

// node_modules/date-fns/esm/nextFriday/index.js
function nextFriday(date) {
  requiredArgs(1, arguments);
  return nextDay(date, 5);
}

// node_modules/date-fns/esm/nextMonday/index.js
function nextMonday(date) {
  requiredArgs(1, arguments);
  return nextDay(date, 1);
}

// node_modules/date-fns/esm/nextSaturday/index.js
function nextSaturday(date) {
  requiredArgs(1, arguments);
  return nextDay(date, 6);
}

// node_modules/date-fns/esm/nextSunday/index.js
function nextSunday(date) {
  requiredArgs(1, arguments);
  return nextDay(date, 0);
}

// node_modules/date-fns/esm/nextThursday/index.js
function nextThursday(date) {
  requiredArgs(1, arguments);
  return nextDay(date, 4);
}

// node_modules/date-fns/esm/nextTuesday/index.js
function nextTuesday(date) {
  requiredArgs(1, arguments);
  return nextDay(date, 2);
}

// node_modules/date-fns/esm/nextWednesday/index.js
function nextWednesday(date) {
  requiredArgs(1, arguments);
  return nextDay(date, 3);
}

// node_modules/date-fns/esm/parseISO/index.js
function parseISO(argument, dirtyOptions) {
  requiredArgs(1, arguments);
  var options = dirtyOptions || {};
  var additionalDigits = options.additionalDigits == null ? 2 : toInteger(options.additionalDigits);
  if (additionalDigits !== 2 && additionalDigits !== 1 && additionalDigits !== 0) {
    throw new RangeError("additionalDigits must be 0, 1 or 2");
  }
  if (!(typeof argument === "string" || Object.prototype.toString.call(argument) === "[object String]")) {
    return /* @__PURE__ */ new Date(NaN);
  }
  var dateStrings = splitDateString(argument);
  var date;
  if (dateStrings.date) {
    var parseYearResult = parseYear(dateStrings.date, additionalDigits);
    date = parseDate(parseYearResult.restDateString, parseYearResult.year);
  }
  if (!date || isNaN(date.getTime())) {
    return /* @__PURE__ */ new Date(NaN);
  }
  var timestamp = date.getTime();
  var time = 0;
  var offset;
  if (dateStrings.time) {
    time = parseTime(dateStrings.time);
    if (isNaN(time)) {
      return /* @__PURE__ */ new Date(NaN);
    }
  }
  if (dateStrings.timezone) {
    offset = parseTimezone(dateStrings.timezone);
    if (isNaN(offset)) {
      return /* @__PURE__ */ new Date(NaN);
    }
  } else {
    var dirtyDate = new Date(timestamp + time);
    var result = /* @__PURE__ */ new Date(0);
    result.setFullYear(dirtyDate.getUTCFullYear(), dirtyDate.getUTCMonth(), dirtyDate.getUTCDate());
    result.setHours(dirtyDate.getUTCHours(), dirtyDate.getUTCMinutes(), dirtyDate.getUTCSeconds(), dirtyDate.getUTCMilliseconds());
    return result;
  }
  return new Date(timestamp + time + offset);
}
var patterns = {
  dateTimeDelimiter: /[T ]/,
  timeZoneDelimiter: /[Z ]/i,
  timezone: /([Z+-].*)$/
};
var dateRegex = /^-?(?:(\d{3})|(\d{2})(?:-?(\d{2}))?|W(\d{2})(?:-?(\d{1}))?|)$/;
var timeRegex = /^(\d{2}(?:[.,]\d*)?)(?::?(\d{2}(?:[.,]\d*)?))?(?::?(\d{2}(?:[.,]\d*)?))?$/;
var timezoneRegex = /^([+-])(\d{2})(?::?(\d{2}))?$/;
function splitDateString(dateString) {
  var dateStrings = {};
  var array = dateString.split(patterns.dateTimeDelimiter);
  var timeString;
  if (array.length > 2) {
    return dateStrings;
  }
  if (/:/.test(array[0])) {
    timeString = array[0];
  } else {
    dateStrings.date = array[0];
    timeString = array[1];
    if (patterns.timeZoneDelimiter.test(dateStrings.date)) {
      dateStrings.date = dateString.split(patterns.timeZoneDelimiter)[0];
      timeString = dateString.substr(dateStrings.date.length, dateString.length);
    }
  }
  if (timeString) {
    var token = patterns.timezone.exec(timeString);
    if (token) {
      dateStrings.time = timeString.replace(token[1], "");
      dateStrings.timezone = token[1];
    } else {
      dateStrings.time = timeString;
    }
  }
  return dateStrings;
}
function parseYear(dateString, additionalDigits) {
  var regex = new RegExp("^(?:(\\d{4}|[+-]\\d{" + (4 + additionalDigits) + "})|(\\d{2}|[+-]\\d{" + (2 + additionalDigits) + "})$)");
  var captures = dateString.match(regex);
  if (!captures) return {
    year: NaN,
    restDateString: ""
  };
  var year = captures[1] ? parseInt(captures[1]) : null;
  var century = captures[2] ? parseInt(captures[2]) : null;
  return {
    year: century === null ? year : century * 100,
    restDateString: dateString.slice((captures[1] || captures[2]).length)
  };
}
function parseDate(dateString, year) {
  if (year === null) return /* @__PURE__ */ new Date(NaN);
  var captures = dateString.match(dateRegex);
  if (!captures) return /* @__PURE__ */ new Date(NaN);
  var isWeekDate = !!captures[4];
  var dayOfYear = parseDateUnit(captures[1]);
  var month = parseDateUnit(captures[2]) - 1;
  var day = parseDateUnit(captures[3]);
  var week = parseDateUnit(captures[4]);
  var dayOfWeek = parseDateUnit(captures[5]) - 1;
  if (isWeekDate) {
    if (!validateWeekDate(year, week, dayOfWeek)) {
      return /* @__PURE__ */ new Date(NaN);
    }
    return dayOfISOWeekYear(year, week, dayOfWeek);
  } else {
    var date = /* @__PURE__ */ new Date(0);
    if (!validateDate(year, month, day) || !validateDayOfYearDate(year, dayOfYear)) {
      return /* @__PURE__ */ new Date(NaN);
    }
    date.setUTCFullYear(year, month, Math.max(dayOfYear, day));
    return date;
  }
}
function parseDateUnit(value) {
  return value ? parseInt(value) : 1;
}
function parseTime(timeString) {
  var captures = timeString.match(timeRegex);
  if (!captures) return NaN;
  var hours = parseTimeUnit(captures[1]);
  var minutes = parseTimeUnit(captures[2]);
  var seconds = parseTimeUnit(captures[3]);
  if (!validateTime(hours, minutes, seconds)) {
    return NaN;
  }
  return hours * millisecondsInHour + minutes * millisecondsInMinute + seconds * 1e3;
}
function parseTimeUnit(value) {
  return value && parseFloat(value.replace(",", ".")) || 0;
}
function parseTimezone(timezoneString) {
  if (timezoneString === "Z") return 0;
  var captures = timezoneString.match(timezoneRegex);
  if (!captures) return 0;
  var sign = captures[1] === "+" ? -1 : 1;
  var hours = parseInt(captures[2]);
  var minutes = captures[3] && parseInt(captures[3]) || 0;
  if (!validateTimezone(hours, minutes)) {
    return NaN;
  }
  return sign * (hours * millisecondsInHour + minutes * millisecondsInMinute);
}
function dayOfISOWeekYear(isoWeekYear, week, day) {
  var date = /* @__PURE__ */ new Date(0);
  date.setUTCFullYear(isoWeekYear, 0, 4);
  var fourthOfJanuaryDay = date.getUTCDay() || 7;
  var diff = (week - 1) * 7 + day + 1 - fourthOfJanuaryDay;
  date.setUTCDate(date.getUTCDate() + diff);
  return date;
}
var daysInMonths = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
function isLeapYearIndex2(year) {
  return year % 400 === 0 || year % 4 === 0 && year % 100 !== 0;
}
function validateDate(year, month, date) {
  return month >= 0 && month <= 11 && date >= 1 && date <= (daysInMonths[month] || (isLeapYearIndex2(year) ? 29 : 28));
}
function validateDayOfYearDate(year, dayOfYear) {
  return dayOfYear >= 1 && dayOfYear <= (isLeapYearIndex2(year) ? 366 : 365);
}
function validateWeekDate(_year, week, day) {
  return week >= 1 && week <= 53 && day >= 0 && day <= 6;
}
function validateTime(hours, minutes, seconds) {
  if (hours === 24) {
    return minutes === 0 && seconds === 0;
  }
  return seconds >= 0 && seconds < 60 && minutes >= 0 && minutes < 60 && hours >= 0 && hours < 25;
}
function validateTimezone(_hours, minutes) {
  return minutes >= 0 && minutes <= 59;
}

// node_modules/date-fns/esm/parseJSON/index.js
function parseJSON(argument) {
  requiredArgs(1, arguments);
  if (typeof argument === "string") {
    var parts = argument.match(/(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2})(?:\.(\d{0,7}))?(?:Z|(.)(\d{2}):?(\d{2})?)?/);
    if (parts) {
      return new Date(Date.UTC(+parts[1], +parts[2] - 1, +parts[3], +parts[4] - (+parts[9] || 0) * (parts[8] == "-" ? -1 : 1), +parts[5] - (+parts[10] || 0) * (parts[8] == "-" ? -1 : 1), +parts[6], +((parts[7] || "0") + "00").substring(0, 3)));
    }
    return /* @__PURE__ */ new Date(NaN);
  }
  return toDate(argument);
}

// node_modules/date-fns/esm/previousDay/index.js
function previousDay(date, day) {
  requiredArgs(2, arguments);
  var delta = getDay(date) - day;
  if (delta <= 0) delta += 7;
  return subDays(date, delta);
}

// node_modules/date-fns/esm/previousFriday/index.js
function previousFriday(date) {
  requiredArgs(1, arguments);
  return previousDay(date, 5);
}

// node_modules/date-fns/esm/previousMonday/index.js
function previousMonday(date) {
  requiredArgs(1, arguments);
  return previousDay(date, 1);
}

// node_modules/date-fns/esm/previousSaturday/index.js
function previousSaturday(date) {
  requiredArgs(1, arguments);
  return previousDay(date, 6);
}

// node_modules/date-fns/esm/previousSunday/index.js
function previousSunday(date) {
  requiredArgs(1, arguments);
  return previousDay(date, 0);
}

// node_modules/date-fns/esm/previousThursday/index.js
function previousThursday(date) {
  requiredArgs(1, arguments);
  return previousDay(date, 4);
}

// node_modules/date-fns/esm/previousTuesday/index.js
function previousTuesday(date) {
  requiredArgs(1, arguments);
  return previousDay(date, 2);
}

// node_modules/date-fns/esm/previousWednesday/index.js
function previousWednesday(date) {
  requiredArgs(1, arguments);
  return previousDay(date, 3);
}

// node_modules/date-fns/esm/quartersToMonths/index.js
function quartersToMonths(quarters) {
  requiredArgs(1, arguments);
  return Math.floor(quarters * monthsInQuarter);
}

// node_modules/date-fns/esm/quartersToYears/index.js
function quartersToYears(quarters) {
  requiredArgs(1, arguments);
  var years = quarters / quartersInYear;
  return Math.floor(years);
}

// node_modules/date-fns/esm/roundToNearestMinutes/index.js
function roundToNearestMinutes(dirtyDate, options) {
  if (arguments.length < 1) {
    throw new TypeError("1 argument required, but only none provided present");
  }
  var nearestTo = options && "nearestTo" in options ? toInteger(options.nearestTo) : 1;
  if (nearestTo < 1 || nearestTo > 30) {
    throw new RangeError("`options.nearestTo` must be between 1 and 30");
  }
  var date = toDate(dirtyDate);
  var seconds = date.getSeconds();
  var minutes = date.getMinutes() + seconds / 60;
  var roundedMinutes = Math.floor(minutes / nearestTo) * nearestTo;
  var remainderMinutes = minutes % nearestTo;
  var addedMinutes = Math.round(remainderMinutes / nearestTo) * nearestTo;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), roundedMinutes + addedMinutes);
}

// node_modules/date-fns/esm/secondsToHours/index.js
function secondsToHours(seconds) {
  requiredArgs(1, arguments);
  var hours = seconds / secondsInHour;
  return Math.floor(hours);
}

// node_modules/date-fns/esm/secondsToMilliseconds/index.js
function secondsToMilliseconds(seconds) {
  requiredArgs(1, arguments);
  return seconds * millisecondsInSecond;
}

// node_modules/date-fns/esm/secondsToMinutes/index.js
function secondsToMinutes(seconds) {
  requiredArgs(1, arguments);
  var minutes = seconds / secondsInMinute;
  return Math.floor(minutes);
}

// node_modules/date-fns/esm/setMonth/index.js
function setMonth(dirtyDate, dirtyMonth) {
  requiredArgs(2, arguments);
  var date = toDate(dirtyDate);
  var month = toInteger(dirtyMonth);
  var year = date.getFullYear();
  var day = date.getDate();
  var dateWithDesiredMonth = /* @__PURE__ */ new Date(0);
  dateWithDesiredMonth.setFullYear(year, month, 15);
  dateWithDesiredMonth.setHours(0, 0, 0, 0);
  var daysInMonth = getDaysInMonth(dateWithDesiredMonth);
  date.setMonth(month, Math.min(day, daysInMonth));
  return date;
}

// node_modules/date-fns/esm/set/index.js
function set(dirtyDate, values) {
  requiredArgs(2, arguments);
  if (typeof values !== "object" || values === null) {
    throw new RangeError("values parameter must be an object");
  }
  var date = toDate(dirtyDate);
  if (isNaN(date.getTime())) {
    return /* @__PURE__ */ new Date(NaN);
  }
  if (values.year != null) {
    date.setFullYear(values.year);
  }
  if (values.month != null) {
    date = setMonth(date, values.month);
  }
  if (values.date != null) {
    date.setDate(toInteger(values.date));
  }
  if (values.hours != null) {
    date.setHours(toInteger(values.hours));
  }
  if (values.minutes != null) {
    date.setMinutes(toInteger(values.minutes));
  }
  if (values.seconds != null) {
    date.setSeconds(toInteger(values.seconds));
  }
  if (values.milliseconds != null) {
    date.setMilliseconds(toInteger(values.milliseconds));
  }
  return date;
}

// node_modules/date-fns/esm/setDate/index.js
function setDate(dirtyDate, dirtyDayOfMonth) {
  requiredArgs(2, arguments);
  var date = toDate(dirtyDate);
  var dayOfMonth = toInteger(dirtyDayOfMonth);
  date.setDate(dayOfMonth);
  return date;
}

// node_modules/date-fns/esm/setDay/index.js
function setDay(dirtyDate, dirtyDay, dirtyOptions) {
  requiredArgs(2, arguments);
  var options = dirtyOptions || {};
  var locale2 = options.locale;
  var localeWeekStartsOn = locale2 && locale2.options && locale2.options.weekStartsOn;
  var defaultWeekStartsOn = localeWeekStartsOn == null ? 0 : toInteger(localeWeekStartsOn);
  var weekStartsOn = options.weekStartsOn == null ? defaultWeekStartsOn : toInteger(options.weekStartsOn);
  if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
    throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
  }
  var date = toDate(dirtyDate);
  var day = toInteger(dirtyDay);
  var currentDay = date.getDay();
  var remainder = day % 7;
  var dayIndex = (remainder + 7) % 7;
  var delta = 7 - weekStartsOn;
  var diff = day < 0 || day > 6 ? day - (currentDay + delta) % 7 : (dayIndex + delta) % 7 - (currentDay + delta) % 7;
  return addDays(date, diff);
}

// node_modules/date-fns/esm/setDayOfYear/index.js
function setDayOfYear(dirtyDate, dirtyDayOfYear) {
  requiredArgs(2, arguments);
  var date = toDate(dirtyDate);
  var dayOfYear = toInteger(dirtyDayOfYear);
  date.setMonth(0);
  date.setDate(dayOfYear);
  return date;
}

// node_modules/date-fns/esm/setHours/index.js
function setHours(dirtyDate, dirtyHours) {
  requiredArgs(2, arguments);
  var date = toDate(dirtyDate);
  var hours = toInteger(dirtyHours);
  date.setHours(hours);
  return date;
}

// node_modules/date-fns/esm/setISODay/index.js
function setISODay(dirtyDate, dirtyDay) {
  requiredArgs(2, arguments);
  var date = toDate(dirtyDate);
  var day = toInteger(dirtyDay);
  var currentDay = getISODay(date);
  var diff = day - currentDay;
  return addDays(date, diff);
}

// node_modules/date-fns/esm/setISOWeek/index.js
function setISOWeek(dirtyDate, dirtyISOWeek) {
  requiredArgs(2, arguments);
  var date = toDate(dirtyDate);
  var isoWeek = toInteger(dirtyISOWeek);
  var diff = getISOWeek(date) - isoWeek;
  date.setDate(date.getDate() - diff * 7);
  return date;
}

// node_modules/date-fns/esm/setMilliseconds/index.js
function setMilliseconds(dirtyDate, dirtyMilliseconds) {
  requiredArgs(2, arguments);
  var date = toDate(dirtyDate);
  var milliseconds2 = toInteger(dirtyMilliseconds);
  date.setMilliseconds(milliseconds2);
  return date;
}

// node_modules/date-fns/esm/setMinutes/index.js
function setMinutes(dirtyDate, dirtyMinutes) {
  requiredArgs(2, arguments);
  var date = toDate(dirtyDate);
  var minutes = toInteger(dirtyMinutes);
  date.setMinutes(minutes);
  return date;
}

// node_modules/date-fns/esm/setQuarter/index.js
function setQuarter(dirtyDate, dirtyQuarter) {
  requiredArgs(2, arguments);
  var date = toDate(dirtyDate);
  var quarter = toInteger(dirtyQuarter);
  var oldQuarter = Math.floor(date.getMonth() / 3) + 1;
  var diff = quarter - oldQuarter;
  return setMonth(date, date.getMonth() + diff * 3);
}

// node_modules/date-fns/esm/setSeconds/index.js
function setSeconds(dirtyDate, dirtySeconds) {
  requiredArgs(2, arguments);
  var date = toDate(dirtyDate);
  var seconds = toInteger(dirtySeconds);
  date.setSeconds(seconds);
  return date;
}

// node_modules/date-fns/esm/setWeek/index.js
function setWeek(dirtyDate, dirtyWeek, options) {
  requiredArgs(2, arguments);
  var date = toDate(dirtyDate);
  var week = toInteger(dirtyWeek);
  var diff = getWeek(date, options) - week;
  date.setDate(date.getDate() - diff * 7);
  return date;
}

// node_modules/date-fns/esm/setWeekYear/index.js
function setWeekYear(dirtyDate, dirtyWeekYear) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  requiredArgs(2, arguments);
  var locale2 = options.locale;
  var localeFirstWeekContainsDate = locale2 && locale2.options && locale2.options.firstWeekContainsDate;
  var defaultFirstWeekContainsDate = localeFirstWeekContainsDate == null ? 1 : toInteger(localeFirstWeekContainsDate);
  var firstWeekContainsDate = options.firstWeekContainsDate == null ? defaultFirstWeekContainsDate : toInteger(options.firstWeekContainsDate);
  var date = toDate(dirtyDate);
  var weekYear = toInteger(dirtyWeekYear);
  var diff = differenceInCalendarDays(date, startOfWeekYear(date, options));
  var firstWeek = /* @__PURE__ */ new Date(0);
  firstWeek.setFullYear(weekYear, 0, firstWeekContainsDate);
  firstWeek.setHours(0, 0, 0, 0);
  date = startOfWeekYear(firstWeek, options);
  date.setDate(date.getDate() + diff);
  return date;
}

// node_modules/date-fns/esm/setYear/index.js
function setYear(dirtyDate, dirtyYear) {
  requiredArgs(2, arguments);
  var date = toDate(dirtyDate);
  var year = toInteger(dirtyYear);
  if (isNaN(date.getTime())) {
    return /* @__PURE__ */ new Date(NaN);
  }
  date.setFullYear(year);
  return date;
}

// node_modules/date-fns/esm/startOfDecade/index.js
function startOfDecade(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var year = date.getFullYear();
  var decade = Math.floor(year / 10) * 10;
  date.setFullYear(decade, 0, 1);
  date.setHours(0, 0, 0, 0);
  return date;
}

// node_modules/date-fns/esm/startOfToday/index.js
function startOfToday() {
  return startOfDay(Date.now());
}

// node_modules/date-fns/esm/startOfTomorrow/index.js
function startOfTomorrow() {
  var now = /* @__PURE__ */ new Date();
  var year = now.getFullYear();
  var month = now.getMonth();
  var day = now.getDate();
  var date = /* @__PURE__ */ new Date(0);
  date.setFullYear(year, month, day + 1);
  date.setHours(0, 0, 0, 0);
  return date;
}

// node_modules/date-fns/esm/startOfYesterday/index.js
function startOfYesterday() {
  var now = /* @__PURE__ */ new Date();
  var year = now.getFullYear();
  var month = now.getMonth();
  var day = now.getDate();
  var date = /* @__PURE__ */ new Date(0);
  date.setFullYear(year, month, day - 1);
  date.setHours(0, 0, 0, 0);
  return date;
}

// node_modules/date-fns/esm/subBusinessDays/index.js
function subBusinessDays(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var amount = toInteger(dirtyAmount);
  return addBusinessDays(dirtyDate, -amount);
}

// node_modules/date-fns/esm/subHours/index.js
function subHours(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var amount = toInteger(dirtyAmount);
  return addHours(dirtyDate, -amount);
}

// node_modules/date-fns/esm/subMinutes/index.js
function subMinutes(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var amount = toInteger(dirtyAmount);
  return addMinutes(dirtyDate, -amount);
}

// node_modules/date-fns/esm/subQuarters/index.js
function subQuarters(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var amount = toInteger(dirtyAmount);
  return addQuarters(dirtyDate, -amount);
}

// node_modules/date-fns/esm/subSeconds/index.js
function subSeconds(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var amount = toInteger(dirtyAmount);
  return addSeconds(dirtyDate, -amount);
}

// node_modules/date-fns/esm/subWeeks/index.js
function subWeeks(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var amount = toInteger(dirtyAmount);
  return addWeeks(dirtyDate, -amount);
}

// node_modules/date-fns/esm/subYears/index.js
function subYears(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var amount = toInteger(dirtyAmount);
  return addYears(dirtyDate, -amount);
}

// node_modules/date-fns/esm/weeksToDays/index.js
function weeksToDays(weeks) {
  requiredArgs(1, arguments);
  return Math.floor(weeks * daysInWeek);
}

// node_modules/date-fns/esm/yearsToMonths/index.js
function yearsToMonths(years) {
  requiredArgs(1, arguments);
  return Math.floor(years * monthsInYear);
}

// node_modules/date-fns/esm/yearsToQuarters/index.js
function yearsToQuarters(years) {
  requiredArgs(1, arguments);
  return Math.floor(years * quartersInYear);
}

export {
  requiredArgs,
  toDate,
  addDays,
  addMonths,
  add,
  isWeekend,
  isSunday,
  isSaturday,
  addBusinessDays,
  addMilliseconds,
  addHours,
  startOfWeek,
  startOfISOWeek,
  getISOWeekYear,
  startOfISOWeekYear,
  startOfDay,
  differenceInCalendarDays,
  setISOWeekYear,
  addISOWeekYears,
  addMinutes,
  addQuarters,
  addSeconds,
  addWeeks,
  addYears,
  areIntervalsOverlapping,
  max,
  min,
  clamp,
  closestIndexTo,
  closestTo,
  compareAsc,
  compareDesc,
  daysInWeek,
  maxTime,
  millisecondsInMinute,
  millisecondsInHour,
  millisecondsInSecond,
  minTime,
  minutesInHour,
  monthsInQuarter,
  monthsInYear,
  quartersInYear,
  secondsInHour,
  secondsInMinute,
  daysToWeeks,
  isSameDay,
  isDate,
  isValid,
  differenceInBusinessDays,
  differenceInCalendarISOWeekYears,
  differenceInCalendarISOWeeks,
  differenceInCalendarMonths,
  getQuarter,
  differenceInCalendarQuarters,
  differenceInCalendarWeeks,
  differenceInCalendarYears,
  differenceInDays,
  differenceInMilliseconds,
  differenceInHours,
  subISOWeekYears,
  differenceInISOWeekYears,
  differenceInMinutes,
  endOfDay,
  endOfMonth,
  isLastDayOfMonth,
  differenceInMonths,
  differenceInQuarters,
  differenceInSeconds,
  differenceInWeeks,
  differenceInYears,
  eachDayOfInterval,
  eachHourOfInterval,
  startOfMinute,
  eachMinuteOfInterval,
  eachMonthOfInterval,
  startOfQuarter,
  eachQuarterOfInterval,
  eachWeekOfInterval,
  eachWeekendOfInterval,
  startOfMonth,
  eachWeekendOfMonth,
  startOfYear,
  endOfYear,
  eachWeekendOfYear,
  eachYearOfInterval,
  endOfDecade,
  endOfHour,
  endOfWeek,
  endOfISOWeek,
  endOfISOWeekYear,
  endOfMinute,
  endOfQuarter,
  endOfSecond,
  endOfToday,
  endOfTomorrow,
  endOfYesterday,
  formatDistance_default,
  buildFormatLongFn,
  formatRelative_default,
  buildLocalizeFn,
  localize_default,
  buildMatchFn,
  buildMatchPatternFn,
  match_default,
  en_US_default,
  subMilliseconds,
  startOfUTCWeek,
  format,
  formatDistance2 as formatDistance,
  formatDistanceStrict,
  formatDistanceToNow,
  formatDistanceToNowStrict,
  formatDuration,
  formatISO,
  formatISO9075,
  formatISODuration,
  formatRFC3339,
  formatRFC7231,
  formatRelative2 as formatRelative,
  fromUnixTime,
  getDate,
  getDay,
  getDayOfYear,
  getDaysInMonth,
  isLeapYear,
  getDaysInYear,
  getDecade,
  getHours,
  getISODay,
  getISOWeek,
  getISOWeeksInYear,
  getMilliseconds,
  getMinutes,
  getMonth,
  getOverlappingDaysInIntervals,
  getSeconds,
  getTime,
  getUnixTime,
  getWeekYear,
  startOfWeekYear,
  getWeek,
  getWeekOfMonth,
  lastDayOfMonth,
  getWeeksInMonth,
  getYear,
  hoursToMilliseconds,
  hoursToMinutes,
  hoursToSeconds,
  subDays,
  subMonths,
  sub,
  intervalToDuration,
  intlFormat,
  isAfter,
  isBefore,
  isEqual,
  isExists,
  isFirstDayOfMonth,
  isFriday,
  isFuture,
  parse,
  isMatch,
  isMonday,
  isPast,
  startOfHour,
  isSameHour,
  isSameWeek,
  isSameISOWeek,
  isSameISOWeekYear,
  isSameMinute,
  isSameMonth,
  isSameQuarter,
  startOfSecond,
  isSameSecond,
  isSameYear,
  isThisHour,
  isThisISOWeek,
  isThisMinute,
  isThisMonth,
  isThisQuarter,
  isThisSecond,
  isThisWeek,
  isThisYear,
  isThursday,
  isToday,
  isTomorrow,
  isTuesday,
  isWednesday,
  isWithinInterval,
  isYesterday,
  lastDayOfDecade,
  lastDayOfWeek,
  lastDayOfISOWeek,
  lastDayOfISOWeekYear,
  lastDayOfQuarter,
  lastDayOfYear,
  lightFormat,
  milliseconds,
  millisecondsToHours,
  millisecondsToMinutes,
  millisecondsToSeconds,
  minutesToHours,
  minutesToMilliseconds,
  minutesToSeconds,
  monthsToQuarters,
  monthsToYears,
  nextDay,
  nextFriday,
  nextMonday,
  nextSaturday,
  nextSunday,
  nextThursday,
  nextTuesday,
  nextWednesday,
  parseISO,
  parseJSON,
  previousDay,
  previousFriday,
  previousMonday,
  previousSaturday,
  previousSunday,
  previousThursday,
  previousTuesday,
  previousWednesday,
  quartersToMonths,
  quartersToYears,
  roundToNearestMinutes,
  secondsToHours,
  secondsToMilliseconds,
  secondsToMinutes,
  setMonth,
  set,
  setDate,
  setDay,
  setDayOfYear,
  setHours,
  setISODay,
  setISOWeek,
  setMilliseconds,
  setMinutes,
  setQuarter,
  setSeconds,
  setWeek,
  setWeekYear,
  setYear,
  startOfDecade,
  startOfToday,
  startOfTomorrow,
  startOfYesterday,
  subBusinessDays,
  subHours,
  subMinutes,
  subQuarters,
  subSeconds,
  subWeeks,
  subYears,
  weeksToDays,
  yearsToMonths,
  yearsToQuarters
};
//# sourceMappingURL=chunk-WMUSMNBF.js.map
