import { Link } from "react-router-dom";
import { Button } from "../components/Button";

function Home() {
  return (
    <main className="flex-grow h-full flex flex-col p-4 justify-center items-center">
      <section className="h-full flex flex-col justify-center items-center text-center gap-8">
        <header className="flex flex-col justify-center items-center gap-2">
          <h1 className="text-4xl font-bold">
            Build your components in isolation
          </h1>
          <p className="text-xl max-w-xl">
            There are a lot of component libraries out there, but why it install
            so many things?
          </p>
        </header>
        <div className="flex flex-row justify-center items-center gap-2">
          <Button asChild preset="default">
            <Link to="/docs">Get Started</Link>
          </Button>
          <Button asChild preset="ghost">
            <Link to="/docs/components">Components</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}

export default Home;
