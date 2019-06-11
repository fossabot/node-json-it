# json-it
This package provides a way to convert plain text to formatted json.

## Install
`npm i @mailoman/json-it`

## Dependencies
Just two packages are in dependencies, both are related to cli:
* command-line-args
* command-line-usage

## NodeJs usage
```javascript
const {processText} = require('json-it')
const obj = processText(
                        "any random\n"+
                        "plain text\n"+
                        "formatted: like this\n"+
                        "for example\n"
)

```
Will give result:
```bash
{"formatted":"like this","log":["any random","plain text","for example"]}

```

## Cli usage
Installing `npm i -g @mailoman/json-it` makes it available via cli `json-it`

Triggering `json-it -h` gives usage text
```bash
json-it

  Nodejs cli/lib package to convert plain text to json 

Options

  -h, --help                       Print this usage guide.                                                       
  --text string[]                  Default option, consume all extra data string provided via pipe or just in    
                                   cli.                                                                          
  --defaultJsonField string        Default output json field name, all unrecognized lines will go there. Default 
                                   is "log".                                                                     
  --sameJsonFieldStrategy string   Strategy for same output json field names, all values will go there according 
                                   to it. Default is "array".                                                    
  --sortJsonFields string          Default behaviour to sort resulting json. Default is "keys".  
```

Two ways of usage:
1. Piping: 
  *  `cat ./text-file.txt | json-it`
  *  `echo "some text here" | json-it`

2. Argument(s):
  * `json-it some text here`
  * `json-it "some text here"`
  * `json-it --text some --text text --text here`       

### Examples
#### example 1
* file ./tests/data/test1.txt contents:
`just one line`
* `cat ./tests/data/test1.txt | json-it`
* result:
`{"log":"just one line"}`

#### example 2
* file ./tests/data/test2.txt contents:
```text
first line
second line
```
* `cat ./tests/data/test11.txt | json-it`
* result:
`{"log":["first line","second line"]}`

#### example 3
* file ./tests/data/test3.txt contents:
```text
just: one line
```
* `cat ./tests/data/test11.txt | json-it`
* result:
`{"just":"one line"}`

#### example 4
* file ./tests/data/test4.txt contents:
```text
first: line1
second: line2
```
* `cat ./tests/data/test11.txt | json-it`
* result:
`{"first":"line1","second":"line2"}`


#### example 5
* file ./tests/data/test5.txt contents:
```text
first: line1
second line
third: line3
```
* `cat ./tests/data/test11.txt | json-it`
* result:
`{"first":"line1","log":"second line","third":"line3"}`

#### example 6
* file ./tests/data/test6.txt contents:
```text
first: line1
second line
third: line3
number four line
last line
```
* `cat ./tests/data/test11.txt | json-it`
* result:
`{"first":"line1","log":["second line","number four line","last line"],"third":"line3"}`

#### example 7
* file ./tests/data/test7.txt contents:
```text
first: value#2
second line
third: value#1
number four line
this is 5: value#3
six: value#3
last line
```
* `cat ./tests/data/test11.txt | json-it`
* result:
`{"first":"value#2","log":["second line","number four line","last line"],"six":"value#3","third":"value#1","this is 5":"value#3"}`

#### example 8
* file ./tests/data/test8.txt contents:
```text
first: line1
second line
third: line3: more data
last line here
```
* `cat ./tests/data/test11.txt | json-it`
* result:
`{"first":"line1","log":["second line","last line here"],"third":"line3: more data"}`

#### example 9
* file ./tests/data/test9.txt contents:
```text
0: value#2
second line
1: value#1
number four line
2: value#3
3: value#3
last line
```
* `cat ./tests/data/test11.txt | json-it`
* result:
`{"0":"value#2","1":"value#1","2":"value#3","3":"value#3","log":["second line","number four line","last line"]}`


#### example 10
* file ./tests/data/test10.txt contents:
```text
10: value#2
second line
10: value#1
number four line
two: value#3
two: value#3
last line
```
* `cat ./tests/data/test10.txt | json-it`
* result:
`{"10":["value#2","value#1"],"log":["second line","number four line","last line"],"two":["value#3","value#3"]}`

#### example 11
* file ./tests/data/test11.txt contents:
```text



```
* `cat ./tests/data/test11.txt | json-it`
* result:
`{}`
