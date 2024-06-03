import { TabProvider, TabTrigger, TabContent, TabList } from "@components/Tabs";

export function TabsDemo() {
  return (
    <TabProvider defaultName="tab1">
      <TabList>
        <TabTrigger name="tab1">Tab 1</TabTrigger>
        <TabTrigger name="tab2">Tab 2</TabTrigger>
      </TabList>
      <TabContent name="tab1">
        <div className="w-full text-center">Tab 1 Content</div>
      </TabContent>
      <TabContent name="tab2">
        <div className="w-full text-center">Tab 2 Content</div>
      </TabContent>
    </TabProvider>
  );
}
