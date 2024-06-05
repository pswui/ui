import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@components/Popover.tsx";
import { Button } from "@components/Button.tsx";
import { useToast } from "@components/Toast.tsx";
import {
  createContext,
  Dispatch,
  SetStateAction,
  SVGProps,
  useContext,
  useState,
  useTransition,
} from "react";
import { Label } from "@components/Label.tsx";
import { Input } from "@components/Input.tsx";

interface UserControlState {
  signIn: boolean;
}
const initialState: UserControlState = {
  signIn: false,
};
const UserControlContext = createContext<
  [UserControlState, Dispatch<SetStateAction<UserControlState>>]
>([initialState, () => {}]);

const logInServerAction = async () => {
  return new Promise((r) => setTimeout(r, 2000));
};

const logOutServerAction = async () => {
  return new Promise((r) => setTimeout(r, 1000));
};

function MdiLoading(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1.2em"
      height="1.2em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8"
      ></path>
    </svg>
  );
}

const SignInForm = () => {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const transition = useTransition();
  const [_, setState] = useContext(UserControlContext);
  const { toast } = useToast();

  function startSignIn() {
    transition[1](() => {
      setIsSigningIn(true);
      const toasted = toast({
        title: "Logging In...",
        description: "Please wait until server responses",
        status: "loading",
      });
      logInServerAction().then(() => {
        toasted.update({
          title: "Log In Success",
          description: "Successfully logged in!",
          status: "success",
        });
        setIsSigningIn(false);
        setState((prev) => ({ ...prev, signIn: true }));
      });
    });
  }

  return (
    <PopoverContent anchor={"bottomLeft"} className={"p-4 space-y-3"}>
      <Label>
        <span>Username</span>
        <Input type={"text"} />
      </Label>
      <Label>
        <span>Password</span>
        <Input type={"password"} />
      </Label>
      <div className={"flex flex-row justify-end"}>
        <Button preset={"success"} onClick={startSignIn}>
          {isSigningIn ? <MdiLoading className={"animate-spin"} /> : "Sign In"}
        </Button>
      </div>
    </PopoverContent>
  );
};

const UserControlContent = () => {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const transition = useTransition();
  const [_, setState] = useContext(UserControlContext);
  const { toast } = useToast();

  function startSignOut() {
    transition[1](() => {
      setIsSigningOut(true);
      const toasted = toast({
        title: "Logging Out",
        description: "Please wait until server responses",
        status: "loading",
      });
      logOutServerAction().then(() => {
        toasted.update({
          title: "Log Out Success",
          description: "Successfully logged out!",
          status: "success",
        });
        setIsSigningOut(false);
        setState((prev) => ({ ...prev, signIn: false }));
      });
    });
  }

  return (
    <PopoverContent anchor={"bottomLeft"}>
      <Button preset={"ghost"}>Dashboard</Button>
      <Button preset={"ghost"} onClick={startSignOut}>
        {isSigningOut ? <MdiLoading className={"animate-spin"} /> : "Sign Out"}
      </Button>
    </PopoverContent>
  );
};

export const UserControl = () => {
  const [state, setState] = useState<UserControlState>({
    signIn: false,
  });

  return (
    <Popover>
      <PopoverTrigger>
        <Button>{state.signIn ? "Log Out" : "Log In"}</Button>
      </PopoverTrigger>
      <UserControlContext.Provider value={[state, setState]}>
        {state.signIn ? <UserControlContent /> : <SignInForm />}
      </UserControlContext.Provider>
    </Popover>
  );
};
