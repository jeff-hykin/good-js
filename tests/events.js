#!/usr/bin/env -S deno run --allow-all
import { Event, trigger, everyTime, once } from "../source/events.js"

const testEvent = new Event()

everyTime(testEvent).then(()=>{
    console.log("everyTime is working")
})

once(testEvent).then(()=>{
    console.log("once is working")
})

trigger(testEvent)
trigger(testEvent)
trigger(testEvent)