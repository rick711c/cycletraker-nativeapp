import { MD3LightTheme, configureFonts } from 'react-native-paper';

// --- Color Palette (Converted from HSL to Hex) ---

// Primary: hsl(333, 71%, 50%) -> #D92581
const primaryMain = '#D92581';
// Primary Light: hsl(328, 85%, 70%) -> #F071AA
const primaryLight = '#F071AA';
// Primary Contrast: hsl(327, 73%, 97%) -> #FDF2F7
const primaryContrast = '#FDF2F7';

// Secondary: hsl(240, 5%, 33%) -> #505055
const secondaryMain = '#505055';
// Secondary Contrast: hsl(0, 0%, 98%) -> #FAFAFA
const secondaryContrast = '#FAFAFA';

// Error: hsl(0, 72%, 50%) -> #DB2424
const errorMain = '#DB2424';

// Backgrounds
// Default: hsl(240, 4%, 95%) -> #F2F2F3
const backgroundDefault = '#F2F2F3';
// Paper: hsl(0, 0%, 98%) -> #FAFAFA
const backgroundPaper = '#FAFAFA';

// Text
// Primary: hsl(240, 5%, 10%) -> #18181B
const textPrimary = '#18181B';
// Divider: hsl(240, 4%, 83%) -> #D4D4D6
const dividerColor = '#D4D4D6';

// --- Custom Colors for App Logic ---

export const cyclePhaseColors = {
  menstruation: '#D92581', // primary
  follicular: '#F7A5CE',   // chart-3: hsl(327, 87%, 81%)
  ovulation: '#FC6F83',    // chart-2: hsl(351, 94%, 71%)
  luteal: '#FCA0AA',       // chart-4: hsl(352, 95%, 81%)
};

export const chartColors = {
  chart1: '#F071AA', // hsl(328, 85%, 70%)
  chart2: '#FC6F83', // hsl(351, 94%, 71%)
  chart3: '#F7A5CE', // hsl(327, 87%, 81%)
  chart4: '#FCA0AA', // hsl(352, 95%, 81%)
  chart5: '#757579', // hsl(240, 3%, 46%)
};

// --- Font Configuration ---

const fontConfig = {
  fontFamily: 'System', // Use 'System' for native look, or a custom font like 'Poppins' if linked
};

// --- Theme Definition ---

export const floraTheme = {
  ...MD3LightTheme,
  fonts: configureFonts({ config: fontConfig }),
  roundness: 3, // Matches borderRadius: 12 approx (MD3 base is 4, 3*4=12)
  colors: {
    ...MD3LightTheme.colors,
    primary: primaryMain,
    onPrimary: '#FFFFFF',
    primaryContainer: primaryContrast,
    onPrimaryContainer: primaryMain,
    
    secondary: secondaryMain,
    onSecondary: '#FFFFFF',
    secondaryContainer: secondaryContrast, // Using paper bg as container approx
    onSecondaryContainer: secondaryMain,
    
    background: backgroundDefault,
    onBackground: textPrimary,
    
    surface: backgroundPaper,
    onSurface: textPrimary,
    surfaceVariant: '#EDEEF0', // Slightly darker than surface for cards/inputs
    onSurfaceVariant: '#44444F', // Muted text
    
    error: errorMain,
    onError: '#FFFFFF',
    
    outline: dividerColor,
    outlineVariant: dividerColor,
    
    // Custom properties often mapped to elevation/elevation levels in Paper,
    // but specific palette slots can be used for custom logic
  },
};