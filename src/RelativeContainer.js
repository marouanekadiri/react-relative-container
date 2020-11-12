import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";

import { RCContextProvider } from "./RCContext";

/**
 * This function wraps the container that children will observe its size
 * @param {React.Component} Component Component that we intend to observe its size (width and height)
 * Please note that we use classname to get the element that you intend to listen to its size change, make sure you are forwarding className
 * @returns RelativeContainer(Component)
 * a wrapped component that allows its children that have a defined breakpoint to re-render with the new dimensions from the relative container
 */
const RelativeContainer = (Component) => {
  // eslint-disable-next-line react/prop-types
  const WrappedComponent = forwardRef((props, ref) => {
    // TODO use ref or classname
    // const rcClassName = useMemo(() => `rc__${uid()}`, []);
    const rcElement = useRef();
    useImperativeHandle(ref, () => rcElement.current);

    const listeners = useRef(new Set());
    const Observer = useRef(
      new ResizeObserver((...args) =>
        listeners.current.forEach((listener) => {
          listener(...args);
        })
      )
    );

    useEffect(() => {
      Observer.current.observe(rcElement.current);
    }, []);

    const addListener = useCallback((listener) => {
      listeners.current.add(listener);
    }, []);

    const removeListener = useCallback((listener) => {
      listeners.current.delete(listener);
    }, []);

    const getElement = useCallback(() => {
      return rcElement.current;
    }, []);

    const context = useMemo(
      () => ({ addListener, removeListener, getElement }),
      [addListener, removeListener, getElement]
    );

    return (
      <RCContextProvider value={context}>
        <Component ref={rcElement} {...props} />
      </RCContextProvider>
    );
  });

  WrappedComponent.displayName = Component.displayName
    ? `RelativeContainer(${Component.displayName})`
    : `RelativeContainer`;

  return WrappedComponent;
};

export default RelativeContainer;
