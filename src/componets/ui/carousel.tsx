import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ViewStyle,
  Platform,
} from 'react-native';
import { IconButton, useTheme, MD3Theme } from 'react-native-paper';

// --- Types ---
type CarouselApi = {
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  scrollTo: (index: number) => void;
  currentIndex: number;
};

type CarouselProps = {
  orientation?: 'horizontal' | 'vertical';
  setApi?: (api: CarouselApi) => void;
  children: React.ReactNode;
  style?: ViewStyle;
};

type CarouselContextProps = {
  carouselRef: React.RefObject<ScrollView>;
  orientation: 'horizontal' | 'vertical';
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  itemSize: number;
  setItemSize: (size: number) => void;
  scrollOffset: number;
  setScrollOffset: (offset: number) => void;
  contentSize: number;
  setContentSize: (size: number) => void;
};

const CarouselContext = createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = useContext(CarouselContext);

  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />');
  }

  return context;
}

const Carousel = React.forwardRef<View, CarouselProps>(
  ({ orientation = 'horizontal', setApi, children, style }, ref) => {
    const carouselRef = useRef<ScrollView>(null);
    const [itemSize, setItemSize] = useState(0);
    const [scrollOffset, setScrollOffset] = useState(0);
    const [contentSize, setContentSize] = useState(0);

    const canScrollPrev = scrollOffset > 0;
    // Simple tolerance check for end of scroll
    const canScrollNext = scrollOffset < contentSize - itemSize - 1;

    const scrollPrev = useCallback(() => {
      if (!carouselRef.current || itemSize === 0) return;
      const targetOffset = Math.max(0, scrollOffset - itemSize);

      carouselRef.current.scrollTo({
        [orientation === 'horizontal' ? 'x' : 'y']: targetOffset,
        animated: true,
      });
    }, [scrollOffset, itemSize, orientation]);

    const scrollNext = useCallback(() => {
      if (!carouselRef.current || itemSize === 0) return;
      const targetOffset = Math.min(
        contentSize - itemSize,
        scrollOffset + itemSize,
      );

      carouselRef.current.scrollTo({
        [orientation === 'horizontal' ? 'x' : 'y']: targetOffset,
        animated: true,
      });
    }, [scrollOffset, itemSize, contentSize, orientation]);

    const scrollTo = useCallback(
      (index: number) => {
        if (!carouselRef.current || itemSize === 0) return;
        const targetOffset = index * itemSize;
        carouselRef.current.scrollTo({
          [orientation === 'horizontal' ? 'x' : 'y']: targetOffset,
          animated: true,
        });
      },
      [itemSize, orientation],
    );

    const currentIndex = Math.round(scrollOffset / (itemSize || 1));

    // Expose API
    useEffect(() => {
      if (setApi) {
        setApi({
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
          scrollTo,
          currentIndex,
        });
      }
    }, [
      setApi,
      scrollPrev,
      scrollNext,
      canScrollPrev,
      canScrollNext,
      scrollTo,
      currentIndex,
    ]);

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          orientation,
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
          itemSize,
          setItemSize,
          scrollOffset,
          setScrollOffset,
          contentSize,
          setContentSize,
        }}
      >
        <View
          ref={ref}
          style={[styles.carousel, style]}
          accessibilityRole="adjustable"
        >
          {children}
        </View>
      </CarouselContext.Provider>
    );
  },
);
Carousel.displayName = 'Carousel';

const CarouselContent = React.forwardRef<
  ScrollView,
  React.ComponentProps<typeof ScrollView>
>(({ style, children, ...props }) => {
  const {
    carouselRef,
    orientation,
    setItemSize,
    setScrollOffset,
    setContentSize,
  } = useCarousel();
  const isHorizontal = orientation === 'horizontal';

  const handleLayout = (e: LayoutChangeEvent) => {
    // We assume the carousel container (viewport) size defines the "slide" size for snapping
    const { width, height } = e.nativeEvent.layout;
    setItemSize(isHorizontal ? width : height);
  };

  const handleContentSizeChange = (w: number, h: number) => {
    setContentSize(isHorizontal ? w : h);
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = isHorizontal
      ? e.nativeEvent.contentOffset.x
      : e.nativeEvent.contentOffset.y;
    setScrollOffset(offset);
    // Optional: Pass onScroll prop if provided
    // props.onScroll?.(e);
  };

  return (
    <ScrollView
      ref={carouselRef}
      horizontal={isHorizontal}
      style={[styles.content, style]}
      contentContainerStyle={
        isHorizontal
          ? styles.contentContainerHorizontal
          : styles.contentContainerVertical
      }
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      pagingEnabled={true} // Enables native snapping behavior
      onLayout={handleLayout}
      onContentSizeChange={handleContentSizeChange}
      onScroll={handleScroll}
      scrollEventThrottle={16} // Good balance for performance/responsiveness
      {...props}
    >
      {children}
    </ScrollView>
  );
});
CarouselContent.displayName = 'CarouselContent';

const CarouselItem = React.forwardRef<View, React.ComponentProps<typeof View>>(
  ({ style, ...props }, ref) => {
    const { orientation, itemSize } = useCarousel();
    const isHorizontal = orientation === 'horizontal';

    // In a paging ScrollView, items usually match the viewport size
    // If itemSize is 0 (initial render), we might want a default or flex
    const sizeStyle =
      itemSize > 0
        ? {
            width: isHorizontal ? itemSize : '100%',
            height: isHorizontal ? '100%' : itemSize,
          }
        : {
            flex: 1, // Fallback
          };

    return (
      <View
        ref={ref}
        style={[styles.item, sizeStyle as ViewStyle, style]}
        {...props}
      />
    );
  },
);
CarouselItem.displayName = 'CarouselItem';

const CarouselPrevious = React.forwardRef<
  View,
  React.ComponentProps<typeof IconButton>
>(({ style, disabled, icon, ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();
  const theme = useTheme();

  // Don't render if we can't scroll (optional behavior, matches disabled prop)
  // Or just disable it. Shadcn usually disables it.

  return (
    <View
      style={[
        styles.buttonWrapper,
        orientation === 'horizontal'
          ? styles.prevHorizontal
          : styles.prevVertical,
        style,
      ]}
    >
      <IconButton
        ref={ref}
        icon={icon || (orientation === 'horizontal' ? 'arrow-left' : 'arrow-up')}
        mode="contained"
        size={20}
        disabled={!canScrollPrev || disabled}
        onPress={scrollPrev}
        containerColor={theme.colors.background}
        iconColor={theme.colors.onSurface}
        style={styles.iconButton}
        {...props}
      />
    </View>
  );
});
CarouselPrevious.displayName = 'CarouselPrevious';

const CarouselNext = React.forwardRef<
  View,
  React.ComponentProps<typeof IconButton>
>(({ style, disabled, icon, ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel();
  const theme = useTheme();

  return (
    <View
      style={[
        styles.buttonWrapper,
        orientation === 'horizontal'
          ? styles.nextHorizontal
          : styles.nextVertical,
        style,
      ]}
    >
      <IconButton
        ref={ref}
        icon={icon || (orientation === 'horizontal' ? 'arrow-right' : 'arrow-down')}
        mode="contained"
        size={20}
        disabled={!canScrollNext || disabled}
        onPress={scrollNext}
        containerColor={theme.colors.background}
        iconColor={theme.colors.onSurface}
        style={styles.iconButton}
        {...props}
      />
    </View>
  );
});
CarouselNext.displayName = 'CarouselNext';

// --- Styles ---

const styles = StyleSheet.create({
  carousel: {
    position: 'relative',
    // Ensure the carousel has size so children can size themselves
  },
  content: {
    // ScrollView style
  },
  contentContainerHorizontal: {
    flexDirection: 'row',
  },
  contentContainerVertical: {
    flexDirection: 'column',
  },
  item: {
    // Basis full logic handled by dynamic size in component
    justifyContent: 'center',
    // padding handled by user in style prop usually
  },
  buttonWrapper: {
    position: 'absolute',
    zIndex: 10,
  },
  iconButton: {
    margin: 0,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)', // subtle border
    elevation: 2,
  },
  // Positioning presets matching Shadcn defaults roughly
  prevHorizontal: {
    left: 10,
    top: '50%',
    transform: [{ translateY: -20 }], // Center vertically (approx half button height)
  },
  nextHorizontal: {
    right: 10,
    top: '50%',
    transform: [{ translateY: -20 }],
  },
  prevVertical: {
    top: 10,
    left: '50%',
    transform: [{ translateX: -20 }],
  },
  nextVertical: {
    bottom: 10,
    left: '50%',
    transform: [{ translateX: -20 }],
  },
});

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
};
