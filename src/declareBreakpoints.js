import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { RC_SIZE_PROP_NAME } from "./constants";
import { useRCContext } from "./RCContext";

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
 * 
 * @param  {...Function} breakpoints list of (({width}) => width > 500, ({width}) => width > 600)
 * @returns Function that takes two parameters `Component` and `lazy` and return a `WrappedComponent`
 * 
 * `Component` mainly the component that should re-render
 * 
 * `lazy` set this to true if you want your component to mount after 
 *  the relative container renders first (mainly to avoid a second re-render because of width and height state switch)
 */
const declareBreakpoints = (...breakpoints) => (Component, lazy) => {
  // add feature of breakpoint as object
  const WrapperComponent = forwardRef((props, ref) => {
    const context = useRCContext();
    const [size, setSize] = useState(getSize(context.getElement()));

    const breakpointValue = useRef(
      breakpointsToBinaryString(breakpoints, getSize(context.getElement()))
    );

    const reevaluateBreakpoints = useCallback(element => {
      const newbreakpointValue = breakpointsToBinaryString(
        breakpoints,
        getSize(element)
      );
      if (breakpointValue.current !== newbreakpointValue) {
        breakpointValue.current = newbreakpointValue;
        setSize(getSize(element));
      }
    }, [])

    useEffect(() => {
      if (context) {
        const element = context.getElement();
        reevaluateBreakpoints(element);
      }
    }, [context]);

    useEffect(() => {
      if (context) {
        const observeResize = (event) => {
          reevaluateBreakpoints(event[0].target)
        };
        context.addListener(observeResize);
        return () => {
          context.removeListener(observeResize);
        };
      }
    }, [context]);
    const rcProps = {
      [RC_SIZE_PROP_NAME]: size,
    };

    return (lazy && size.width && size.height) || !lazy ? (
      <Component ref={ref} {...rcProps} {...props} />
    ) : null;
  });

  WrapperComponent.displayName = Component.displayName
    ? `ObserveRelativeContainer(${Component.displayName})`
    : `ObserveRelativeContainer`;

  return WrapperComponent;
};

export default declareBreakpoints;
