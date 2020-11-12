import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { RCContextProvider } from "./RCContext";
import { uid } from "./utils";

/**
 * This function wraps the container that children will observe its size
 * @param {React.Component} Component Component that we intend to observe its size (width and height)
 * Please note that we use classname to get the element that you intend to listen to its size change, make sure you are forwarding className
 * @returns RelativeContainer(Component)
 * a wrapped component that allows its children that have a defined breakpoint to re-render with the new dimensions from the relative container
 */
const RelativeContainer = (Component) => {
  const WrappedComponent = forwardRef((props, ref) => {
    // TODO use ref or classname
    const className = useMemo(() => `rc__${uid()}`, []);

    const listeners = useRef(new Set());
    const Observer = useRef(
      new ResizeObserver((...args) =>
        listeners.current.forEach((listener) => {
          listener(...args);
        })
      )
    );

    useEffect(() => {
      const element = document.getElementsByClassName(className)[0];

      Observer.current.observe(element);
    }, [className]);

    const addListener = useCallback((listener) => {
      listeners.current.add(listener);
    }, []);

    const removeListener = useCallback((listener) => {
      listeners.current.delete(listener);
    }, []);

    const getElement = useCallback(
      () => document.getElementsByClassName(className)[0],
      [className]
    );

    const context = useMemo(
      () => ({ addListener, removeListener, getElement }),
      [addListener, removeListener, getElement]
    );

    return (
      <RCContextProvider value={context}>
        <Component ref={ref} className={className} {...props} />
      </RCContextProvider>
    );
  });

  WrappedComponent.displayName = Component.displayName
    ? `RelativeContainer(${Component.displayName})`
    : `RelativeContainer`;

  return WrappedComponent;
};

export default RelativeContainer;
