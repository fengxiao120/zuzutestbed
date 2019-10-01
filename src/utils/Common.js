import moment from 'moment';

const validateEmail = ( email_address ) => {
    const regex_pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return regex_pattern.test(email_address)
}

const validateNumber = ( number ) => {
    const regex_pattern = /^\d+\.?\d*$/
    return number === '' || regex_pattern.test(number) //Allow blank
}

const validateNumberLimitDecimal = ( number ) => {
    const regex_pattern = /^\d+\.?\d*$/
    const decimal_less_than_2_digits = number.toString().split('.').length < 2 || number.toString().split('.')[1].length <= 2
    return number === '' || (regex_pattern.test(number) && decimal_less_than_2_digits) //Allow blank
}

//function for replacing <, >. / in the output of t function as it encode these characters
const resolveHTML = ( html_str ) => {
    return html_str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#x2F;/g, '/')
} 

const DatePicker = (value) => {
    let returnArr = {};
    const now = moment();

    if (value === 'today') {
        returnArr = {
            selectedDateKey: 'today',
            selectedDateLabel: '(' + now.format('MMM, DD YYYY') + ')',
            value: now.format('MM/DD/YYYY'),
            object: {
                start: new Date(now.format('YYYY-MM-DD')),
                end: new Date(now.format('YYYY-MM-DD'))
            }
        };
    }

    if (value === 'yesterday') {
        const date = moment().subtract(1, "days");

        returnArr = {
            selectedDateKey: 'yesterday',
            selectedDateLabel: '(' + date.format('MMM, DD YYYY') + ')',
            value: date.format('MM/DD/YYYY'),
            object: {
                start: new Date(date.format('YYYY-MM-DD')),
                end: new Date(date.format('YYYY-MM-DD'))
            }
        };
    }

    if (value === 'last_7_days') {
        const date = moment().subtract(7, "days");

        returnArr = {
            selectedDateKey: 'last_7_days',
            selectedDateLabel: date.format('MMM, DD YYYY') + ' to ' + now.format('MMM, DD YYYY'),
            value: date.format('MM/DD/YYYY') + '-' + now.format('MM/DD/YYYY'),
            object: {
                start: new Date(date.format('YYYY-MM-DD')),
                end: new Date(now.format('YYYY-MM-DD'))
            }
        };
    }

    if (value === 'this_week') {
        const date = moment().isoWeekday(7 + ((1) * -7) + 1);

        returnArr = {
            selectedDateKey: 'this_week',
            selectedDateLabel: date.format('MMM, DD YYYY') + ' to ' + now.format('MMM, DD YYYY'),
            value: date.format('MM/DD/YYYY') + '-' + now.format('MM/DD/YYYY'),
            object: {
                start: new Date(date.format('YYYY-MM-DD')),
                end: new Date(now.format('YYYY-MM-DD'))
            }
        };
    }

    if (value === 'last_28_days') {
        const date = moment().subtract(28, "days");

        returnArr = {
            selectedDateKey: 'last_28_days',
            selectedDateLabel: date.format('MMM, DD YYYY') + ' to ' + now.format('MMM, DD YYYY'),
            value: date.format('MM/DD/YYYY') + '-' + now.format('MM/DD/YYYY'),
            object: {
                start: new Date(date.format('YYYY-MM-DD')),
                end: new Date(now.format('YYYY-MM-DD'))
            }
        };
    }

    if (value === 'this_month') {
        const date = moment().startOf("month");

        returnArr = {
            selectedDateKey: 'this_month',
            selectedDateLabel: date.format('MMM, DD YYYY') + ' to ' + now.format('MMM, DD YYYY'),
            value: date.format('MM/DD/YYYY') + '-' + now.format('MM/DD/YYYY'),
            object: {
                start: new Date(date.format('YYYY-MM-DD')),
                end: new Date(now.format('YYYY-MM-DD'))
            }
        };
    }


    if (value === 'last_90_days') {
        const date = moment().subtract(90, "days");

        returnArr = {
            selectedDateKey: 'last_90_days',
            selectedDateLabel: date.format('MMM, DD YYYY') + ' to ' + now.format('MMM, DD YYYY'),
            value: date.format('MM/DD/YYYY') + '-' + now.format('MM/DD/YYYY'),
            object: {
                start: new Date(date.format('YYYY-MM-DD')),
                end: new Date(now.format('YYYY-MM-DD'))
            }
        };
    }


    if (value === 'last_365_days') {
        const date = moment().subtract(365, "days");

        returnArr = {
            selectedDateKey: 'last_365_days',
            selectedDateLabel: date.format('MMM, DD YYYY') + ' to ' + now.format('MMM, DD YYYY'),
            value: date.format('MM/DD/YYYY') + '-' + now.format('MM/DD/YYYY'),
            object: {
                start: new Date(date.format('YYYY-MM-DD')),
                end: new Date(now.format('YYYY-MM-DD'))
            }
        };
    }

    return returnArr;
};

const JsonToUrlParam = (data) => {
    return Object.keys(data).map((k) => {
        return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
    }).join('&');
};

const ColorClassFromReviewRange = (data, ratingValue) => {
    /*
    ratingValue = 1 => Whenever we need to convert out of 5 ratings in 100 ratings
    ratingValue = 2 => Whenever we need to return color class for negative ratings 
    ratingValue = 3 => whenever above both cases required.
     */
  if (ratingValue == 1 || ratingValue == 3) {
    data = (data * 100) / 5;
  }
  if(ratingValue == 3) {
    ratingValue = 2
  }

  let classesStr = null;
  if (data != undefined) {
    if ((ratingValue != 2 && data >= 0 && data <= 59) || (ratingValue == 2 && data >= 85)) {
      return "lessReview";
    }
    else if (data >= 60 && data <= 84) {
      return "normalReview";
    }
    else if ((ratingValue != 2 && data >= 85) || (ratingValue == 2 && data >= 0 && data <= 59)) {
      return "highReview";
    }
    else {
      return classesStr;
    }
  }
  else { return classesStr } 
};

//Error Handling, return error string from error response.
const ReturnErrorStringFromResponse = (response) => {
    if(response && typeof response === 'object') {
        if(response['code'] === 400 || response['code'] === 403 || response['code'] === 502) {
            return "error_msg.internal_server_error";
        }
        else if(response['code'] === 451){
            return "error_msg.very_large_result_seraching"
        }
        else if(response['code'] && response['message']) {
            return response['message']
        }
        else {
            return "error_msg.something_went_wrong"; 
        }
    }
    else {
        return "error_msg.something_went_wrong";
    }
}

var GetterAndSetterForCommonObject = {
    reputationMgmtCommonData: {},
    set setReputationMgmtData(data) {this.reputationMgmtCommonData = data;},
    get getReputationMgmtData() {return this.reputationMgmtCommonData}
};

export {DatePicker, JsonToUrlParam, ColorClassFromReviewRange, ReturnErrorStringFromResponse, GetterAndSetterForCommonObject, validateEmail, validateNumber, validateNumberLimitDecimal, resolveHTML}