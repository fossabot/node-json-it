#!/usr/bin/env node
'use strict'
/**
 * @module json-it
 */
const processText = require('./lib/process-text'),
    {defaultOptions} = require('./lib/const')

const commandLineArgs = require('command-line-args'),
    commandLineUsage = require('command-line-usage'),
    packageDescription = require('./package.json').description

const optionDefinitions = [
    {
        name: 'help',
        alias: 'h',
        description: 'Print this usage guide.'
    },
    // {name: 'verbose', alias: 'v', type: Boolean},
    {
        name: 'text',
        type: String,
        multiple: true,
        defaultOption: true,
        description: 'Default option, consume all extra data string provided via pipe or just in cli.'
    },
    {
        name: 'defaultJsonField',
        type: String,
        defaultValue: defaultOptions.defaultJsonField,
        groups: ['json', 'default'],
        description: 'Default output json field name, all unrecognized lines will go there. Default is "'
        + defaultOptions.defaultJsonField
        + '".'
    },
    {
        name: 'sameJsonFieldStrategy',
        type: String,
        defaultValue: defaultOptions.sameJsonFieldStrategy,
        whereDefaultValueSet: ['array'],
        groups: ['json', 'default'],
        description: 'Strategy for same output json field names, all values will go there according to it. Default is "'
            + defaultOptions.sameJsonFieldStrategy
            + '".'
    },
    {
        name: 'sortJsonFields',
        type: String,
        defaultValue: defaultOptions.sortJsonFields,
        whereDefaultValueSet: ['keys', 'values', 'none'],
        groups: ['json', 'default', 'sort'],
        description: 'Default behaviour to sort resulting json. Default is "'
            + defaultOptions.sortJsonFields
            + '".'
    }
]
const sections = [
    {
        header: 'json-it',
        content: packageDescription
    },
    {
        header: 'Options',
        optionList: optionDefinitions
    }
]

const options = commandLineArgs(optionDefinitions)

if (options.hasOwnProperty('help')) {
    const usage = commandLineUsage(sections)
    console.info(usage)
    process.exit()
}

if (options.hasOwnProperty('text') && options.text.length > 0) {
    console.info(processText(options.text.join(' '), options))
    process.exit()
}

var isPipe = false
process.stdin.resume()
process.stdin.setEncoding('utf8')
process.stdin.on('data', (data) => {
    isPipe = true
    if (data) {
        console.info(processText(data, options))
    }
})

process.stdin.on('end', (data) => {
    process.exit()
})

setTimeout(()=>{
    if (!options.hasOwnProperty('text') && process.argv.length === 2 && !isPipe) {
        process.exit()
    }
}, 100)

module.exports = {optionDefinitions, defaultOptions, processText}
