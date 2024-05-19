import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../components/Button";

const meta: Meta<typeof Button> = {
  title: "React/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    size: { options: ["sm", "md", "lg"], control: "select" },
    border: { options: ["none", "solid", "outline"], control: "select" },
    background: {
      options: ["default", "ghost", "link"],
      control: "select",
    },
    decoration: { options: ["none", "link"], control: "select" },
    onClick: { table: { disable: true } },
    preset: { options: ["default", "ghost", "link"], control: "select" },
  },
  args: { children: "Button", onClick: () => console.log("clicked") },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    preset: "default",
  },
};

export const Ghost: Story = {
  args: {
    preset: "ghost",
  },
};

export const Outline: Story = {
  args: {
    border: "outline",
    background: "ghost",
    decoration: "none",
    size: "md",
  },
};

export const Link: Story = {
  args: {
    preset: "link",
  },
};
