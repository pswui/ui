import React from "react";
import { twMerge } from "tailwind-merge";

const layoutClasses = {
  default: "",
  centered: "flex items-center justify-center",
};

const Story = React.forwardRef<
  HTMLDivElement,
  {
    layout?: keyof typeof layoutClasses;
    children: React.ReactNode;
    className?: string;
  }
>(({ layout = "default", children, className }, ref) => {
  return (
    <div
      className={twMerge(
        `bg-white dark:bg-black border border-neutral-300 dark:border-neutral-700 rounded-lg w-full p-4 min-h-48 h-auto mt-8 ${layoutClasses[layout]}`,
        className
      )}
      ref={ref}
    >
      {children}
    </div>
  );
});

export { Story };
