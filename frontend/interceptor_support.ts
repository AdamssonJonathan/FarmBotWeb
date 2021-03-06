import { DataChangeType, Dictionary } from "farmbot";
import { box } from "boxed_value";
import { isNumber, isNaN } from "lodash";

export const METHOD_MAP: Dictionary<DataChangeType> = {
  "post": "add",
  "put": "update",
  "patch": "update",
  "delete": "remove"
};
export const METHODS = ["post", "put", "patch", "delete"];

/** More nasty hacks until we have time to implement proper API push state
 * notifications. */
export function inferUpdateId(url: string) {
  try {
    const ids = url
      .split("/")
      .filter(x => !x.includes(",")) // Don't allow batch endpoints to participate.
      .map(x => parseInt(x, 10))
      .filter(x => !isNaN(x));
    const id: number | undefined = ids[0];
    const isNum = isNumber(id);
    const onlyOne = ids.length === 1;
    return (isNum && onlyOne) ? ("" + id) : "*";
  } catch (error) { // Don't crash - just keep moving along. This is a temp patch.
    return "*";
  }
}

/** The input of an axios error interceptor is an "any" type.
 * Sometimes it will be a real Axios error, other times it will not be.
 */
export interface SafeError {
  request: {
    responseURL: string;
  },
  response: {
    status: number;
  };
}

/** Prevents hard-to-find NPEs and type errors inside of interceptors. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isSafeError(x: SafeError | any): x is SafeError {
  return !!(
    (box(x).kind === "object") &&
    (box(x.response).kind === "object") &&
    (box(x.response.status).kind === "number"));
}
