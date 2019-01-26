# js-tail-log

> A tail -f like implementation in javascript with included colorizing support


## Installation

Either through forking or by using npm (the recommended way):

```
npm install -g js-tail-log
```

jstail will be installed into your bin path.


## Usage

```
jstail [file][options]
```

## Flags

### color

Deactivates colored output:

```
-c --color
```

### custom config
Pass a custom config [path]:

```
-s --setting <config>
```

### silent
Suppress all errors:

```
-q --quiet
```

### debug mode
Show debug messages:

```
-d --debug
```

### replay
Replay a log file with an optional interval(default 1sec):  

```
-r --replay <interval>
```

## Configuration

jstail can work with different configurations. It can colorize output based on some patterns. When hundreds of log messages appear its hard to see which of them are errors and which are just info messages.

The default configuration is the following:

```json
{
    "initLines": 10,
    "colorNeutral": "\u001b[0m",
    "patterns": [
        {
            "name": "debug",
            "expr": "(DEBUG)",
            "color": "\u001b[35m"
        }, {
            "name": "info",
            "expr": "(INFO)",
            "color": "\u001b[36m"
        }, {
            "name": "warn",
            "expr": "(WARN)",
            "color": "\u001b[33m"
        }, {
            "name": "error",
            "expr": "(ERROR)",
            "color": "\u001b[31m"
        }
    ]
}
```

The expressions are matched as regular expressions and can be as simple as those above.

jstail will look in your homefolder for a file `.jstail` then in your current directory and finally you can also pass a custom configuration with the \-\-setting parameter.

***Configuration order:***

`setting config > current directory config > home config > defaults`

Make sure you’re using a valid json file as configuration or else it will be ignored

## Output

Colored output example:

![output](/doc/output.png)

## Debugging (writer)

Used for testing only. Writes normal-, multiline- or mixed messages into a file

### Usage

```
writer [options][file]
```

### Flags

### interval

Set a custom interval default is 1000ms:  

```
--i, --interval <n>
```

### multiline

Print multilines instead of normal messages:

```
-m, --multiline
```

### random

Print random messages using both normal and multiline messages:

```
-r --random
```

### normal

Print normal messages (used by default):

```
-n --normal
```

## License

MIT License

Copyright (c) 2019 Michael Wiesendanger

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
