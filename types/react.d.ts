// Additional React type declarations for email templates
import * as React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }

    // Allow ReactNode as valid JSX element
    type Element = React.ReactElement<any, any> | React.ReactNode;

    interface ElementClass extends React.Component<any> {
      render(): React.ReactNode;
    }

    interface ElementAttributesProperty {
      props: {};
    }

    interface ElementChildrenAttribute {
      children: {};
    }

    interface IntrinsicAttributes extends React.Attributes {}
    interface IntrinsicClassAttributes<T> extends React.ClassAttributes<T> {}
  }
}

// Extend React Email component types to be JSX compatible
declare module "@react-email/components" {
  export interface ComponentProps {
    children?: React.ReactNode;
    className?: string;
    [key: string]: any;
  }

  export const Html: React.FC<ComponentProps>;
  export const Head: React.FC<ComponentProps>;
  export const Body: React.FC<ComponentProps>;
  export const Container: React.FC<ComponentProps>;
  export const Section: React.FC<ComponentProps>;
  export const Text: React.FC<ComponentProps>;
  export const Link: React.FC<ComponentProps & { href?: string }>;
  export const Preview: React.FC<ComponentProps>;
  export const Tailwind: React.FC<ComponentProps & { config?: any }>;
}
