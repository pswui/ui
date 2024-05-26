import { Button } from "../components/Button";
import {
  TabContent,
  TabList,
  TabProvider,
  TabTrigger,
} from "../components/Tabs";

export default {
  title: "React/Tabs",
  decorators: [
    (Story: any) => <TabProvider defaultName="tab1">{Story()}</TabProvider>,
  ],
  parameters: {
    layout: "centered",
  },
};

export const Default = () => {
  return (
    <>
      <div className="flex flex-col gap-4 w-[500px]">
        <TabList>
          <TabTrigger name="tab1">Tab 1</TabTrigger>
          <TabTrigger name="tab2">Tab 2</TabTrigger>
        </TabList>
        <TabContent name="tab1">
          <div className="rounded-md bg-neutral-700 p-4">Tab 1 Content</div>
        </TabContent>
        <TabContent name="tab2">
          <div className="rounded-md bg-neutral-700 p-4">Tab 2 Content</div>
        </TabContent>
      </div>
    </>
  );
};

export const AsChild = () => {
  return (
    <>
      <div className="flex flex-col gap-4 w-[500px]">
        <TabList>
          <TabTrigger name="tab1" asChild>
            <Button preset="ghost" className="justify-center">
              Tab 1
            </Button>
          </TabTrigger>
          <TabTrigger name="tab2" asChild>
            <Button preset="ghost" className="justify-center">
              Tab 2
            </Button>
          </TabTrigger>
        </TabList>
        <TabContent name="tab1">
          <div className="rounded-md bg-neutral-700 p-4">Tab 1 Content</div>
        </TabContent>
        <TabContent name="tab2">
          <div className="rounded-md bg-neutral-700 p-4">Tab 2 Content</div>
        </TabContent>
      </div>
    </>
  );
};
