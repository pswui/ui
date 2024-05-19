import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../components/Button";

const meta: Meta<typeof Button> = {
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: ["default", "ghost", "outline", "link"],
      control: "select",
    },
    size: { options: ["sm", "md", "lg"], control: "select" },
    onClick: { table: { disable: true } },
  },
  args: { children: "Button", onClick: () => console.log("clicked") },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    variant: "default",
    size: "md",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    size: "md",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    size: "md",
  },
};

export const Link: Story = {
  args: {
    variant: "link",
    size: "md",
  },
};
