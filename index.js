// if node/serverside
if (typeof document == 'undefined')
    {
    }
// if browswer/clientside
else
    {
        var valueIsObject   = (aValue)=>aValue instanceof Object && !(aValue instanceof Function) && !(aValue instanceof Array)
        var valueIsArray    = (aValue)=>aValue instanceof Array
        var valueIsEmptyish = (aValue)=>
            {
                if ((aValue instanceof Array && aValue.length == 0) || aValue === "" || aValue == null) {
                    return true
                }
                else if (aValue instanceof Object) {
                    return Object.keys(aValue).length == 0
                }
                else {
                    return false
                }
            }
        // 
        // Create a function for viewing any object
        // 
        var objectContainerStyle = {
            boxShadow: "0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2)",
            display: "grid",
            gridTemplateColumns: "min-content min-content",
            padding: "5px",
            marginBottom: "10px",
            borderRadius: "11px",
            width: "min-intrinsic",
        }
        var normalKeyNameStyle = {
            padding: "0px 10px",
            justifySelf: "self-end",
        }
        var objectKeyNameStyle = {
            padding: "0px 10px",
            fontWeight: "bold",
            justifySelf: "self-end",
        }
        var keyValueStyle = {
            justifySelf: "flex-start",
            paddingRight: "5px",
        }
        module.exports.objectAsHtml = (object) => 
            {
                var container = New("div")
                container.classList.add("object-container")
                Object.assign(container.style, objectContainerStyle);
                if (valueIsObject( object) && !valueIsEmptyish(object)) 
                    {
                        var object_names = []
                        for (var each of Object.keys(object))
                            {
                                // check if child is an object or not 
                                if ((valueIsObject(object[each]) || valueIsArray(object[each])) && !valueIsEmptyish(object[each]))
                                    {
                                        object_names.push(each)
                                    }
                                // if not an object, go ahead and add it
                                else
                                    {
                                        var key_name = New("div")
                                        key_name.classList.add("normal-key-name")
                                        Object.assign(key_name.style, normalKeyNameStyle);
                                        key_name.innerText = `${each}: `
                                        container.appendChild(key_name)
                                        container.appendChild(objectAsHtml(object[each]))
                                    }
                            }
                        // now add all the child-objects to the bottom
                        for (var each of object_names)
                            {
                                var key_name = New("div")
                                key_name.classList.add("object-key-name")
                                Object.assign(key_name.style, objectKeyNameStyle);
                                key_name.innerText = `${each}: `
                                container.appendChild(key_name)
                                container.appendChild(objectAsHtml(object[each]))
                            }
                        return container
                    }
                // if array
                else if (valueIsArray( object) && !valueIsEmptyish(object))
                    {
                        for (var each of object)
                            {
                                var key_name = New("div")
                                key_name.classList.add("normal-key-name")
                                Object.assign(key_name.style, normalKeyNameStyle);
                                key_name.innerText = `-`
                                container.appendChild(key_name)
                                container.appendChild(objectAsHtml(each))
                            }
                        return container
                    }
                // if not an object, or if empty
                else
                    {
                        var key_value = New("div")
                        key_value.classList.add("key-value")
                        Object.assign(key_value.style, keyValueStyle);
                        if (valueIsObject(object))
                            {
                                key_value.innerText = `{ }`
                            }
                        else if (valueIsArray(object))
                            {
                                key_value.innerText = `[ ]`
                            }
                        else
                            {
                                key_value.innerText = `${object}`
                            }
                        return key_value
                    }
            }

    }

// 
// 
// Changes to prototypes
// 
// 
//  allow "for(let each of a)" when a is an object
// Object.prototype[Symbol.iterator] = function* () 
//     {
//         for (let each of Object.keys(this))
//             {
//                 yield this[each]
//             }
//     }



// 
// 
// Useful functions
// 
// 
module.exports.log          = console.log
module.exports.valueIs      = (typeOrClass, aValue) => {
        // 
        // Check typeOrClass
        // 
        // see if typeOrClass is actually a class 
        if (typeof typeOrClass == 'function') {
            var aClass = typeOrClass
            typeOrClass = aClass.name
        }
        // lowercase any string-names it
        if (typeof typeOrClass == 'string') {
            typeOrClass = typeOrClass.toLowerCase()
        }

        //
        // Strict Values
        //
        // object (non-null, non-function, non-array)
        if (typeOrClass === "object") {
            return aValue instanceof Object && !(aValue instanceof Function) && !(aValue instanceof Array)
        }
        // undefined
        else if (typeof typeOrClass === 'undefined' || typeOrClass == 'undefined') {
            return typeof aValue === 'undefined'
        }
        // null
        else if (typeOrClass === null || typeOrClass == 'null') {
            return aValue === null
        }
        // NaN
        else if ((typeOrClass !== typeOrClass && typeof typeOrClass == 'number') || typeOrClass == 'nan') {
            return aValue !== aValue && typeof aValue == 'number'
        }
        // false
        else if (typeOrClass === false) {
            return aValue === false
        }
        // true
        else if (typeOrClass === true) {
            return aValue === true
        }
        // bool
        else if (typeOrClass === "bool" || typeOrClass === "boolean") {
            return aValue === true || aValue === false
        }
        // empty string
        else if (typeOrClass === "") {
            return aValue === ""
        }
        // empty list
        else if (typeOrClass === "[]" || Array.isArray(typeOrClass) && typeOrClass.length == 0) {
            return aValue instanceof Array && aValue.length == 0
        }
        // function
        else if (typeOrClass === "function") {
            return typeof aValue == "function"
        }
        // number
        else if (typeOrClass == "number") {
            if (aValue !== aValue) {
                return false
            }
            else {
                return typeof aValue == "number" || aValue instanceof Number
            }
        }
        // string
        else if (typeOrClass == "string") {
            return typeof aValue == "string" || aValue instanceof String
        }
        // array
        else if (typeOrClass == "array") {
            return aValue instanceof Array
        }
        // symbol
        else if (typeOrClass == "symbol") {
            return typeof aValue == "symbol"
        }

        // 
        // Unstrict values
        // 
        // nullish (null, undefined, NaN)
        else if (typeOrClass === 'nullish') {
            return aValue == null || aValue !== aValue
        }
        // emptyish ({},[],"",null,undefined)
        else if (typeOrClass === 'emptyish') {
            if ((aValue instanceof Array && aValue.length == 0) || aValue === "" || aValue == null) {
                return true
            }
            else if (aValue instanceof Object) {
                return Object.keys(aValue).length == 0
            }
            else {
                return false
            }
        }
        // falsey ("0",0,false,null,undefined,NaN)
        else if (typeOrClass === 'falsey' || typeOrClass === 'falsy' || typeOrClass === 'falseish' || typeOrClass === 'falsish') {
            return aValue == null || aValue === false || aValue !== aValue || aValue === 0 || aValue === "0"
        }
        // falsey-or-empty ({},[],"","0",0,false,null,undefined,NaN)
        else if (typeOrClass === 'falsey-or-empty' || typeOrClass === 'falsy-or-empty' || typeOrClass === 'falseish-or-empty' || typeOrClass === 'falsish-or-empty') {
            // empty array
            if (aValue instanceof Array && aValue.length == 0) {
                return true
            }
            // empty object
            else if (aValue instanceof Object) {
                return Object.keys(aValue).length == 0
            }
            else {
                return (aValue ? true : false)
            }
        }
        // numberish 
        else if (typeOrClass == 'numberish') {
            return (aValue != aValue) || !isNaN(aValue - 0)
        }
        // 
        // class type
        // 
        else if (aClass) {
            // if no constructor
            if (aValue === null || aValue === undefined) {
                return false
            }
            else {
                // see if constructors match
                if (aValue.constructor.name === typeOrClass) {
                    return true
                }
                // check instanceof 
                else {
                    return aValue instanceof aClass
                }
            }
        }
        // 
        // failed to recognize
        // 
        else {
            console.error("when you call isValue(), I'm not recoginizing the type or class:", typeOrClass)
        }
    }
module.exports.info         = (value) => {
        var valueIsFalsey = value ? true : false
        var valueEquivFalse = value == false
        var valueEquivNull = value == null
        var valueInstanceObj = value instanceof Object
        var valueMinus0 = value - 0
        console.log(`info about:`, value)
        if (!valueEquivNull) // valueOf
        {
            console.log(`    valueOf()`, value.valueOf())
        }
        console.log(`    type `, typeof value)
        console.log(`    (value instanceof Object)?`, valueInstanceObj)
        if (!valueEquivNull) // constructor.name
        {
            console.log(`    constructor.name`, value.constructor.name)
        }
        console.log(`    (value)?`, valueIsFalsey)
        console.log(`    (value == false)?`, valueEquivFalse)
        console.log(`    (value == null)?`, valueEquivNull)
        console.log(`    (value - 0)`, value - 0)
        if (valueInstanceObj) {
            console.log(`    Object.keys:`)
            for (var each of Object.keys(value)) {
                console.log(`        `, each)
            }
            console.log(`     Object.getOwnPropertyNames`)
            for (var each of Object.getOwnPropertyNames(value)) {
                try {
                    if (value != null && each != null) {
                        var descriptor = Object.getOwnPropertyDescriptor(value, each)
                        console.log(`        `, each, descriptor)
                    }
                }
                catch (e) {

                }

            }
        }

    }
module.exports.get          = (obj, keyList, failValue = null) => {
        // convert string values into lists
        if (typeof keyList == 'string') {
            keyList = keyList.split('.')
        }
        // iterate over nested values
        for (var each of keyList) {
            try { obj = obj[each] } catch (e) { return failValue }
        }
        // if null or undefined return failValue
        if (obj == null) {
            return failValue
        } else {
            return obj
        }
    }
module.exports.set          = function (obj, attributeList, value) {
        // convert string values into lists
        if (typeof attributeList == 'string') {
            attributeList = attributeList.split('.')
        }
        if (attributeList instanceof Array) {
            try {
                var lastAttribute = attributeList.pop()
                for (var elem of attributeList) {
                    // create each parent if it doesnt exist
                    if (!(obj[elem] instanceof Object)) {
                        obj[elem] = {}
                    }
                    // change the object reference be the nested element
                    obj = obj[elem]
                }
                obj[lastAttribute] = value
            } catch (error) {
                console.warn("the set function was unable to set the value for some reason, here is the original error message",error)
                console.warn(`the set obj was:`,obj)
                console.warn(`the set attributeList was:`,attributeList)
                console.warn(`the set value was:`,value)
            }
        } else {
            console.log(`obj is:`,obj)
            console.log(`attributeList is:`,attributeList)
            console.log(`value is:`,value)
            console.error(`There is a 'set' function somewhere being called and its second argument isn't a string or a list (see values above)`);
        }
    }
module.exports.copyFunc     = (someFunction,the_context=this) => (...args) => someFunction.apply(the_context,args)
module.exports.currentTime  = function () { return new Date().getTime() }
module.exports.sleepSyncly  = function (miliseconds)
    {
        var currentTime = new Date().getTime();
        while (currentTime + miliseconds >= new Date().getTime()) {}
    }
module.exports.sleepAsyncly = function (miliseconds)
    {
        return new Promise(resolve => 
            {
                setTimeout(()=>{ resolve(null) }, miliseconds)
            })
    }
module.exports.debounce = (func, wait, immediate) => 
    {
        var timeout
        return () => {
            const context = this, args = arguments
            const later = function() 
                {
                    timeout = null
                    if (!immediate) 
                        {
                            func.apply(context, args)
                        }
                }
            const callNow = immediate && !timeout
            clearTimeout(timeout)
            timeout = setTimeout(later, wait)
            if (callNow) 
                {
                    func.apply(context, args)
                }
        }
    }
module.exports.recursivelyAllAttributesOf = (obj) => 
    {
        // if not an object then add no attributes
        if (!(obj instanceof Object)) 
            {
                return []
            }
        // else check all keys for sub-attributes
        var output = []
        for (let eachKey of Object.keys(obj)) 
            {
                // add the key itself (alone)
                output.push([eachKey])
                // add all of its children
                let newAttributes = recursivelyAllAttributesOf(obj[eachKey])
                // if nested
                for (let eachNewAttributeList of newAttributes) 
                    {
                        // add the parent key
                        eachNewAttributeList.unshift(eachKey)
                        output.push(eachNewAttributeList)
                    }
            }
        return output
    }
// 
// String manipulation
// 
module.exports.snakeToCamelCase = (baseName) => (baseName.toLowerCase().replace(/_/," ")).replace(/.\b\w/g, aChar=>aChar.toUpperCase()).replace(" ","")
module.exports.varnameToTitle = (string) => (string.replace(/_/," ")).replace(/\b\w/g, chr=>chr.toUpperCase())
module.exports.findall     = function (regex_pattern, string_)
    {
        var output_list = [];
        while (true) 
            {
                var a_match = regex_pattern.exec(string_);
                if (a_match) 
                    {
                        // get rid of the string copy
                        delete a_match.input;
                        // store the match data
                        output_list.push(a_match);
                    }
                else
                    {
                        break;
                    }
            } 
        return output_list;
    }
module.exports.capitalize  = function (string)
    {
        return string.replace(/\b\w/g, chr=>chr.toUpperCase())
    }
module.exports.indent      = function (input,the_indent='    ')
    {
        try 
            {
                return the_indent + JSON.stringify(input).replace(/\n/g,"\n"+the_indent)
            }
        catch(e){}
        return the_indent + `${input}`.replace(/\n/g,"\n"+the_indent)
    }
// 
// network
//
module.exports.network = {
        curl: async url=> new Promise(resolve => fetch(url).then(res=>res.text()).then(body=>resolve(body))),
        get: async (url)=> new Promise((resolve, reject) =>
                fetch(url).then(function(response) {
                        return response.json();
                    }).then(function(data) {
                        resolve(data);
                    }).catch(function() {
                        reject()
                    })
                ),
        post: ({data=null, to=null}) => new Promise(
            function (resolve, reject) {
                let the_request = new XMLHttpRequest()
                the_request.onload = function () {
                    if (this.status >= 200 && this.status < 300) {
                        try { var output_ = JSON.parse(the_request.responseText) }
                        catch (error) { var output_ = the_request.responseText }
                        resolve(output_)
                    }
                    else {
                        reject({
                                status: this.status,
                                statusText: the_request.statusText
                            })
                    }
                }
                the_request.onerror = function () {
                    reject({
                            status: this.status,
                            statusText: the_request.statusText
                        })
                }
                the_request.open("POST", to, true)
                the_request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
                the_request.send(JSON.stringify(data))
            }
            ) // end promise
    }
Object.defineProperty(module.exports, "baseUrl", {
    get: function baseUrl() {
        var pathArray = location.href.split( '/' );
        var protocol = pathArray[0];
        var host = pathArray[2];
        var url = protocol + '//' + host;
        return url
    }
});



// 
// global init
//
module.exports.global = _=> 
    {
        for (var each of Object.keys(module.exports)) 
            {
                window[each] = module.exports[each]
            }
        if (!window.baseUrl) {
            Object.defineProperty(window, "baseUrl", {
                get: function baseUrl() {
                    var pathArray = location.href.split( '/' );
                    var protocol = pathArray[0];
                    var host = pathArray[2];
                    var url = protocol + '//' + host;
                    return url
                }
            });
        }
    }