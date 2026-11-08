import { render } from "cajoa";
import { App } from "./App";
import { initFx } from "./fx";
import "./style.css";

render(App, document.getElementById("app")!);
initFx();
