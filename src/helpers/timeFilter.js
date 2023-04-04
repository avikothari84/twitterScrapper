const minute = 1000 * 60; // constant for the number of milliseconds in a minute
const hour = minute * 60; // constant for the number of milliseconds in an hour
const day = hour * 24; // constant for the number of milliseconds in a day

// function to convert the data object into an array of date objects
function convertToTimeArray(data){
    let arr = []
    for (var i in data)
    {
        if (i==="filename")
            continue
        // convert the 'created_at' value into a date object and push it to the array
        const date = new Date(data[i]['created_at']);
        arr.push(new Date(date))
    }
    // reverse the array so that the oldest date is first
    arr.reverse()
    return arr
}

function filterDataByWeekDay(dateArray)
{
    var output = {
        "Mon":0,
        "Tue":0,
        "Wed":0,
        "Thu":0,
        "Fri":0,
        "Sat":0,
        "Sun":0,
    }
    for( let i=0 ;i< dateArray.length;i++)
        // increment the value for the day of the week of the current date
        output[dateArray[i].toDateString().split(" ")[0]] += 1;
    return output;
}

// function to count the number of dates in the given array that fall on each day of the month
function filterDataByDay(dateArray)
{
    var output = {}
    for( let i=0 ;i< dateArray.length;i++)
    {
        // slice the month and day from the date string and use it as a key in the output object
        if (output[dateArray[i].toDateString().slice(4)]===undefined)
            output[dateArray[i].toDateString().slice(4)] = 1;
        else
            output[dateArray[i].toDateString().slice(4)] += 1;

    }
    return output;
}

// function to count the number of dates in the given array that fall in each month of the year
function filterDataByMonth(dateArray)
{
    var output = {
        "Jan":0,
        "Feb":0,
        "Mar":0,
        "Apr":0,
        "May":0,
        "Jun":0,
        "Jul":0,
        "Aug":0,
        "Sep":0,
        "Oct":0,
        "Nov":0,
        "Dec":0
    }
    for( let i=0 ;i< dateArray.length;i++)
    {
        // use the month as a key in the output object
        if (output[dateArray[i].toDateString().split(" ")[1]]===undefined)
            output[dateArray[i].toDateString().split(" ")[1]] = 1;// if this is the first date with this month, set the count to 1
        else
            output[dateArray[i].toDateString().split(" ")[1]] += 1;

    }
    return output;
}

// function to count the number of dates in the given array that fall in each year
function filterDataByYear(dateArray)
{
    var output = {}
    for( let i=0 ;i< dateArray.length;i++)
    {
         // use the year as a key in the output object
        if (output[dateArray[i].toDateString().split(" ")[3]]===undefined)
            output[dateArray[i].toDateString().split(" ")[3]] = 1;
        else
            output[dateArray[i].toDateString().split(" ")[3]] += 1;

    }
    return output;
}

// function to format a number of hours in military time (0-23) into AM/PM time
function formatAMPM(hours) {
    var ampm = hours >= 12 ? 'pm' : 'am'; // determine if it is AM or PM
    hours = hours % 12; // convert hours greater than 12 to the equivalent 12-hour time
    hours = hours ? hours : 12; // if hours is 0, set it to 12
    var strTime = hours + ' ' + ampm; // concatenate the hours and AM/PM
    return strTime;
  }

  // function to count the number of dates in the given array that fall in each hour of the day
function filterDataByHour(dateArray)
{
    var output = {}  // empty object to store the counts for each hour
    for( let i=0 ; i< 24; i++)
        // add a key for each hour with a value of 0
        output[formatAMPM(i) + '-' + formatAMPM((i+1)%24)] = 0
    for( let i=0 ; i< dateArray.length; i++)
    {
        let hours = dateArray[i].getHours();
        let time = formatAMPM(hours) + '-' + formatAMPM((hours+1)%24)
        output[time] += 1
    }
    return output;
}

// function to count the number of dates in the given array that fall in each week of the year
function filterDataByWeek(dateArray)
{
    var output = {};
    for (let i = 0; i < dateArray.length ;i++)
    {
        var date = new Date(dateArray[i])
        // set the time to midnight for the current date
        date = new Date(date.toDateString())
        date = date.getTime()
        // calculate the number of days between the current date and the previous Monday
        var offset = ( ( dateArray[i].getDay() - 1 ) + 7 ) % 7;
        var startDate = date - day*offset;
        startDate = new Date(startDate).toDateString();
        // if this week has already been counted, increment the count
        if (startDate in output)
            output[startDate] += 1
        // if this is the first date in this week, set the count to 1
        else
            output[startDate] = 1
    }
    return output;
}

export function filterData(data,type){
    if (!data || data.length ==0 )
        return {}
    const dateArray = convertToTimeArray(data)
    if(type=="year")
        return filterDataByYear(dateArray)
    if(type=="month")
        return filterDataByMonth(dateArray)
    if(type=="date")
        return filterDataByDay(dateArray)
    if(type=="hour")
        return filterDataByHour(dateArray)
    if(type=="weekday")
        return filterDataByWeekDay(dateArray)
    if(type=="week")
        return filterDataByWeek(dateArray)
}


