/**
 * Command to get current time and username
 *
 */
export const command = "date '+%H %M %S %p | %a, %d %b, %Y'; whoami";
// the refresh frequency in milliseconds
export const refreshFrequency = 1000;

/**
 * Export language file
 */
import languages from './lang.json';

export const className =
  `
  top: 35%;
  transform: translate(-0%, 0%);
  width: 100%;
  box-sizing: border-box;
  color: #ffffff;
  font-family: "space age", -apple-system, BlinkMacSystemFont, Verdana, "Helvetica Neue", Helvetica, sans-serif;
  font-weight: 600;
  border-radius: 1px;
  text-align: justify;
  line-height: 1.3;
	text-shadow: 0px 0px 2px rgba(0,0,0,0.50);
  
  .container {
    display: flex;
    flex-direction: column;
  }
  .time {
    top: 50%;
    font-size: 30rem;
    font-weight: 400;
    text-align: center;
    margin: calc(30*-70px/18);
    padding: 0px;
    background: transparent;
  }
  .date {
    font-size: 2rem;
    font-weight: 100;
    text-align: center;
    margin: 0;
    background: transparent;
  }
  .flasher-hide {
    opacity: 0;
  }
  .flasher-show {
    opacity: 1;
  }
  .am_pm {
    font-size: 2.625rem;
    margin: 0;
  }
  .greeting {
    font-size: 3rem;
    text-align: center;
    margin-top: 0;
    margin-left: auto;
    margin-right: auto;
  }

  *.unselectable {
    user-select: none;
    cursor: default;
  }
`;

/**
 * Decide if zero should be padded to hour example: 9:30PM => 09:30PM
 */
export const usePadZero = true; // true/false
/**
 * Decide if time separator should flashed
 */
export const flashTimeSeparator = false; // true/false
/**
 * Decide if seconds should be displayed
 */
export const displaySeconds = false; // true/false
/**
 * Decide if 24h time should be converted to military time example: 13:30 => 1:30PM
 */
export const useMilitaryTime = false; // true/false
/**
 * Decide if AM/PM is needed (when mlitary is off)
 */
 export const showAMPM = false; // true/false
/**
 * Enable date in widget
 */
export const showDate = true; // true or false
/**
 * Enable greeting in widget
 */
 export const showGreeting = false; // true or false

/**
 * toLocaleDateString dateStyle option
 */
export const dataFormat = {
  full: 'full', //  Thursday, February 17, 2022
  long: 'long', // February 17, 2022
  medium: 'medium', // Feb 17, 2022
  short: 'short' // 2/17/2022
};

/**
 * 
 * @param {string} dateString A valid date string
 * @param {string} style full, long, medium, short
 * @param {string} lang local language short code e.g en/en-US for american english
 * @returns string
 */
export const setDateStyle = (dateString, style, lang) => {
  return new Date(dateString).toLocaleDateString(lang, { dateStyle: style })
}
/**
 * Apply css class based on flashTimeSeparator value
 * 
 * @param {string|number} seconds The current second
 * @returns {string} css class
 */
export const UseFlashedTimeSeparator = (seconds) => {
  if (flashTimeSeparator) {
    return (seconds % 2 === 0) ? "flasher-show" : "flasher-hide";
  }
  return "flasher-show";
};
/**
 * add/pad zero to hour less than 10
 * 
 * @param {string|number} number The current hour
 * @returns {string|number}
 */
export const padZero = (number) => {
  if (usePadZero && !useMilitaryTime) {
    return (number < 10) ? "0" + number : number;
  }
  return number;
};

/**
 * Translate greeting message to user browser language.
 * 
 * @param {string} processLang The user browser language 2 letter code
 * @param {string|number} time The current time(hour)
 * @returns {string} The translated greet message if not english
 */
export const translate = (processLang, time) => {
  let greeting = "";
  if (processLang === 'en') {
    greeting = "Good Morning";
    if (time >= 12 && time < 17) {
      greeting = "Good Afternoon";
    } else if ((time > 17) || (time < 5)) {
      greeting = "Good Evening";
    }
  } else {
    greeting = languages[processLang][0]["Good morning"];

    if (time >= 12 && time < 17) {
      greeting = languages[processLang][1]["Good afternoon"];
    } else if ((time > 17) || (time < 5)) {
      greeting = languages[processLang][2]["Good evening"];
    }
  }

  return greeting;
};

/**
 * Convert hours to military time
 * 
 * @param {string} hour the current hour.
 * 
 * @return {number|string} The converted hour, if useMilitaryTime is set to true or 24hour time
 */
export const HoursToMilitaryTime = (hour) => {
  if (!useMilitaryTime) {
    let parsedHour = parseInt(hour);

    if (parsedHour > 12) 
      return parsedHour - 12;
    if (parsedHour === 0) 
      return 12;
    return parsedHour;
  }
  return hour;
};
export const render = ({ output }) => {
  // split the whoami & date command output.
  const commandValues = output.split("\n");
  const username = commandValues[1];
  const datetime = commandValues[0].split('|');
  const timeArray = datetime[0].split(' ');

  let hour = timeArray[0];
  const minutes = timeArray[1];
  const seconds = timeArray[2];
  const AM_PM = timeArray[3];

  const userLang = navigator.language || navigator.userLanguage;
  const processLang = userLang.substr(0, 2);
  const greeting = translate(processLang, hour);
  const class_name = UseFlashedTimeSeparator(seconds);

  // change the key (default is b => dateFormat.full) keys are full,long,medium,short
  const date = setDateStyle(datetime[1], dataFormat.full, userLang);

  hour = padZero(HoursToMilitaryTime(hour));

  return (
    <div className="container">
      <div class="unselectable">
        {(showDate) ? <h2 className="date"> {date} </h2> : ""}
        
        <h1 className="time">
          {hour}
          <span className={class_name}>:</span>
          {minutes}
          {(displaySeconds) ? <span className={class_name}>:</span> : ""}
          {(displaySeconds) ? seconds : ""}
          {(useMilitaryTime || !showAMPM) ? "" : <span className="am_pm">{AM_PM}</span>}
        </h1>

        
        {(showGreeting) ? <p className="greeting">
          <span>{greeting}</span>{", "}
          <span className="username">Tyler</span>
        </p> : ""}
      </div>
    </div>
  );
};
