const padZero = (amount) => {
    if (amount < 10) {
        return `0${amount-0}`
    } else {
        return amount
    }
}

const isPositiveInt = (value, name) => {
    value-=0
    if (typeof value != 'number' || value <= 0 || value != value) {
        throw Error(`${name}=${value} must be a positive integer`)
    } else {
        return value
    }
}

const createDateArguments = (...args) => {
    let [year, month, day, hour, minute, second, milisecond] = args
    switch (args.length) {
        case 0:
            return []
        case 1:
            return [ isPositiveInt(year,'year'), 0 ]
            break;
        case 2:
            return [ isPositiveInt(year,'year'), isPositiveInt(month,'month')-1 ]
            break;
        case 3:
            return [ isPositiveInt(year,'year'), isPositiveInt(month,'month')-1, isPositiveInt(day,'day') ]
            break;
        case 4:
            return [ isPositiveInt(year,'year'), isPositiveInt(month,'month')-1, isPositiveInt(day,'day'), hour ]
            break;
        case 5:
            return [ isPositiveInt(year,'year'), isPositiveInt(month,'month')-1, isPositiveInt(day,'day'), hour, minute ]
            break;
        case 6:
            return [ isPositiveInt(year,'year'), isPositiveInt(month,'month')-1, isPositiveInt(day,'day'), hour, minute, second ]
            break;
        default:
            return [ isPositiveInt(year,'year'), isPositiveInt(month,'month')-1, isPositiveInt(day,'day'), hour, minute, second, milisecond ]
            break;
    }
}

const inspectSymbol = (eval("typeof require !== 'undefined' && require('util').inspect.custom")) || Symbol.for('inspect')

class DateTimeError extends Error {
    constructor(message) {
        super()
        this.message = message
    }
}

class DateTime extends Date {
    constructor(...args) {
        // no argument
        if (args.length == 0) {
            super()
            this.timeIncluded = true
        } else {
            let dateStringArgument
            let arg = args[0]
            if (args.length > 1) {
                throw Error("The DateTime class only takes one argument.\nIf you want you do DateTime(Year, Month, ...etc) change it to DateTime([ Year, Month,  ...etc ])")
            }
            // assume unix epoch time
            if (typeof arg == 'number') {
                super(isPositiveInt(arg,'DateTime(arg)'))
                this.timeIncluded = true
            } else if (arg instanceof Array) {
                super(...createDateArguments(...arg))
                if (arg.length > 3) {
                    this.timeIncluded = true
                }
            } else if (arg instanceof Date) {
                super(arg.getTime())
                this.timeIncluded = true
            } else if (typeof arg == 'string') {
                arg = arg.trim()
                // formats:
                //     12/31/1999
                //     2011-09-24
                //     2011-09-24T00:00:00
                //     2011-09-24T00:00:00Z
                let format1 = arg.match(/^(\d\d?)\/(\d\d?)\/(\d\d\d\d)$/)
                let format2 = arg.match(/^(\d\d\d\d)-(\d\d?)-(\d\d?)$/)
                let format3 = arg.match(/^(\d\d\d\d)-(\d\d?)-(\d\d?)T(\d\d?):(\d\d?):(\d\d?(?:\.\d+)?)$/)
                let format4 = arg.match(/^(\d\d\d\d)-(\d\d?)-(\d\d?)T(\d\d?):(\d\d?):(\d\d?(?:\.\d+)?)Z$/)
                let format5 = arg.match(/^(\d\d\d\d)-(\d\d?)-(\d\d?)T(\d\d?):(\d\d?):(\d\d?)-(\d\d?):(\d\d?)$/)
                let format6 = arg.match(/^(\d\d\d\d)-(\d\d?)-(\d\d?)T(\d\d?):(\d\d?):(\d\d?)\+(\d\d?):(\d\d?)$/)
                let years, months, days, hours, minutes, seconds, miliseconds
                if (format4) {
                    // this makes it in UTC time rather than relative to the current time zone
                    super(format4)
                    this.timeIncluded = true
                } else if (format4 || format5) {
                    super(arg)
                    this.timeIncluded = true
                } else if (format3) {
                    years       = format3[1]
                    months      = format3[2]
                    days        = format3[3]
                    hours       = format3[4]
                    minutes     = format3[5]
                    seconds     = format3[6]
                    miliseconds = format3[7]||0
                    super(...createDateArguments(years, months, days, hours, minutes, seconds, miliseconds))
                    this.timeIncluded = true
                } else if (format2) {
                    years       = format2[1]
                    months      = format2[2]
                    days        = format2[3]
                    super(...createDateArguments(years, months, days))
                } else if (format1) {
                    months      = format1[1]
                    days        = format1[2]
                    years       = format1[3]
                    super(...createDateArguments(years, months, days))
                } else {
                    throw new DateTimeError(`Invalid Date format: ${arg}, please use one of: \n    12/31/1999\n    2011-09-24\n    2011-09-24T00:00:00\n    2011-09-24T00:00:00Z`)
                }
            }
        }
    }
    add({days=0, hours=0, minutes=0, seconds=0, miliseconds=0}) {
        // TODO: add year, and month in future
        miliseconds += seconds * 1000
        miliseconds += minutes * 1000 * 60
        miliseconds += hours   * 1000 * 60 * 60
        miliseconds += days    * 1000 * 60 * 60 * 24
        this.unix = this.unix + miliseconds
        return this
    }
    get isInvalid() {
        let time = this.getTime()
        if (time != time) {
            return true
        } else {
            return false
        }
    }
    get utcOffset() {
        if (this.isInvalid) {return null}
        return Math.abs(this.getTimezoneOffset()*60000)
    }
    get millisecond() {
        if (this.isInvalid) {return null}
        return super.getMilliseconds()
    }
    get second() {
        if (this.isInvalid) {return null}
        return super.getSeconds()
    }
    get minute() {
        if (this.isInvalid) {return null}
        return super.toLocaleTimeString("en-US").match(/(\d+):(\d+):(\d+) ([AP]M)/)[2]-0
    }
    get hour() {
        throw Error(`Please use .hour12 or .hour24 instead of .hour`)
    }
    get hour12() {
        if (this.isInvalid) {return null}
        return super.toLocaleTimeString("en-US").match(/(\d+):(\d+):(\d+) ([AP]M)/)[1]-0
    }
    get amPm() {
        if (this.isInvalid) {return null}
        return (this.hour24 >= 12)? 'pm' : 'am'
    }
    get hour24() {
        if (this.isInvalid) {return null}
        let match = super.toLocaleTimeString("en-US").match(/(\d+):(\d+):(\d+) ([AP]M)/)
        return DateTime.convertTime12to24(match[1], match[4])
    }
    get time() {
        if (this.isInvalid) {return null}
        return this.time12
    }
    set time(time) {
        let [hour, minute, second, milisecond] = DateTime.uncheckedParseTimeString(time)
        // ensure valid numbers for: hour, minute, seconds, miliseconds
        DateTime.ensureValidTime([hour, minute, second, milisecond])
        super.setHours(hour, minute, second, milisecond)
        this.timeIncluded = true
    }
    get time12() {
        if (this.isInvalid) {return null}
        // it is pm if hours from 12 onwards
        return `${padZero(this.hour12)}:${padZero(this.minute)}${this.amPm}`
    }
    get time24() {
        if (this.isInvalid) {return null}
        return `${padZero(this.hour24)}:${padZero(this.minute)}`
    }
    get unix() {
        if (this.isInvalid) {return null}
        return super.getTime()
    }
    set unix(value) {
        return super.setTime(value)
    }
    get month() {
        if (this.isInvalid) {return null}
        return super.toLocaleDateString().match(/(\d+)\/\d+\/\d+/)[1]-0
    }
    get monthName() {
        if (this.isInvalid) {return null}
        return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][super.getMonth()]
    }
    get timeOfDayAsSeconds() {
        if (this.isInvalid) {return null}
        return (((this.hour24*60) + this.minute)*60 + this.second)
    }
    get day() {
        if (this.isInvalid) {return null}
        return super.toLocaleDateString().match(/\d+\/(\d+)\/\d+/)[1]-0
    }
    get dayName() {
        if (this.isInvalid) {return null}
        return this.weekDay
    }
    get weekDay() {
        if (this.isInvalid) {return null}
        let weekDay = super.getDay()
        switch (weekDay) {
            case 0: return 'Sunday'
            case 1: return 'Monday'
            case 2: return 'Tuesday'
            case 3: return 'Wednesday'
            case 4: return 'Thursday'
            case 5: return 'Friday'
            case 6: return 'Saturday'
        }
        return weekDay
    }
    get weekDayShort() {
        if (this.isInvalid) {return null}
        let weekDay = super.getDay()
        switch (weekDay) {
            case 0: return 'Sun'
            case 1: return 'Mon'
            case 2: return 'Tue'
            case 3: return 'Wed'
            case 4: return 'Thu'
            case 5: return 'Fri'
            case 6: return 'Sat'
        }
        return weekDay
    }
    get weekIndex() {
        if (this.isInvalid) {return null}
        return super.getDay()
    }
    get year() {
        if (this.isInvalid) {return null}
        return super.toLocaleDateString().match(/\d+\/\d+\/(\d+)/)[1]-0
    }
    get date() {
        if (this.isInvalid) {return null}
        return `${padZero(this.month)}/${padZero(this.day)}/${this.getFullYear()}`
    }
    toArray() {
        if (this.isInvalid) {return null}
        return [this.year, this.month, this.day, this.hour24, this.minute, this.second, this.millisecond ]
    }
    toString() {
        if (this.isInvalid) {return null}
        let date = this.date
        if (this.timeIncluded) {
            date = `${date}, ${this.time}`
        }
        return date
    }
    inspect()                  { return this.toString() }
    [inspectSymbol]()          { return this.toString() }
    valueOf()                  { return this.unix  }
    toPrimitive()              { return this.unix  }
    [Symbol.toPrimitive](hint) { return this.unix  }
}

DateTime.uncheckedParseTimeString = (time) => {
    let match = time.match(/(\d+):(\d+)(.*)/)
    if (match) {
        let hour = match[1]
        let minute = match[2]
        let second = 0
        let milisecond = 0
        let everythingElse = match[3]
        // check for seconds
        let checkForSeconds = everythingElse.match(/:(\d+)(?:\.(\d+))?(.*)/)
        if (checkForSeconds) {
            second = checkForSeconds[1]
            checkForSeconds[2] && (milisecond = checkForSeconds[2]*100)
            everythingElse = checkForSeconds[3]
        }
        // check for am/pm
        let modifierMatch = everythingElse.trim().match(/((?:[aA]|[pP])[mM])/)
        if (modifierMatch) {
            hour = DateTime.convertTime12to24(hour, modifierMatch[1])
        }
        // ensure valid numbers for: hour, minute, seconds, miliseconds
        // convert all to numbers
        hour -= 0
        minute -= 0
        second -= 0
        milisecond -= 0
        return [hour, minute, second, milisecond]
    }
    return null
}

DateTime.ensureValidTime = (input) => {
    let timeArray
    if (typeof input == 'string') {
        timeArray = DateTime.uncheckedParseTimeString(input)
    } else if (input instanceof Array) {
        timeArray = input
    } else {
        throw Error(`Invalid argument for DateTime.ensureValidTime() argument should be a string or an array. Instead it was ${JSON.stringify(input)}`)
    }
    
    let [hour, minute, second, milisecond] = input
    hour -= 0
    minute -= 0
    second -= 0
    milisecond -= 0
    
    if (hour != hour || hour < 0 || hour > 23) {
        throw new DateTimeError(`invalid hour: ${hour}`)
    } else if (minute != minute || minute < 0 || minute > 59) {
        throw new DateTimeError(`invalid minute: ${minute}`)
    } else if (second != second || second < 0 || second > 59) {
        throw new DateTimeError(`invalid second: ${second}`)
    } else if (milisecond != milisecond || milisecond < 0 || milisecond > 999) {
        throw new DateTimeError(`invalid miliseconds: ${milisecond}`)
    }
}

DateTime.isValidTime = (input) => {
    try {
        DateTime.ensureValidTime(input)
        return true
    } catch (error) {
        return false
    }
}

DateTime.convertTime12to24 = (hours, pmOrAm) => {
    if (hours == "12") {
        hours = "00"
    }
    if (pmOrAm.match(/[pP][mM]/)) {
        hours = parseInt(hours, 10) + 12
    }
    return hours-0
}

DateTime.now = () => {
    return new DateTime()
}

export default DateTime