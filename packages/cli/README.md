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
@psw-ui/cli/0.2.0 linux-x64 node-v20.13.1
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
  -c, --components=<value>  place for installation of components
  -f, --force               override the existing file
  -p, --config=<value>      path to config
  -r, --registry=<value>    override registry ur
  -s, --shared=<value>      place for installation of shared.ts

DESCRIPTION
  Add a component to the project.

EXAMPLES
  $ pswui add
```

_See code: [packages/cli/src/commands/add.tsx](https://github.com/pswui/ui/blob/cli@0.4.0/packages/cli/src/commands/add.tsx)_

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
  -r, --registry=<value>  override registry url
  -u, --url             include component file URL

DESCRIPTION
  Prints all available components in registry and components installed in this project.

EXAMPLES
  $ pswui list
```

_See code: [packages/cli/src/commands/list.ts](https://github.com/pswui/ui/blob/cli@0.4.0/packages/cli/src/commands/list.ts)_

## `pswui search`

Search components.

```
Search components.

USAGE
  $ pswui search [QUERY]

ARGUMENTS
  QUERY  search query

FLAGS
  -r, --registry=<value>  override registry url

DESCRIPTION
  Search components.

EXAMPLES
  $ pswui search
```

_See code: [packages/cli/src/commands/search.tsx](https://github.com/pswui/ui/blob/cli@0.4.0/packages/cli/src/commands/search.tsx)_
<!-- commandsstop -->
