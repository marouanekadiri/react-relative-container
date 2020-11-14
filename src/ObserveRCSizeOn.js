import React, { forwardRef } from "react";
import { RC_SIZE_PROP_NAME } from "./constants";
import { useRCSizeOn } from "./hooks";
import { isNil } from "./utils";

/**
 *
 * @param  {...Function} breakpoints list of (({width}) => width > 500, ({width}) => width > 600)
 * @returns Function that takes two parameters `Component` and `shouldMountAfterRC` and return a `WrappedComponent`
 *
 * `Component` mainly the component that should re-render
 *
 * `shouldMountAfterRC` set this to true if you want your component to mount after
 *  the relative container renders first (mainly to avoid a second re-render because of width and height state switch)
 */
const ObserveRCSizeOn = (...breakpoints) => (Component, shouldMountAfterRC) => {
  const WrapperComponent = forwardRef((props, ref) => {
    const size = useRCSizeOn(...breakpoints);
    const rcProps = {
      [RC_SIZE_PROP_NAME]: size,
    };

    return (shouldMountAfterRC && !isNil(size.width) && !isNil(size.height)) ||
      !shouldMountAfterRC ? (
      <Component ref={ref} {...rcProps} {...props} />
    ) : null;
  });

  WrapperComponent.displayName = Component.displayName
    ? `ObserveRelativeContainer(${Component.displayName})`
    : `ObserveRelativeContainer`;

  return WrapperComponent;
};

export default ObserveRCSizeOn;
