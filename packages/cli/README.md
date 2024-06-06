@psw-ui/cli
=================

CLI for PSW/UI


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@psw-ui/cli.svg)](https://npmjs.org/package/@psw-ui/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@psw-ui/cli.svg)](https://npmjs.org/package/@psw-ui/cli)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @psw-ui/cli
$ pswui COMMAND
running command...
$ pswui (--version)
@psw-ui/cli/0.1.0 linux-x64 node-v20.13.1
$ pswui --help [COMMAND]
USAGE
  $ pswui COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`pswui add [NAME]`](#pswui-add-name)
* [`pswui help [COMMAND]`](#pswui-help-command)
* [`pswui list`](#pswui-list)

## `pswui add [NAME]`

Add a component to the project.

```
USAGE
  $ pswui add [NAME] [-f] [-F] [-p <value>] [-s <value>] [-c <value>]

ARGUMENTS
  NAME  name of component to install

FLAGS
  -F, --forceShared         override the existing shared.ts and update it to latest
  -c, --components=<value>  place for installation of components
  -f, --force               override the existing file
  -p, --config=<value>      path to config
  -s, --shared=<value>      place for installation of shared.ts

DESCRIPTION
  Add a component to the project.

EXAMPLES
  $ pswui add
```

_See code: [src/commands/add.ts](https://github.com/p-sw/ui/blob/v0.1.0/src/commands/add.ts)_

## `pswui help [COMMAND]`

Display help for pswui.

```
USAGE
  $ pswui help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for pswui.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.0/src/commands/help.ts)_

## `pswui list`

Prints all available components in registry and components installed in this project.

```
USAGE
  $ pswui list [-u] [-p <value>]

FLAGS
  -p, --config=<value>  path to config
  -u, --url             include component file URL

DESCRIPTION
  Prints all available components in registry and components installed in this project.

EXAMPLES
  $ pswui list
```

_See code: [src/commands/list.ts](https://github.com/p-sw/ui/blob/v0.1.0/src/commands/list.ts)_
<!-- commandsstop -->
