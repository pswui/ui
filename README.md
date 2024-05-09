# PSW-UI

Shared UI Component Repository.

My goal is to create **fully typesafe**, **highly customizable** component with **minimum complexity**.

## Rules of PSW-UI Development

* Only use **React** or **Svelte**, **TailwindCSS**, **tailwind-merge**, **clsx**, **class-variance-authority** for runtime dependency. In development environment, there's no need to restrict it, right?
* **Simplicity** over **Versatility**. Since it has small dependency and easy to edit, user can always easily add or patch their own code to the component.
* **Hate script.** If you can do that with CSS, just do that with CSS. Why use JS?
* **Love transitions.** Actually _Implementing In-Out Transition_ is much more difficult thing to do in react, especially with DOM manipulation. It really should be in the plan.
* **Stick with defaults.** Just let others do their customization. And, well, TailwindCSS's default theme is pretty cool.

## Milestones

* Component Implementation
  * [ ] Accordion
  * [ ] Alert
  * [ ] Avatar
  * [ ] Badge
  * [ ] Breadcrumb
  * [ ] Button
  * [ ] Calendar
  * [ ] Card
  * [ ] Carousel
  * [ ] Checkbox
  * [ ] Combobox
  * [ ] Command
  * [ ] Context Menu
  * [ ] Data Table
  * [ ] Date Picker
  * [ ] Dialog
  * [ ] Drawer
  * [ ] Dropdown Menu
  * [ ] Form
  * [ ] Hover Card
  * [ ] Input
  * [ ] Input OTP
  * [ ] Label
  * [ ] Menubar
  * [ ] Navigation Menu
  * [ ] Pagination
  * [ ] Popover
  * [ ] Progress
  * [ ] Radio Group
  * [ ] Resizable
  * [ ] Scroll Area
  * [ ] Select
  * [ ] Separator
  * [ ] Sheet
  * [ ] Skeleton
  * [ ] Slider
  * [ ] Sonner
  * [ ] Switch
  * [ ] Table
  * [ ] Tabs
  * [ ] Textarea
  * [ ] Toast
  * [ ] Toggle
  * [ ] Toggle Group
  * [ ] Tooltip
* Library/Framework Support
  * [ ] React
  * [ ] Svelte
* CLI [1]
  * [ ] Add

[1] I'm really not sure about this yet.
