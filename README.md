<p align="center">
  <img src="https://raw.githubusercontent.com/pswui/.github/main/Square%20Logo%20Rounded.png" width="200" height="200" />
</p>

<p align="center">
  Meet our beautiful <a href="https://ui.psw.kr">web documentation</a>.
</p>

# PSW-UI

> Build your components in isolation

**There are a lot of component libraries out there, but why it install so many things?**

## Introduction

> Beautifully designed, easily copy & pastable, fully customizable - that means it only depends on few dependencies.

This is **UI kit**, a collection of re-usable components that you can copy and paste into your apps.
This UI kit is inspired by [shadcn/ui](https://ui.shadcn.com/) - but it is more customizable.

**More customizable?**

shadcn/ui depends on a lot of packages to provide functionality to its components.
Radix UI, React DayPicker, Embla Carousel...

I'm not saying it's a bad thing.

But when you depends on a lot of package - you easily mess up your package.json, and you can't even edit a single feature.
The only thing you can customize is **style**.

If there's a bug that needs to be fixed quickly, or a feature that doesn't work the way you want it to,
you'll want to tweak it to your liking. This is where relying on a lot of packages can be poison.

PSW/UI solves this - by **NOT** depending on any other packages than framework like React, TailwindCSS, and tailwind-merge.

You can just copy it, and all functionality is contained in a single file.

## Roadmap

First of all, this project is alpha.

You can see a lot of components are missing, and some component is buggy.

I'm working with this priority:

1. Adding new component, with stable features.
2. Fixing bugs with existing components.
3. Make it looks nice.

Also, there is a [Github README](https://github.com/pswui/ui) for component implementation plans.

You can see what component is implemented, or planned to be implemented.

If you have any ideas or suggestions, please let me know in [Github Issues](https://github.com/pswui/ui/issues).

## Milestones

- Component Implementation
  - [ ] DateTimeInput
  - [x] Input
  - [ ] FileInput
  - [ ] ImageInput
  - [ ] Form
  - [ ] Textarea
  - [ ] Accordion
  - [ ] Alert
  - [ ] Avatar
  - [ ] Badge
  - [ ] Breadcrumb
  - [x] Button
  - [ ] Card
  - [x] Checkbox
  - [ ] Context Menu
  - [ ] Data Table
  - [x] Dialog
  - [x] Drawer
  - [ ] Dropdown Menu
  - [x] Label
  - [ ] Menubar
  - [ ] Navigation Menu
  - [ ] Pagination
  - [x] Popover
  - [ ] Progress
  - [ ] Radio Group
  - [ ] Scroll Area
  - [ ] Select
  - [ ] Separator
  - [ ] Skeleton
  - [ ] Slider
  - [x] Switch
  - [ ] Table
  - [x] Tabs
  - [x] Toast
  - [ ] Toggle
  - [ ] Toggle Group
  - [x] Tooltip
- CLI
  - [x] Add
  - [x] List
  - [x] Search

## Building local development environment

```bash
# Corepack - Yarn 4.2.2
corepack enable

# Install Packages
yarn install

# Script running in workspace
yarn react dev  # `yarn dev` in react workspace
yarn cli build  # `yarn build` in cli workspace
```

## Project Structure

* `registry.json` - for CLI component registry
* `packages/react` - React components
  * `components` - component files & directories
  * `lib` - shared utility used by component
  * `src` - small test area
* `packages/cli` - CLI package using [oclif](https://oclif.io)
  * `src/commands` - command class declaration
  * `src/components` - React component used by CLI via [ink](https://www.npmjs.com/package/ink)
  * `src/helpers` - utility functions that helps CLI
  * `const.ts` - constant & small value builder (like URL) & types & interfaces
  * `public.ts` - will be exported
