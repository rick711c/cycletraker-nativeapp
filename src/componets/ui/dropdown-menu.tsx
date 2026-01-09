import React, { createContext, useContext, useState } from 'react';
import { View, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { Menu, Divider, Text, useTheme, Portal } from 'react-native-paper';

// --- Context ---
interface DropdownMenuContextType {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  openMenu: () => void;
  closeMenu: () => void;
  anchorLayout: { x: number; y: number; width: number; height: number } | null;
  setAnchorLayout: (layout: any) => void;
}

const DropdownMenuContext = createContext<DropdownMenuContextType | undefined>(undefined);

// --- Components ---

const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [anchorLayout, setAnchorLayout] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <DropdownMenuContext.Provider value={{ visible, setVisible, openMenu, closeMenu, anchorLayout, setAnchorLayout }}>
      <View style={{ position: 'relative' }}>
        {children}
      </View>
    </DropdownMenuContext.Provider>
  );
};

const DropdownMenuTrigger = ({ 
  children, 
  asChild, 
  style 
}: { 
  children: React.ReactNode; 
  asChild?: boolean; 
  style?: ViewStyle 
}) => {
  const context = useContext(DropdownMenuContext);
  if (!context) throw new Error("DropdownMenuTrigger must be used within DropdownMenu");

  // We need to capture layout to anchor the menu properly if we aren't using the Menu's anchor prop directly 
  // with a React node. However, Paper's Menu anchor is best used with a ref or a component.
  // Here we wrap the trigger in a View that measures itself, or simply wrap the touchable.
  
  // Actually, Paper's Menu 'anchor' can be a coordinate or a React node. 
  // To make it simple in this structure, we'll assume the Trigger renders the button 
  // and we'll attach the Menu logic to it or simply use the context to toggle.
  // But Paper's Menu needs the anchor ELEMENT to position itself.
  
  // Strategy: We will render the Trigger. The Content component (Menu) needs to be anchored to this trigger.
  // In React Native Paper, the Menu wraps the anchor usually. 
  // To adapt to the separate Trigger/Content API of Shadcn, we might need to adjust.
  
  // Better Approach for separate components:
  // The `DropdownMenuTrigger` renders the button. 
  // The `DropdownMenuContent` renders the `Menu` but it needs to know WHERE to render.
  // We can use `onLayout` on the Trigger to get coordinates, or pass a ref.

  // Simplified for this conversion: We will render the children wrapped in a Touchable that toggles state.
  // The `DropdownMenuContent` will be a Portal-based menu or similar. 
  // Paper's `Menu` requires an `anchor` prop which is usually the button component itself.
  
  // Implementation: We'll use a ref stored in context (not ideal for strict types) or just a layout object.
  // Let's stick to the `Menu` component wrapping the trigger approach if possible? 
  // No, Shadcn separates them. So we will use a View as a container for the trigger and measure it.

  const [anchorRef, setAnchorRef] = useState<View | null>(null);

  return (
    <View 
      ref={(ref) => setAnchorRef(ref)}
      collapsable={false}
      style={style}
    >
       <TouchableOpacity onPress={context.openMenu} activeOpacity={0.7}>
         {children}
       </TouchableOpacity>
       {/* Store the anchor ref/layout if we were doing advanced positioning. 
           However, Paper Menu is easiest when it wraps the anchor.
           Since we can't easily wrap "Trigger" and "Content" together in the user's JSX 
           (they might be siblings), we'll cheat slightly:
           We will use the layout of this Trigger View as the anchor coordinates for the Menu.
       */}
       <LayoutTracker onLayout={(layout) => context.setAnchorLayout(layout)} />
    </View>
  );
};

// Helper to get layout
const LayoutTracker = ({ onLayout }: { onLayout: (layout: any) => void }) => {
    return (
        <View 
            onLayout={(e) => {
                e.target.measure((x, y, width, height, pageX, pageY) => {
                    onLayout({ x: pageX, y: pageY, width, height });
                })
            }} 
            style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0 }} 
        />
    )
}


const DropdownMenuPortal = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const DropdownMenuContent = ({ 
  children, 
  style, 
  sideOffset = 4 
}: { 
  children: React.ReactNode; 
  style?: ViewStyle;
  sideOffset?: number;
}) => {
  const context = useContext(DropdownMenuContext);
  const theme = useTheme();

  if (!context) throw new Error("DropdownMenuContent must be used within DropdownMenu");

  // Paper Menu requires coordinate object { x, y } if not anchoring to a component instance.
  // We use the layout from the trigger.
  const anchor = context.anchorLayout 
    ? { x: context.anchorLayout.x, y: context.anchorLayout.y + context.anchorLayout.height + sideOffset }
    : { x: 0, y: 0 };

  return (
    <Portal>
      <Menu
        visible={context.visible}
        onDismiss={context.closeMenu}
        anchor={anchor}
        contentStyle={[{ backgroundColor: theme.colors.elevation.level2, minWidth: 200 }, style]}
      >
        {children}
      </Menu>
    </Portal>
  );
};

const DropdownMenuItem = ({ 
  children, 
  onSelect, 
  inset, 
  disabled, 
  style 
}: { 
  children: React.ReactNode; 
  onSelect?: () => void; 
  inset?: boolean; 
  disabled?: boolean; 
  style?: ViewStyle;
}) => {
  const context = useContext(DropdownMenuContext);
  
  return (
    <Menu.Item
      onPress={() => {
        onSelect?.();
        context?.closeMenu();
      }}
      title={children}
      disabled={disabled}
      contentStyle={[inset && { paddingLeft: 32 }, style]}
      dense
    />
  );
};

const DropdownMenuCheckboxItem = ({ 
  children, 
  checked, 
  onSelect, 
  disabled, 
  style 
}: { 
  children: React.ReactNode; 
  checked?: boolean; 
  onSelect?: () => void; 
  disabled?: boolean; 
  style?: ViewStyle;
}) => {
  const context = useContext(DropdownMenuContext);

  return (
    <Menu.Item
      onPress={() => {
        onSelect?.();
        context?.closeMenu();
      }}
      title={children}
      disabled={disabled}
      leadingIcon={checked ? 'check' : undefined}
      contentStyle={style}
      dense
    />
  );
};

const DropdownMenuRadioItem = ({ 
  children, 
  checked, 
  onSelect, 
  disabled, 
  style 
}: { 
  children: React.ReactNode; 
  checked?: boolean; 
  onSelect?: () => void; 
  disabled?: boolean; 
  style?: ViewStyle;
}) => {
  const context = useContext(DropdownMenuContext);

  return (
    <Menu.Item
      onPress={() => {
        onSelect?.();
        context?.closeMenu();
      }}
      title={children}
      disabled={disabled}
      leadingIcon={checked ? 'circle-medium' : undefined}
      contentStyle={style}
      dense
    />
  );
};

const DropdownMenuLabel = ({ 
  children, 
  inset, 
  style 
}: { 
  children: React.ReactNode; 
  inset?: boolean; 
  style?: TextStyle;
}) => {
  const theme = useTheme();
  return (
    <Text
      variant="labelSmall"
      style={[
        { 
          paddingHorizontal: 16, 
          paddingVertical: 8, 
          color: theme.colors.onSurfaceVariant,
          fontWeight: '600'
        },
        inset && { paddingLeft: 32 },
        style
      ]}
    >
      {children}
    </Text>
  );
};

const DropdownMenuSeparator = ({ style }: { style?: ViewStyle }) => {
  return <Divider style={[{ marginVertical: 4 }, style]} />;
};

const DropdownMenuShortcut = ({ 
  children, 
  style 
}: { 
  children: React.ReactNode; 
  style?: TextStyle;
}) => {
  const theme = useTheme();
  return (
    <Text style={[{ marginLeft: 'auto', fontSize: 12, color: theme.colors.onSurfaceVariant }, style]}>
      {children}
    </Text>
  );
};

// --- Submenu Stubs ---
// Similar limitation as ContextMenu: Submenus are flattened or simple placeholders.

const DropdownMenuGroup = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const DropdownMenuSub = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const DropdownMenuSubTrigger = ({ 
  children, 
  inset, 
  disabled 
}: { 
  children: React.ReactNode; 
  inset?: boolean; 
  disabled?: boolean;
}) => {
  return (
    <Menu.Item
      onPress={() => {}}
      title={children}
      disabled={disabled}
      trailingIcon="chevron-right"
      contentStyle={inset ? { paddingLeft: 32 } : undefined}
      dense
    />
  );
};

const DropdownMenuSubContent = ({ children }: { children: React.ReactNode }) => null;

const DropdownMenuRadioGroup = ({ 
  children, 
  value, 
  onValueChange 
}: { 
  children: React.ReactNode; 
  value?: string; 
  onValueChange?: (val: string) => void; 
}) => {
  return (
    <>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            checked: child.props.value === value,
            onSelect: () => onValueChange?.(child.props.value),
          });
        }
        return child;
      })}
    </>
  );
};

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};