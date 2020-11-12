import React, {
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { RC_SIZE_PROP_NAME } from "./constants";
import { useRCContext } from "./RCContext";

const breakpointsToBinaryString = (breakpoints, { height, width }) =>
  breakpoints.reduce(
    (cum, breakpoint) =>
      breakpoint({ width, height }) ? cum + "1" : cum + "0",
    ""
  );

const getWidth = (element) => (element ? element.offsetWidth : undefined);
const getHeight = (element) => (element ? element.offsetHeight : undefined);

const getSize = (element) => {
  return {
    width: getWidth(element),
    height: getHeight(element),
  };
};

const declareBreakpoints = (...breakpoints) => (Component, lazy) => {
  // add feature of breakpoint as object
  const WrapperComponent = forwardRef((props, ref) => {
    const context = useRCContext();
    const [size, setSize] = useState(getSize(context.getElement()));

    const breakpointValue = useRef(
      breakpointsToBinaryString(breakpoints, getSize(context.getElement()))
    );

    useEffect(() => {
      if (context) {
        const element = context.getElement();
        const newbreakpointValue = breakpointsToBinaryString(
          breakpoints,
          getSize(element)
        );
        if (breakpointValue.current !== newbreakpointValue) {
          breakpointValue.current = newbreakpointValue;
          setSize(getSize(element));
        }
      }
    }, [context]);

    useEffect(() => {
      if (context) {
        const listenToResize = (event) => {
          const width = event[0].target.offsetWidth;
          const height = event[0].target.offsetHeight;
          const newbreakpointValue = breakpointsToBinaryString(breakpoints, {
            width,
            height,
          });
          if (breakpointValue.current !== newbreakpointValue) {
            breakpointValue.current = newbreakpointValue;
            setSize({ width, height });
          }
        };
        context.addListener(listenToResize);
        return () => {
          context.removeListener(listenToResize);
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
