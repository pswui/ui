import { Link } from "react-router-dom";
import { Button } from "../../components/Button";

function UnexpectedError() {
  return (
    <main className="flex-grow h-full flex flex-col justify-center items-center gap-8">
      <section className="flex flex-col justify-center items-center text-center gap-2">
        <h1 className="text-4xl font-bold">Something went wrong</h1>
        <p className="text-base">
          There was an unexpected error while loading the page.
        </p>
      </section>
      <section className="flex flex-row justify-center items-center text-center gap-2">
        <Button asChild preset="default">
          <Link to="/">Go home</Link>
        </Button>
      </section>
    </main>
  );
}

export default UnexpectedError;
