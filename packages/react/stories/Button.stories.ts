import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../components/Button";

const meta: Meta<typeof Button> = {
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: { options: ["default", "ghost"], control: "select" },
    size: { options: ["sm", "md", "lg"], control: "select" },
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
