import { Button } from "../components/Button";
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogRoot,
  DialogSubtitle,
  DialogTitle,
  DialogTrigger,
} from "../components/Dialog";

export default {
  title: "React/Dialog",
};

export const Default = () => {
  return (
    <DialogRoot>
      <DialogTrigger>
        <Button
          onClick={(e) => {
            console.log(`Opened dialog: `, e.currentTarget);
          }}
        >
          Open Dialog
        </Button>
      </DialogTrigger>
      <DialogOverlay>
        <DialogContent size={"fullMd"}>
          <DialogHeader>
            <DialogTitle>Lorem Ipsum</DialogTitle>
            <DialogSubtitle>This is a test dialog</DialogSubtitle>
          </DialogHeader>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          <DialogFooter>
            <DialogClose>
              <Button
                onClick={(e) => {
                  console.log(`Closed dialog: `, e.currentTarget);
                }}
              >
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </DialogOverlay>
    </DialogRoot>
  );
};

export const WithCloseOnClick = () => {
  return (
    <DialogRoot>
      <DialogTrigger>
        <Button
          onClick={(e) => {
            console.log(`Opened dialog: `, e.currentTarget);
          }}
        >
          Open Dialog
        </Button>
      </DialogTrigger>
      <DialogOverlay
        closeOnClick
        onClick={(e) => {
          console.log(`Closed dialog on overlay click: `, e.currentTarget);
        }}
      >
        <DialogContent size={"fullMd"}>
          <DialogHeader>
            <DialogTitle>Lorem Ipsum</DialogTitle>
            <DialogSubtitle>This is a test dialog</DialogSubtitle>
          </DialogHeader>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          <DialogClose>
            <Button
              onClick={(e) => {
                console.log(`Closed dialog: `, e.currentTarget);
              }}
            >
              Close Dialog
            </Button>
          </DialogClose>
        </DialogContent>
      </DialogOverlay>
    </DialogRoot>
  );
};
