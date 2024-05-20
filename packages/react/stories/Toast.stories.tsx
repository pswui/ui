import { Button } from "../components/Button";
import { Toaster, useToast } from "../components/Toast";

export default {
  title: "React/Toast",
  tags: ["!autodocs"],
  decorators: [
    (Story: any) => (
      <>
        <Toaster />
        {Story()}
      </>
    ),
  ],
};

export const Default = () => {
  const { toast } = useToast();

  return (
    <>
      <Button
        preset="default"
        onClick={() => {
          toast({
            title: "Toast Title Lorem loremLorem loremLorem loremLorem lorem",
            description:
              "Toast DescriptionLorem loremLorem loremLorem loremLorem lorem",
          });
        }}
      >
        Toast!
      </Button>
    </>
  );
};

const fetchAndWaitForSuccess = (): Promise<string> => {
  return new Promise((resolve) =>
    setTimeout(() => resolve("LoremSuccess"), 3000)
  );
};
const fetchAndWaitForError = (): Promise<string> => {
  return new Promise((_, reject) =>
    setTimeout(() => reject("LoremError"), 3000)
  );
};

export const PromiseWaitSuccess = () => {
  const { toast } = useToast();

  return (
    <>
      <Button
        preset="default"
        onClick={async () => {
          const { update } = toast({
            title: "Loading...",
            description: "Loading data... Please wait.",
            status: "loading",
            closeButton: false,
            closeTimeout: null,
          });
          const result = await fetchAndWaitForSuccess();
          update({
            title: "Successfully Fetched",
            description: `Data loaded successfully: ${result}`,
            status: "success",
            closeButton: true,
            closeTimeout: 3000,
          });
        }}
      >
        Toast!
      </Button>
    </>
  );
};

export const PromiseWaitError = () => {
  const { toast } = useToast();

  return (
    <>
      <Button
        preset="default"
        onClick={async () => {
          const { update } = toast({
            title: "Loading...",
            description: "Loading data... Please wait.",
            status: "loading",
            closeButton: false,
            closeTimeout: null,
          });
          try {
            const result = await fetchAndWaitForError();
            console.log(result);
          } catch (error) {
            update({
              title: "Failed to fetch",
              description: `Error: ${error}`,
              status: "error",
              closeButton: true,
              closeTimeout: 3000,
            });
          }
        }}
      >
        Toast!
      </Button>
    </>
  );
};
