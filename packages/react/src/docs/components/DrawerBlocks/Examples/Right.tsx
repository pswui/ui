import {
  DrawerRoot,
  DrawerTrigger,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerClose,
} from "@components/Drawer";
import { Button } from "@components/Button";

export const Right = () => {
  return (
    <DrawerRoot>
      <DrawerTrigger>
        <Button>Open Drawer</Button>
      </DrawerTrigger>
      <DrawerOverlay className="z-[99]">
        <DrawerContent position="right" className="max-w-[320px]">
          <DrawerHeader>
            <h1 className="text-2xl font-bold">Drawer</h1>
          </DrawerHeader>
          <DrawerBody>
            <p>
              Drawers are a type of overlay that slides in from the edge of the
              screen. They are typically used for navigation or additional
              content.
            </p>
          </DrawerBody>
          <DrawerFooter>
            <DrawerClose>
              <Button>Done</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </DrawerOverlay>
    </DrawerRoot>
  );
};
