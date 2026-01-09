import React, { useMemo } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import {
  Calendar as RNCalendar,
  CalendarProps as RNCalendarProps,
  LocaleConfig,
} from 'react-native-calendars';
import { useTheme, Icon } from 'react-native-paper';

// --- Types ---
// We adapt the props to point to RNCalendarProps since DayPicker is web-only.
// We keep some original props for API shape compatibility where possible.
export type CalendarProps = RNCalendarProps & {
  className?: string; // No-op in RN, kept for compatibility
  classNames?: any; // No-op in RN
  showOutsideDays?: boolean;
  style?: ViewStyle;
};

// --- Component ---
function Calendar({
  className: _className, // Renamed with underscore to satisfy ESLint unused-vars rule
  classNames: _classNames, // Renamed with underscore to satisfy ESLint unused-vars rule
  showOutsideDays = true,
  style,
  theme: customTheme, // allow overriding theme
  ...props
}: CalendarProps) {
  const paperTheme = useTheme();

  // Map React Native Paper theme colors to RNCalendars theme
  const calendarTheme = useMemo(() => {
    const baseTheme = {
      backgroundColor: 'transparent',
      calendarBackground: 'transparent',
      textSectionTitleColor: paperTheme.colors.secondary,
      selectedDayBackgroundColor: paperTheme.colors.primary,
      selectedDayTextColor: paperTheme.colors.onPrimary,
      todayTextColor: paperTheme.colors.primary,
      dayTextColor: paperTheme.colors.onSurface,
      textDisabledColor: paperTheme.colors.onSurfaceDisabled,
      dotColor: paperTheme.colors.primary,
      selectedDotColor: paperTheme.colors.onPrimary,
      arrowColor: paperTheme.colors.onSurface,
      disabledArrowColor: paperTheme.colors.onSurfaceDisabled,
      monthTextColor: paperTheme.colors.onSurface,
      indicatorColor: paperTheme.colors.primary,
      // Fonts
      textDayFontWeight: '400' as const,
      textMonthFontWeight: '600' as const,
      textDayHeaderFontWeight: '400' as const,
      textDayFontSize: 14,
      textMonthFontSize: 14,
      textDayHeaderFontSize: 13,
      // Styling customization to match Shadcn's "ghost" button look for days
      'stylesheet.calendar.header': {
        header: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingLeft: 0,
          paddingRight: 0,
          marginTop: 6,
          alignItems: 'center',
          marginBottom: 10,
        },
        monthText: {
          fontSize: 14,
          fontWeight: '600',
          color: paperTheme.colors.onSurface,
          margin: 10,
        },
      },
      'stylesheet.day.basic': {
        base: {
          width: 36, // w-9
          height: 36, // h-9
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 6, // rounded-md
        },
      },
    };

    return { ...baseTheme, ...customTheme };
  }, [paperTheme, customTheme]);

  return (
    <View style={[styles.container, style]}>
      <RNCalendar
        enableSwipeMonths={true}
        hideExtraDays={!showOutsideDays}
        theme={calendarTheme}
        // Custom Arrow Rendering to match Lucide Icons
        renderArrow={direction => (
          <View
            style={[
              styles.navButton,
              { borderColor: paperTheme.colors.outline },
            ]}
          >
            <Icon
              source={direction === 'left' ? 'chevron-left' : 'chevron-right'}
              size={16}
              color={paperTheme.colors.onSurface}
            />
          </View>
        )}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12, // p-3
  },
  navButton: {
    // Equivalent to buttonVariants({ variant: "outline" }) + h-7 w-7
    width: 28, // h-7
    height: 28, // w-7
    borderWidth: 1,
    borderRadius: 6, // rounded-md
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.7, // opacity-50 -> hover:opacity-100 logic (static here)
  },
});

Calendar.displayName = 'Calendar';

export { Calendar };
