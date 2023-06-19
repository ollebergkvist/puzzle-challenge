// libs
import { render } from "preact";

// app
import { App } from "./app.tsx";

// styles
import "./styles/tailwind.css";

render(<App />, document.getElementById("app") as HTMLElement);
