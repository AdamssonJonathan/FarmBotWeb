import { createStore, PreloadedState } from "redux";
import { Store } from "./interfaces";
import { rootReducer } from "./root_reducer";
import { registerSubscribers } from "./subscribers";
import { getMiddleware } from "./middlewares";
import { set } from "lodash";
import { Everything } from "../interfaces";

function dev(): Store {
  return createStore(rootReducer,
    maybeFetchOldState(),
    getMiddleware("development"));
}

function prod(): Store {
  return createStore(rootReducer,
    {} as PreloadedState<Everything>,
    getMiddleware("production"));
}

export function configureStore() {
  const ENV = process.env.NODE_ENV || "development";
  const store2: Store = (ENV === "production" ? prod() : dev());
  // Make store global in case I need to probe it.
  set(window, "store", store2);
  registerSubscribers(store2);
  return store2;
}

export const store = configureStore();

/** Tries to fetch previous state from `sessionStorage`.
 * Returns {} if nothing is found. Used mostly for hot reloading. */
function maybeFetchOldState(): PreloadedState<Everything> {
  try {
    return JSON.parse(sessionStorage.getItem("lastState") || "{}");
  } catch (e) {
    return {} as Everything;
  }
}
