import React from "react";
import { Input, InputFrame } from "../components/Input";
import { Button } from "../components/Button";

export default {
  title: "React/Input",
};

export const TextInput = () => {
  return <Input type="text" placeholder="Type Here..." />;
};

export const PasswordInput = () => {
  return <Input type="password" />;
};

export const InvalidInput = () => {
  return <Input type="text" invalid="Invalid" />;
};

export const DisabledInput = () => {
  return <Input type="text" disabled />;
};

export const InputWithFrame = () => {
  const [passwordState, setPasswordState] = React.useState({ visible: false });

  return (
    <InputFrame>
      <Input type={passwordState.visible ? "text" : "password"} unstyled />
      <Button
        preset="default"
        size="icon"
        onClick={() =>
          setPasswordState((prev) => ({ ...prev, visible: !prev.visible }))
        }
      >
        {passwordState.visible ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M12 17.5c-3.8 0-7.2-2.1-8.8-5.5H1c1.7 4.4 6 7.5 11 7.5s9.3-3.1 11-7.5h-2.2c-1.6 3.4-5 5.5-8.8 5.5"
            ></path>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M12 9a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5c-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0a9.821 9.821 0 0 0-17.64 0"
            ></path>
          </svg>
        )}
      </Button>
    </InputFrame>
  );
};

export const InputWithFrameInvalid = () => {
  const [passwordState, setPasswordState] = React.useState({ visible: false });

  return (
    <InputFrame>
      <Input
        type={passwordState.visible ? "text" : "password"}
        unstyled
        invalid="Invalid"
      />
      <Button
        preset="default"
        size="icon"
        onClick={() =>
          setPasswordState((prev) => ({ ...prev, visible: !prev.visible }))
        }
        background="error"
        border="error"
      >
        {passwordState.visible ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M12 17.5c-3.8 0-7.2-2.1-8.8-5.5H1c1.7 4.4 6 7.5 11 7.5s9.3-3.1 11-7.5h-2.2c-1.6 3.4-5 5.5-8.8 5.5"
            ></path>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M12 9a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5c-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0a9.821 9.821 0 0 0-17.64 0"
            ></path>
          </svg>
        )}
      </Button>
    </InputFrame>
  );
};
