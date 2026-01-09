import * as React from "react";
import { View, ViewStyle, TextStyle, StyleSheet } from "react-native";
import { Controller, ControllerProps, FieldPath, FieldValues, FormProvider, useFormContext } from "react-hook-form";
import { Text, useTheme } from "react-native-paper";

// Re-export FormProvider as Form
const Form = FormProvider;

// --- Contexts ---

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);

// --- Hooks ---

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const fieldState = getFieldState(fieldContext.name, formState);
  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

// --- Components ---

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const FormItem = React.forwardRef<View, React.ComponentProps<typeof View>>(
  ({ style, ...props }, ref) => {
    const id = React.useId();

    return (
      <FormItemContext.Provider value={{ id }}>
        <View ref={ref} style={[styles.spaceY2, style]} {...props} />
      </FormItemContext.Provider>
    );
  },
);
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<any, React.ComponentProps<typeof Text>>(
  ({ style, children, ...props }, ref) => {
    const { error } = useFormField();
    const theme = useTheme();

    return (
      <Text
        ref={ref}
        variant="labelMedium"
        style={[
          styles.label,
          { color: error ? theme.colors.error : theme.colors.onSurface },
          style,
        ]}
        {...props}
      >
        {children}
      </Text>
    );
  },
);
FormLabel.displayName = "FormLabel";

// In React Native, we don't use Slot generally. 
// FormControl simply passes the logic down or renders children.
// If you need to attach accessibility props to the input child, you might need React.cloneElement here,
// but usually the Controller render prop handles the connection.
const FormControl = React.forwardRef<View, React.ComponentProps<typeof View>>(
  ({ ...props }, ref) => {
    const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

    // Since we can't easily merge props into arbitrary children in RN without cloneElement and specific prop knowledge,
    // FormControl in RN often acts as a pass-through or a wrapper.
    // Here we render it as a View wrapper to ensure layout structure.
    return (
      <View
        ref={ref}
        nativeID={formItemId}
        accessibilityLabel={props["aria-label"]}
        accessibilityHint={props["aria-describedby"]}
        {...props}
      />
    );
  },
);
FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef<any, React.ComponentProps<typeof Text>>(
  ({ style, ...props }, ref) => {
    const { formDescriptionId } = useFormField();
    const theme = useTheme();

    return (
      <Text
        ref={ref}
        nativeID={formDescriptionId}
        variant="bodySmall"
        style={[{ color: theme.colors.onSurfaceVariant }, style]}
        {...props}
      />
    );
  },
);
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef<any, React.ComponentProps<typeof Text>>(
  ({ style, children, ...props }, ref) => {
    const { error, formMessageId } = useFormField();
    const theme = useTheme();
    const body = error ? String(error?.message) : children;

    if (!body) {
      return null;
    }

    return (
      <Text
        ref={ref}
        nativeID={formMessageId}
        variant="bodySmall"
        style={[{ color: theme.colors.error, fontWeight: '500' }, style]}
        {...props}
      >
        {body}
      </Text>
    );
  },
);
FormMessage.displayName = "FormMessage";

// --- Styles ---
const styles = StyleSheet.create({
  spaceY2: {
    marginBottom: 8, // space-y-2
  },
  label: {
    fontWeight: '600',
    marginBottom: 4,
  }
});

export { useFormField, Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField };