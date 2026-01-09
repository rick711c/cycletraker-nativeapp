import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Icon, Text, useTheme, Divider, Portal } from 'react-native-paper';

// --- Context ---
interface CommandContextType {
  search: string;
  setSearch: (text: string) => void;
  filter: (value: string, search: string) => boolean;
}

const CommandContext = createContext<CommandContextType | undefined>(undefined);

// Default fuzzy search-like filter (simple includes for RN)
const defaultFilter = (value: string, search: string) => {
  return value.toLowerCase().includes(search.toLowerCase());
};

// --- Components ---

interface CommandProps {
  children: React.ReactNode;
  filter?: (value: string, search: string) => boolean;
  style?: ViewStyle;
}

const Command = React.forwardRef<View, CommandProps>(
  ({ children, filter = defaultFilter, style }, ref) => {
    const [search, setSearch] = useState('');
    const theme = useTheme();

    return (
      <CommandContext.Provider value={{ search, setSearch, filter }}>
        <View
          ref={ref}
          style={[
            styles.command,
            { backgroundColor: theme.colors.elevation.level3 }, // bg-popover
            style,
          ]}
        >
          {children}
        </View>
      </CommandContext.Provider>
    );
  },
);
Command.displayName = 'Command';

interface CommandDialogProps extends CommandProps {
  visible: boolean;
  onDismiss: () => void;
}

const CommandDialog = ({
  children,
  visible,
  onDismiss,
  ...props
}: CommandDialogProps) => {
  const theme = useTheme();

  return (
    <Portal>
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={onDismiss}
      >
        <View style={styles.centeredView}>
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={onDismiss}
          />
          <View
            style={[
              styles.dialogContent,
              { backgroundColor: theme.colors.elevation.level3 },
            ]}
          >
            <Command {...props}>{children}</Command>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

interface CommandInputProps {
  placeholder?: string;
  style?: ViewStyle;
}

const CommandInput = React.forwardRef<TextInput, CommandInputProps>(
  ({ placeholder = 'Type a command or search...', style }, ref) => {
    const context = useContext(CommandContext);
    const theme = useTheme();

    if (!context) throw new Error('CommandInput must be used within Command');

    return (
      <View
        style={[
          styles.inputContainer,
          { borderBottomColor: theme.colors.outlineVariant },
        ]}
      >
        <Icon
          source="magnify"
          size={20}
          color={theme.colors.onSurfaceDisabled}
        />
        <TextInput
          ref={ref}
          value={context.search}
          onChangeText={context.setSearch}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.onSurfaceDisabled}
          style={[styles.input, { color: theme.colors.onSurface }, style]}
        />
      </View>
    );
  },
);
CommandInput.displayName = 'CommandInput';

const CommandList = React.forwardRef<
  ScrollView,
  React.ComponentProps<typeof ScrollView>
>(({ style, children, ...props }, ref) => {
  return (
    <ScrollView
      ref={ref}
      style={[styles.list, style]}
      keyboardShouldPersistTaps="handled"
      {...props}
    >
      {children}
    </ScrollView>
  );
});
CommandList.displayName = 'CommandList';

const CommandEmpty = React.forwardRef<View, React.ComponentProps<typeof View>>(
  ({ style, children, ...props }, ref) => {
    // Note: Implementing true "empty state" logic automatically is complex in React Native
    // without a centralized data store because we can't easily count visible children.
    // Consumers should conditionally render this based on their own filtered data length if possible,
    // or we render it and let the consumer handle the logic.
    return (
      <View ref={ref} style={[styles.empty, style]} {...props}>
        {typeof children === 'string' ? (
          <Text style={styles.emptyText}>{children}</Text>
        ) : (
          children
        )}
      </View>
    );
  },
);
CommandEmpty.displayName = 'CommandEmpty';

interface CommandGroupProps {
  heading?: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

const CommandGroup = React.forwardRef<View, CommandGroupProps>(
  ({ heading, children, style }, ref) => {
    const theme = useTheme();
    return (
      <View ref={ref} style={[styles.group, style]}>
        {heading && (
          <Text
            variant="labelSmall"
            style={[
              styles.groupHeading,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {heading}
          </Text>
        )}
        <View>{children}</View>
      </View>
    );
  },
);
CommandGroup.displayName = 'CommandGroup';

const CommandSeparator = React.forwardRef<
  View,
  React.ComponentProps<typeof View>
>(({ style, ...props }, ref) => {
  return <Divider style={[styles.separator, style]} {...props} />;
});
CommandSeparator.displayName = 'CommandSeparator';

interface CommandItemProps {
  value: string; // Required for filtering
  onSelect?: (value: string) => void;
  children: React.ReactNode;
  style?: ViewStyle;
}

const CommandItem = React.forwardRef< typeof TouchableOpacity, CommandItemProps>(
  ({ value, onSelect, children, style }, ref) => {
    const context = useContext(CommandContext);
    const theme = useTheme();

    if (!context) throw new Error('CommandItem must be used within Command');

    // Filter logic
    if (context.search && !context.filter(value, context.search)) {
      return null;
    }

    return (
      <TouchableOpacity
        ref={ref}
        onPress={() => onSelect?.(value)}
        style={[styles.item, style]}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  },
);
CommandItem.displayName = 'CommandItem';

const CommandShortcut = ({
  style,
  children,
}: {
  style?: TextStyle;
  children: React.ReactNode;
}) => {
  const theme = useTheme();
  return (
    <Text
      style={[styles.shortcut, { color: theme.colors.onSurfaceVariant }, style]}
    >
      {children}
    </Text>
  );
};
CommandShortcut.displayName = 'CommandShortcut';

// --- Styles ---

const styles = StyleSheet.create({
  command: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 8,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dialogContent: {
    width: '100%',
    maxHeight: '80%',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },
  input: {
    flex: 1,
    height: 48, // h-12
    paddingHorizontal: 8,
    fontSize: 14, // text-sm
  },
  list: {
    maxHeight: 300,
  },
  empty: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  group: {
    padding: 4,
  },
  groupHeading: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontWeight: '500',
  },
  separator: {
    marginVertical: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8, // py-2 approx
    borderRadius: 4,
  },
  shortcut: {
    marginLeft: 'auto',
    fontSize: 12, // text-xs
    letterSpacing: 1, // tracking-widest
  },
});

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
