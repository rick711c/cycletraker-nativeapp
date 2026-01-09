import React from 'react';
import { View, ViewStyle, ViewProps } from 'react-native';

interface AspectRatioProps extends ViewProps {
  ratio?: number;
  children?: React.ReactNode;
  style?: ViewStyle;
}

const AspectRatio = React.forwardRef<View, AspectRatioProps>(
  ({ ratio = 1, style, children, ...props }, ref) => {
    return (
      <View
        ref={ref}
        style={[{ aspectRatio: ratio }, style]}
        {...props}
      >
        {children}
      </View>
    );
  }
);

AspectRatio.displayName = "AspectRatio";

export { AspectRatio };