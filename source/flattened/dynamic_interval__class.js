const defaultOnError = (err) => {
    console.error("Error inside of DynamicInterval")
    console.error(err.stack)
    console.error(err.message)
}
/**
 * setInterval with dynamic rate
 *
 * @example
 * ```js
 *     let repeater = new DynamicInterval().setRate(200).onInterval(
 *         ()=>console.log("hello")
 *     ).onError(
 *         (err)=>console.error(err)
 *     ).start()
 * 
 *     repeater.setRate(1000)
 *     repeater.stop()
 *
 *     repeater.setAccountForDuration(false) // default is true
 *     // if true then rate is basically rate+durationOfCallback
 * ```
 */
export class DynamicInterval {
    constructor() {
        this.errorCallback = defaultOnError
        this.callback = () => {}
        this.rate = null
        this.accountForDuration = true
        this._id = null
    }
    
    // recurivelty use setTimeout, catch all errors
    async _runCallback() {
        try {
            if (this.accountForDuration) {
                await this.callback()
            } else {
                this.callback().catch(this.errorCallback)
            }
        } catch (err) {
            try {
                await this.errorCallback(err)
            } catch (error) {
                defaultOnError(error)
            }
        }
        this._id = setTimeout(this._runCallback, this.rate)
    }
    
    setRate(rate) {
        this.rate = rate
        return this
    }

    setAccountForDuration(accountForDuration) {
        this.accountForDuration = accountForDuration
        return this
    }

    onError(callback) {
        this.errorCallback = callback
        return this
    }

    onInterval(callback) {
        this.callback = callback
        return this
    }

    stop() {
        clearTimeout(this._id)
        return this
    }

    start({ delay = 0 } = {}) {
        if (!Number.isFinite(this.rate)) {
            throw Error(`DynamicInterval.start() called but no call-rate was set`)
        }
        this._id = setTimeout(this._runCallback, delay)
        return this
    }
}