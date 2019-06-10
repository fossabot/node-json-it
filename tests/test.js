const assert = require('assert')

const processText = require('../lib/process-text')

testCases = [
    {
        description: 'one line simple text',
        text: 'just one line',
        expected: {
            default: '{"log":"just one line"}',
            values: '{"log":"just one line"}',
            none: '{"log":"just one line"}'
        }
    },
    {
        description: 'two line simple text',
        text: "first line\n" +
            "second line\n",
        expected: {
            default: '{"log":["first line","second line"]}',
            values: '{"log":["first line","second line"]}',
            none: '{"log":["first line","second line"]}'
        }
    },
    {
        description: 'one line text with colon',
        text: 'just: one line',
        expected: {
            default: '{"just":"one line"}',
            values: '{"just":"one line"}',
            none: '{"just":"one line"}'
        }
    },
    {
        description: 'two lines text with colon',
        text: "first: line1\n" +
            "second: line2\n",
        expected: {
            default: '{"first":"line1","second":"line2"}',
            values: '{"first":"line1","second":"line2"}',
            none: '{"first":"line1","second":"line2"}'
        }
    },
    {
        description: 'three lines text with colon and without',
        text: "first: line1\n" +
            "second line\n" +
            "third: line3",
        expected: {
            default: '{"first":"line1","log":"second line","third":"line3"}',
            values: '{"first":"line1","third":"line3","log":"second line"}',
            none: '{"first":"line1","log":"second line","third":"line3"}'
        }
    },
    {
        description: 'more lines text with colon and without',
        text: "first: line1\n" +
            "second line\n" +
            "third: line3\n" +
            "number four line\n" +
            "last line\n",
        expected: {
            default: '{"first":"line1","log":["second line","number four line","last line"],"third":"line3"}',
            values: '{"first":"line1","third":"line3","log":["second line","number four line","last line"]}',
            none: '{"first":"line1","log":["second line","number four line","last line"],"third":"line3"}'
        }
    },
    {
        description: 'more lines text with colon and without, same values',
        text: "first: value#2\n" +
            "second line\n" +
            "third: value#1\n" +
            "number four line\n" +
            "this is 5: value#3\n" +
            "six: value#3\n" +
            "last line\n",
        expected: {
            default: '{"first":"value#2","log":["second line","number four line","last line"],"six":"value#3","third":"value#1","this is 5":"value#3"}',
            values: '{"log":["second line","number four line","last line"],"third":"value#1","first":"value#2","six":"value#3","this is 5":"value#3"}',
            none: '{"first":"value#2","log":["second line","number four line","last line"],"third":"value#1","this is 5":"value#3","six":"value#3"}'
        }
    },
    {
        description: 'more lines text with colon and without, several colons line',
        text: "first: line1\n" +
            "second line\n" +
            "third: line3: more data\n" +
            "last line here\n",
        expected: {
            default: '{"first":"line1","log":["second line","last line here"],"third":"line3: more data"}',
            values: '{"first":"line1","third":"line3: more data","log":["second line","last line here"]}',
            none: '{"first":"line1","log":["second line","last line here"],"third":"line3: more data"}'
        }
    },
    {
        description: 'more lines text with colon and without, field names as numbers',
        text: "0: value#2\n" +
            "second line\n" +
            "1: value#1\n" +
            "number four line\n" +
            "2: value#3\n" +
            "3: value#3\n" +
            "last line\n",
        expected: {
            default: '{"0":"value#2","1":"value#1","2":"value#3","3":"value#3","log":["second line","number four line","last line"]}',
            values: '{"0":"value#2","1":"value#1","2":"value#3","3":"value#3","log":["second line","number four line","last line"]}',
            none: '{"0":"value#2","1":"value#1","2":"value#3","3":"value#3","log":["second line","number four line","last line"]}'
        }
    },
    {
        description: 'more lines text with colon and without, mixed lines',
        text: "10: value#2\n" +
            "second line\n" +
            "10: value#1\n" +
            "number four line\n" +
            "two: value#3\n" +
            "two: value#3\n" +
            "last line\n",
        expected: {
            default: '{"10":["value#2","value#1"],"log":["second line","number four line","last line"],"two":["value#3","value#3"]}',
            values: '{"10":["value#2","value#1"],"log":["second line","number four line","last line"],"two":["value#3","value#3"]}',
            none: '{"10":["value#2","value#1"],"log":["second line","number four line","last line"],"two":["value#3","value#3"]}'
        }
    },
    {
        description: 'empty lines',
        text: " \n" +
            "\t\n" +
            "\t\t\n" +
            "\t  \t\n" +
            "\n",
        expected: {
            default: '{}',
            values: '{}',
            none: '{}'
        }
    }
]

describe('processText(<default options>)', function () {
    testCases.forEach(function(testCase) {
        it('process text to json, test case: "' + testCase.description + '"', function () {
            const json = processText(testCase.text)
            assert.equal(json, testCase.expected.default);
        })
    })
})

describe('processText(<custom options: values sort json fields>)', function () {
    const customOptions = {
        defaultJsonField: "log",
        sameJsonFieldStrategy: "array",
        sortJsonFields: "values"
    }
    testCases.forEach(function(testCase) {
        it('process text to json, test case: "' + testCase.description + '"', function () {
            const json = processText(testCase.text, customOptions)
            assert.equal(json, testCase.expected.values);
        })
    })
})

describe('processText(<custom options: none sort json fields>)', function () {
    const customOptions = {
        defaultJsonField: "log",
        sameJsonFieldStrategy: "array",
        sortJsonFields: "none"
    }
    testCases.forEach(function(testCase) {
        it('process text to json, test case: "' + testCase.description + '"', function () {
            const json = processText(testCase.text, customOptions)
            assert.equal(json, testCase.expected.none);
        })
    })
})
