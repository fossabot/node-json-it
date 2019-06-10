'use strict'
/**
 * @module json-it
 */

const {defaultOptions} = require('./const')

class JsonResult extends Object {
    constructor(options) {
        super()
        this.options = options || defaultOptions
        this.fields = {}
    }

    emptyValue() {
        return this.options.sameJsonFieldStrategy === 'array' ? [] : ''
    }

    add(field, value) {
        if (field == null || field === undefined) {
            field = this.options.defaultJsonField
        }

        if (!this.fields.hasOwnProperty(field)) {
            this.fields[field] = value
        } else {
            if (this.options.sameJsonFieldStrategy === 'array') {
                if (typeof this.fields[field] !== 'object') {
                    this.fields[field] = [this.fields[field]]
                }
                this.fields[field].push(value)
            } else {
                this.fields[field] = value
            }
        }
    }

    toString() {
        var str = ''
        switch (this.options.sortJsonFields) {
            case 'none':
                str = JSON.stringify(this.fields)
                break

            case 'keys':
                var ordered = {}
                Object.keys(this.fields).sort().forEach((key) => {
                    ordered[key] = this.fields[key]
                })
                str = JSON.stringify(ordered)
                break

            case 'values':
                var ordered = {},
                    map = []
                Object.keys(this.fields).forEach((k) => {
                    const key = typeof this.fields[k] !== 'object'
                        ? this.fields[k] + '!' + k
                        : k
                    map[key] = {k: k, v: this.fields[k]}
                })

                Object.keys(map).sort().forEach((k) => {
                    ordered[map[k].k] = map[k].v
                })
                str = JSON.stringify(ordered)
                break
        }

        return str
    }
}

const processText = (text, options) => {
    var obj = new JsonResult(options)

    const lines = text.split('\n')
    for (const i in lines) {
        if (lines[i].trim() === '') {
            continue
        }
        const firstDelimPos = lines[i].indexOf(':')
        if (firstDelimPos !== -1) {
            const fieldName = lines[i].substr(0, firstDelimPos).trim(),
                fieldValue = lines[i].substr(firstDelimPos + 1).trim()
            obj.add(fieldName, fieldValue)
        } else {
            obj.add(null, lines[i].trim())
        }
    }

    return obj.toString()
}

module.exports = processText
