import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Text, useTheme, Icon } from 'react-native-paper';

// --- Components ---

const Breadcrumb = React.forwardRef<View, React.ComponentProps<typeof View>>(
  ({ style, ...props }, ref) => (
    <View ref={ref} accessibilityRole="header" style={[styles.root, style]} {...props} />
  )
);
Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbList = React.forwardRef<View, React.ComponentProps<typeof View>>(
  ({ style, ...props }, ref) => (
    <View ref={ref} style={[styles.list, style]} {...props} />
  )
);
BreadcrumbList.displayName = "BreadcrumbList";

const BreadcrumbItem = React.forwardRef<View, React.ComponentProps<typeof View>>(
  ({ style, ...props }, ref) => (
    <View ref={ref} style={[styles.item, style]} {...props} />
  )
);
BreadcrumbItem.displayName = "BreadcrumbItem";

interface BreadcrumbLinkProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: TextStyle;
  asChild?: boolean; // Kept for API compatibility, though simpler in RN
}

const BreadcrumbLink = React.forwardRef<any, BreadcrumbLinkProps>(
  ({ children, onPress, style, asChild, ...props }, ref) => {
    const theme = useTheme();

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement, {
        // @ts-ignore
        onPress: onPress || children.props.onPress,
        // @ts-ignore
        style: [styles.link, { color: theme.colors.onSurfaceVariant }, style, children.props.style],
        ...props
      });
    }

    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <Text
          ref={ref}
          variant="bodyMedium"
          style={[styles.link, { color: theme.colors.onSurfaceVariant }, style]}
          {...props}
        >
          {children}
        </Text>
      </TouchableOpacity>
    );
  }
);
BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbPage = React.forwardRef<any, React.ComponentProps<typeof Text>>(
  ({ style, children, ...props }, ref) => {
    const theme = useTheme();
    return (
      <Text
        ref={ref}
        role="link"
        aria-current="page"
        variant="bodyMedium"
        style={[{ color: theme.colors.onSurface, fontWeight: 'normal' }, style]}
        {...props}
      >
        {children}
      </Text>
    );
  }
);
BreadcrumbPage.displayName = "BreadcrumbPage";

const BreadcrumbSeparator = ({ children, style }: { children?: React.ReactNode; style?: ViewStyle }) => {
  const theme = useTheme();
  return (
    <View
      accessibilityRole="none" // presentation
      style={[styles.separator, style]}
    >
      {children ?? (
        <Icon source="chevron-right" size={16} color={theme.colors.onSurfaceVariant} />
      )}
    </View>
  );
};
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

const BreadcrumbEllipsis = ({ style }: { style?: ViewStyle }) => {
  const theme = useTheme();
  return (
    <View
      accessibilityRole="none" // presentation
      style={[styles.ellipsis, style]}
    >
      <Icon source="dots-horizontal" size={16} color={theme.colors.onSurfaceVariant} />
      <View style={styles.srOnly} accessibilityLabel="More" /> 
    </View>
  );
};
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

// --- Styles ---

const styles = StyleSheet.create({
  root: {
    // No default styles needed for wrapper
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8, // gap-1.5 / gap-2.5 approximation
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6, // gap-1.5
  },
  link: {
    // transition-colors handled by Touchable opacity change
  },
  separator: {
    // [&>svg]:size-3.5 handled by Icon size
  },
  ellipsis: {
    width: 36, // w-9
    height: 36, // h-9
    alignItems: 'center',
    justifyContent: 'center',
  },
  srOnly: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  }
});

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};