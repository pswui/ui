import { Button } from "@components/Button";
import { Popover, PopoverContent, PopoverTrigger } from "@components/Popover";

export function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger>
        <Button size="icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.2em"
            height="1.2em"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4"
            />
          </svg>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Button preset="ghost" className="gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.2em"
            height="1.2em"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"
            />
          </svg>
          <span className="flex-grow text-left">Dashboard</span>
        </Button>
        <Button preset="ghost" className="gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.2em"
            height="1.2em"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="m17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5M4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4z"
            />
          </svg>
          <span className="flex-grow text-left">Log out</span>
        </Button>
      </PopoverContent>
    </Popover>
  );
}
