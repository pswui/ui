import { Box, Text, useInput } from "ink";
import React, { useState } from "react";

function isUnicodeSupported() {
  if (process.platform !== "win32") {
    return process.env.TERM !== "linux"; // Linux console (kernel)
  }

  return (
    Boolean(process.env.WT_SESSION) || // Windows Terminal
    Boolean(process.env.TERMINUS_SUBLIME) || // Terminus (<0.2.27)
    process.env.ConEmuTask === "{cmd::Cmder}" || // ConEmu and cmder
    process.env.TERM_PROGRAM === "Terminus-Sublime" ||
    process.env.TERM_PROGRAM === "vscode" ||
    process.env.TERM === "xterm-256color" ||
    process.env.TERM === "alacritty" ||
    process.env.TERMINAL_EMULATOR === "JetBrains-JediTerm"
  );
}

const shouldUseMain = isUnicodeSupported();
const SELECTED: string = shouldUseMain ? "◉" : "(*)";
const UNSELECTED: string = shouldUseMain ? "◯" : "( )";

export function Choice({
  question,
  yes,
  no,
  onSubmit,
  initial,
}: {
  question: string;
  yes: string;
  no: string;
  onSubmit?: (vaule: "yes" | "no") => void;
  initial?: "yes" | "no";
}) {
  const [state, setState] = useState<"yes" | "no">(initial ?? "yes");

  useInput((_, k) => {
    if (k.upArrow) {
      setState("yes");
    } else if (k.downArrow) {
      setState("no");
    }

    if (k.return) {
      onSubmit?.(state);
    }
  });

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
    >
      <Text color={"greenBright"}>{question}</Text>
      <Text color={state === "yes" ? undefined : "gray"}>
        {state === "yes" ? SELECTED : UNSELECTED} {yes}
      </Text>
      <Text color={state === "no" ? undefined : "gray"}>
        {state === "no" ? SELECTED : UNSELECTED} {no}
      </Text>
    </Box>
  );
}
