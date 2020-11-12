import { RC_SIZE_PROP_NAME } from "./constants";
import { toBoolean } from "./utils";

/**
 * Allows you to know if the relative container matches all the queries specified
 * @param queries list of queries to check on relative container
 * @returns A function with `props` as parameter
 * that return a boolean reflecting if the relative container matches all the `queries` specified 
 */
export const rcMatches = (...queries) => (props) =>
  queries.reduce(
    (condition, query) =>
      condition && toBoolean(query(props[RC_SIZE_PROP_NAME])),
    true
  );

/**
 * Styled component relative container
 * Allows you to query and apply a style when the relative container matches the queries specified
 * @param queries list of queries to check on relative container
 * @returns returns a function with two parameters `matchRules` `unMatchRules` 
 * that conditionally returns `matchRules` if relative container matches with the `queries` specified, `unMatchRules` if it doesn't match
 */
export const styledRCMatches = (...queries) => (
  matchRules,
  unMatchRules = undefined
) => (props) => (rcMatches(...queries)(props) ? matchRules : unMatchRules);
