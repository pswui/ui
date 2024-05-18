# PSW-UI

Shared UI Component Repository.

My goal is to create **fully typesafe**, **highly customizable** component with **minimum complexity**.

## Rules of PSW-UI Development

- **Minimum copy & paste**. Minimize shared utility & runtime dependency, keep shared utility used in all component. Any shared utility that is not used in all components should be in each component file.
- **Simplicity** over **Versatility**. Make it easy to edit, so user can easily add or patch their own code to the component.
- **Hate script.** If you can do that with CSS, just do that with CSS. Why use JS?
- **Stick with the defaults.** Just let others do their customization. And, well, TailwindCSS's default theme is pretty cool.
- **Keep component isolated.** Leave them alone. Don't make one dependent to others.

## Milestones

- Component Implementation
  - [ ] Accordion
  - [ ] Alert
  - [ ] Avatar
  - [ ] Badge
  - [ ] Breadcrumb
  - [x] Button
  - [ ] Calendar
  - [ ] Card
  - [ ] Carousel
  - [ ] Checkbox
  - [ ] Combobox
  - [ ] Command
  - [ ] Context Menu
  - [ ] Data Table
  - [ ] Date Picker
  - [ ] Dialog
  - [ ] Drawer
  - [ ] Dropdown Menu
  - [ ] Form
  - [ ] Hover Card
  - [ ] Input
  - [ ] Input OTP
  - [ ] Label
  - [ ] Menubar
  - [ ] Navigation Menu
  - [ ] Pagination
  - [ ] Popover
  - [ ] Progress
  - [ ] Radio Group
  - [ ] Resizable
  - [ ] Scroll Area
  - [ ] Select
  - [ ] Separator
  - [ ] Sheet
  - [ ] Skeleton
  - [ ] Slider
  - [ ] Sonner
  - [ ] Switch
  - [ ] Table
  - [ ] Tabs
  - [ ] Textarea
  - [ ] Toast
  - [ ] Toggle
  - [ ] Toggle Group
  - [ ] Tooltip
- Library/Framework Support
  - [ ] React
  - [ ] Svelte
- CLI - _I'm not sure about this._
  - [ ] Add

## Building local development environment

```bash
# Corepack - Yarn 4.2.2
corepack enable
corepack install yarn@4.2.2
corepack use yarn@4.2.2

# Install Packages
yarn install

# Run Storybook
yarn workspace react storybook
```
