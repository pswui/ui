import { Link } from "react-router-dom";
import { Button } from "../../components/Button";

function PageNotFound() {
  return (
    <main className="flex-grow h-full flex flex-col justify-center items-center gap-8">
      <section className="flex flex-col justify-center items-center text-center gap-2">
        <h1 className="text-4xl font-bold">Page not found</h1>
        <p className="text-base">
          The page you are looking for does not exist.
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

export default PageNotFound;
