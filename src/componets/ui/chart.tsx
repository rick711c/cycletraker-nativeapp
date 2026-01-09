import React, { createContext, useContext } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

// --- Types ---
// Adapted for React Native usage (no CSS selectors)
const THEMES = { light: '', dark: '.dark' } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType<{ size?: number; color?: string }>;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = createContext<ChartContextProps | null>(null);

function useChart() {
  const context = useContext(ChartContext);

  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />');
  }

  return context;
}

// --- Components ---

interface ChartContainerProps {
  config: ChartConfig;
  children: React.ReactNode;
  style?: ViewStyle;
}

const ChartContainer = React.forwardRef<View, ChartContainerProps>(
  ({ config, children, style }, ref) => {
    return (
      <ChartContext.Provider value={{ config }}>
        <View ref={ref} style={[styles.container, style]}>
          {children}
        </View>
      </ChartContext.Provider>
    );
  },
);
ChartContainer.displayName = 'Chart';

// Note: ChartStyle is removed as it relies on CSS injection which is not supported in RN.

// --- Tooltip Components ---

interface ChartTooltipContentProps {
  active?: boolean;
  payload?: any[];
  indicator?: 'line' | 'dot' | 'dashed';
  hideLabel?: boolean;
  hideIndicator?: boolean;
  label?: string;
  labelFormatter?: (value: any, payload: any[]) => React.ReactNode;
  formatter?: (
    value: any,
    name: any,
    item: any,
    index: number,
    payload: any,
  ) => React.ReactNode;
  color?: string;
  nameKey?: string;
  labelKey?: string;
  style?: ViewStyle;
}

const ChartTooltipContent = React.forwardRef<View, ChartTooltipContentProps>(
  (
    {
      active,
      payload,
      indicator = 'dot',
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      formatter,
      color,
      nameKey,
      labelKey,
      style,
    },
    ref,
  ) => {
    const { config } = useChart();
    const theme = useTheme();

    if (!active || !payload?.length) {
      return null;
    }

    const [item] = payload;
    const key = `${labelKey || item.dataKey || item.name || 'value'}`;
    const itemConfig = getPayloadConfigFromPayload(config, item, key);
    const value =
      !labelKey && typeof label === 'string'
        ? config[label as keyof typeof config]?.label || label
        : itemConfig?.label;

    const tooltipLabel = (() => {
      if (hideLabel || !payload?.length) return null;
      if (labelFormatter) {
        return (
          <Text style={styles.label}>{labelFormatter(value, payload)}</Text>
        );
      }
      if (!value) return null;
      return <Text style={styles.label}>{value}</Text>;
    })();

    const nestLabel = payload.length === 1 && indicator !== 'dot';

    return (
      <View
        ref={ref}
        style={[
          styles.tooltipContainer,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.outlineVariant,
          },
          style,
        ]}
      >
        {!nestLabel ? tooltipLabel : null}
        <View style={styles.tooltipItems}>
          {payload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || 'value'}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const indicatorColor = color || item.payload?.fill || item.color;

            return (
              <View key={index} style={styles.tooltipItemRow}>
                {formatter && item?.value !== undefined && item.name ? (
                  <View>
                    {formatter(
                      item.value,
                      item.name,
                      item,
                      index,
                      item.payload,
                    )}
                  </View>
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon size={10} color={indicatorColor} />
                    ) : (
                      !hideIndicator && (
                        <View
                          style={[
                            styles.indicator,
                            {
                              backgroundColor: indicatorColor,
                              borderColor: indicatorColor,
                            },
                            indicator === 'dot' && styles.indicatorDot,
                            indicator === 'line' && styles.indicatorLine,
                            indicator === 'dashed' && styles.indicatorDashed,
                          ]}
                        />
                      )
                    )}
                    <View style={styles.tooltipItemContent}>
                      <View style={styles.tooltipItemLabelContainer}>
                        {nestLabel ? tooltipLabel : null}
                        <Text
                          style={[
                            styles.itemLabel,
                            { color: theme.colors.onSurfaceVariant },
                          ]}
                        >
                          {itemConfig?.label || item.name}
                        </Text>
                      </View>
                      {item.value !== undefined && (
                        <Text
                          style={[
                            styles.itemValue,
                            { color: theme.colors.onSurface },
                          ]}
                        >
                          {item.value.toLocaleString()}
                        </Text>
                      )}
                    </View>
                  </>
                )}
              </View>
            );
          })}
        </View>
      </View>
    );
  },
);
ChartTooltipContent.displayName = 'ChartTooltipContent';

// --- Legend Components ---

interface ChartLegendContentProps {
  payload?: any[];
  verticalAlign?: 'top' | 'bottom';
  hideIcon?: boolean;
  nameKey?: string;
  style?: ViewStyle;
}

const ChartLegendContent = React.forwardRef<View, ChartLegendContentProps>(
  (
    { payload, verticalAlign = 'bottom', hideIcon = false, nameKey, style },
    ref,
  ) => {
    const { config } = useChart();
    const theme = useTheme();

    if (!payload?.length) return null;

    return (
      <View
        ref={ref}
        style={[
          styles.legendContainer,
          verticalAlign === 'top' ? { paddingBottom: 12 } : { paddingTop: 12 },
          style,
        ]}
      >
        {payload.map((item, i) => {
          const key = `${nameKey || item.dataKey || 'value'}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);

          return (
            <View key={i} style={styles.legendItem}>
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon size={12} color={item.color} />
              ) : (
                <View
                  style={[
                    styles.legendIndicator,
                    { backgroundColor: item.color },
                  ]}
                />
              )}
              <Text
                style={[
                  styles.legendLabel,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {itemConfig?.label}
              </Text>
            </View>
          );
        })}
      </View>
    );
  },
);
ChartLegendContent.displayName = 'ChartLegendContent';

// --- Helpers ---

function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string,
) {
  if (typeof payload !== 'object' || payload === null) {
    return undefined;
  }

  const payloadPayload =
    'payload' in payload &&
    typeof payload.payload === 'object' &&
    payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey: string = key;

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === 'string'
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === 'string'
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string;
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config];
}

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 16 / 9,
    justifyContent: 'center',
  },
  tooltipContainer: {
    minWidth: 128,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    // shadow-xl equivalent
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  tooltipItems: {
    gap: 6,
  },
  tooltipItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  indicator: {
    borderRadius: 2,
  },
  indicatorDot: {
    width: 10,
    height: 10,
  },
  indicatorLine: {
    width: 4,
    height: 10,
  },
  indicatorDashed: {
    width: 0,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    backgroundColor: 'transparent',
  },
  tooltipItemContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tooltipItemLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itemLabel: {
    fontSize: 12,
  },
  itemValue: {
    fontSize: 12,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
    marginLeft: 12,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendIndicator: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  legendLabel: {
    fontSize: 12,
  },
});

// For compatibility with imports, though specialized wrapper components are usually preferred in RN
const ChartTooltip = View;
const ChartLegend = View;

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
};
