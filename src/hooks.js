import { useRCContext } from "./RCContext";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 *
 * @param {Array} breakpoints list of function breakpoint (e.g. `[({width}) => width > 500,({width}) => width > 600]`)
 * @param {Object} size {width, height}
 * @returns Binary string that for each binary digit
 * represents a boolean (0 or 1) based on breakpoint condition against the height and width specified in the second argument
 */
const breakpointsToBinaryString = (breakpoints, { height, width }) =>
  breakpoints.reduce(
    (cum, breakpoint) =>
      breakpoint({ width, height }) ? cum + "1" : cum + "0",
    ""
  );

/**
 * Get width of the html element (offsetWidth)
 * @param {HTMLElement} element
 */
const getWidth = (element) => (element ? element.offsetWidth : undefined);

/**
 * Get height of the html element (offsetHeight)
 * @param {HTMLElement} element
 */
const getHeight = (element) => (element ? element.offsetHeight : undefined);

/**
 * Get width and height of html element (offsetWidth and offsetHeight)
 * @param {HTMLElement} element
 * @returns e.g. ({ width: 600, height: 700 })
 */
const getSize = (element) => {
  return {
    width: getWidth(element),
    height: getHeight(element),
  };
};

/**
 * Listens to relative container and change size when relative container reachs a breaking state based on breakpoint provided
 * @param  {...any} breakpoints List of break points e.g. (({width}) => width > 500, ({width}) => width > 700)
 * @returns Last size change based on state of relative container against breakpoints provided
 */
export const useRCSizeOn = (...breakpoints) => {
  const context = useRCContext();
  const [size, setSize] = useState(getSize(context.getElement()));

  const breakpointValue = useRef(
    breakpointsToBinaryString(breakpoints, getSize(context.getElement()))
  );

  const reevaluateBreakpoints = useCallback((element) => {
    const newbreakpointValue = breakpointsToBinaryString(
      breakpoints,
      getSize(element)
    );
    if (breakpointValue.current !== newbreakpointValue) {
      breakpointValue.current = newbreakpointValue;
      setSize(getSize(element));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (context) {
      const element = context.getElement();
      reevaluateBreakpoints(element);
    }
  }, [context, reevaluateBreakpoints]);

  useEffect(() => {
    if (context) {
      const observeResize = (event) => {
        reevaluateBreakpoints(event[0].target);
      };
      context.addListener(observeResize);
      return () => {
        context.removeListener(observeResize);
      };
    }
  }, [context, reevaluateBreakpoints]);
  return size;
};
