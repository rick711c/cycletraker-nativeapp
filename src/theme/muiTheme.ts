import {
    MD3DarkTheme,
    MD3LightTheme,
    configureFonts,
} from "react-native-paper";

const primaryMain = "#D92581";
const primaryLight = "#F071AA";
const primaryContrast = "#FDF2F7";
const secondaryMain = "#505055";
const secondaryContrast = "#FAFAFA";
const errorMain = "#DB2424";
const backgroundDefault = "#F2F2F3";
const backgroundPaper = "#FAFAFA";
const textPrimary = "#18181B";
const dividerColor = "#D4D4D6";

export const cyclePhaseColors = {
  menstruation: "#D92581",
  follicular: "#F7A5CE",
  ovulation: "#FC6F83",
  luteal: "#FCA0AA",
};

export const chartColors = {
  chart1: "#F071AA",
  chart2: "#FC6F83",
  chart3: "#F7A5CE",
  chart4: "#FCA0AA",
  chart5: "#757579",
};

const fontConfig = {
  fontFamily: "System",
};

export const floraLightTheme = {
  ...MD3LightTheme,
  fonts: configureFonts({ config: fontConfig }),
  roundness: 3,
  colors: {
    ...MD3LightTheme.colors,
    primary: primaryMain,
    onPrimary: "#FFFFFF",
    primaryContainer: primaryContrast,
    onPrimaryContainer: primaryMain,
    secondary: secondaryMain,
    onSecondary: "#FFFFFF",
    secondaryContainer: secondaryContrast,
    onSecondaryContainer: secondaryMain,
    background: backgroundDefault,
    onBackground: textPrimary,
    surface: backgroundPaper,
    onSurface: textPrimary,
    surfaceVariant: "#EDEEF0",
    onSurfaceVariant: "#44444F",
    error: errorMain,
    onError: "#FFFFFF",
    outline: dividerColor,
    outlineVariant: dividerColor,
  },
};

export const floraDarkTheme = {
  ...MD3DarkTheme,
  fonts: configureFonts({ config: fontConfig }),
  roundness: 3,
  colors: {
    ...MD3DarkTheme.colors,
    primary: primaryMain,
    onPrimary: "#000000",
    primaryContainer: "#2B2B2B",
    onPrimaryContainer: primaryMain,
    secondary: secondaryMain,
    onSecondary: "#FFFFFF",
    secondaryContainer: "#2B2B2B",
    onSecondaryContainer: secondaryMain,
    background: "#0B0B0C",
    onBackground: "#EFEFF1",
    surface: "#121214",
    onSurface: "#EFEFF1",
    surfaceVariant: "#1E1E20",
    onSurfaceVariant: "#C6C6CC",
    error: errorMain,
    onError: "#000000",
    outline: "#2A2A2D",
    outlineVariant: "#2A2A2D",
  },
};
