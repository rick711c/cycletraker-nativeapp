import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  ViewStyle,
  ImageProps as RNImageProps,
  ImageStyle,
} from 'react-native';
import { useTheme } from 'react-native-paper';

// --- Context ---
type AvatarStatus = 'loading' | 'error' | 'loaded';

interface AvatarContextType {
  status: AvatarStatus;
  setStatus: (status: AvatarStatus) => void;
}

const AvatarContext = createContext<AvatarContextType | undefined>(undefined);

// --- Components ---

interface AvatarProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const Avatar = React.forwardRef<View, AvatarProps>(
  ({ children, style }, ref) => {
    const [status, setStatus] = useState<AvatarStatus>('loading');

    return (
      <AvatarContext.Provider value={{ status, setStatus }}>
        <View ref={ref} style={[styles.avatar, style]}>
          {children}
        </View>
      </AvatarContext.Provider>
    );
  },
);
Avatar.displayName = 'Avatar';

interface AvatarImageProps extends Omit<RNImageProps, 'style'> {
  style?: ImageStyle;
}

const AvatarImage = React.forwardRef<Image, AvatarImageProps>(
  ({ style, onLoad, onError, ...props }, ref) => {
    const context = useContext(AvatarContext);

    const handleLoad = (e: any) => {
      context?.setStatus('loaded');
      onLoad?.(e);
    };

    const handleError = (e: any) => {
      context?.setStatus('error');
      onError?.(e);
    };

    // We keep the image rendered (but hidden if needed) so it can trigger the load event.
    // If it's loaded, we show it. If it's loading, we keep it opacity 0 or absolute behind fallback?
    // Standard practice: Render it. If loading/error, the fallback (if present) will cover it or be shown instead.
    // Here, we'll let the fallback decide to hide itself when loaded.

    // If error, we hide image to prevent any partial rendering or borders
    if (context?.status === 'error') return null;

    return (
      <Image
        ref={ref}
        style={[styles.image, style]}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    );
  },
);
AvatarImage.displayName = 'AvatarImage';

interface AvatarFallbackProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const AvatarFallback = React.forwardRef<View, AvatarFallbackProps>(
  ({ children, style }, ref) => {
    const context = useContext(AvatarContext);
    const theme = useTheme();

    // If image is successfully loaded, hide fallback
    if (context?.status === 'loaded') return null;

    return (
      <View
        ref={ref}
        style={[
          styles.fallback,
          { backgroundColor: theme.colors.surfaceVariant }, // bg-muted approximation
          style,
        ]}
      >
        {children}
      </View>
    );
  },
);
AvatarFallback.displayName = 'AvatarFallback';

// --- Styles ---

const styles = StyleSheet.create({
  avatar: {
    position: 'relative',
    flexDirection: 'row',
    width: 40, // h-10
    height: 40, // w-10
    borderRadius: 20, // rounded-full (half of width/height)
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    // aspect-square is handled by filling the square container
  },
  fallback: {
    ...StyleSheet.absoluteFillObject, // absolute fill to sit exactly where image would be
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    width: '100%',
    height: '100%',
  },
});

export { Avatar, AvatarImage, AvatarFallback };
