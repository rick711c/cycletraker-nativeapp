import Icon from "@/src/components/ui/Icon";
import { PRIVACY_URL } from "@/src/constants";
import { clearAllData } from "@/src/db/database";
import { hapticLight, hapticWarning } from "@/src/lib/haptics";
import { cancelAllNotifications } from "@/src/notifications/notificationService";
import { useAppDispatch, useAppSelector } from "@/src/store";
import {
    selectSettings,
    setOnboarded,
    updateSettingsRequest,
} from "@/src/store/cycleSlice";
import { useRouter } from "expo-router";
import * as LocalAuthentication from "expo-local-authentication";
import "expo-sqlite/localStorage/install";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Linking,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import {
    Card,
    Divider,
    Portal,
    Snackbar,
    Switch,
    Text,
    useTheme,
} from "react-native-paper";

export default function SettingsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectSettings);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  useEffect(() => {
    (async () => {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      setBiometricAvailable(hasHardware && isEnrolled);
    })();
  }, []);

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleToggleAppLock = async () => {
    hapticLight();
    if (!settings.appLockEnabled) {
      // Turning ON — verify biometric first
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Verify to enable app lock",
        disableDeviceFallback: false,
      });
      if (!result.success) {
        showSnackbar("Authentication failed. App lock was not enabled.");
        return;
      }
    }
    dispatch(
      updateSettingsRequest({ appLockEnabled: !settings.appLockEnabled }),
    );
  };

  const handleReset = () => {
    Alert.alert(
      "Clear All Data",
      "Are you sure you want to delete all your data permanently? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              hapticWarning();
              await clearAllData();
              localStorage.clear();
              await cancelAllNotifications();
              dispatch(setOnboarded(false));
              router.replace("/privacy-consent");
            } catch (error) {
              console.error("Failed to clear data", error);
            }
          },
        },
      ],
    );
  };

  const settingsGroups = [
    {
      title: "Security",
      items: [
        {
          icon: "fingerprint",
          label: "App Lock",
          description: biometricAvailable
            ? "Require biometric to open Flora"
            : "No biometric enrolled on this device",
          type: "toggle" as const,
          value: settings.appLockEnabled,
          onChange: handleToggleAppLock,
          disabled: !biometricAvailable,
        },
      ],
    },
    {
      title: "Notifications",
      items: [
        {
          icon: "bell-outline",
          label: "Period Reminders",
          description: "Get notified before your period",
          type: "toggle" as const,
          value: settings.notificationsEnabled,
          onChange: () => {
            hapticLight();
            dispatch(
              updateSettingsRequest({
                notificationsEnabled: !settings.notificationsEnabled,
              }),
            );
          },
        },
      ],
    },
    {
      title: "Data",
      items: [
        {
          icon: "download",
          label: "Export Data",
          description: "Download your health data",
          type: "link" as const,
          onClick: () => showSnackbar("Coming soon!"),
        },
        {
          icon: "delete",
          label: "Clear All Data",
          description: "Delete all your data permanently",
          type: "danger" as const,
          onClick: handleReset,
        },
      ],
    },
    {
      title: "Legal",
      items: [
        {
          icon: "shield-check-outline",
          label: "Privacy Policy",
          description: "View our privacy policy",
          type: "link" as const,
          onClick: () => Linking.openURL(PRIVACY_URL),
        },
      ],
    },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={styles.container}
    >
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.headerTitle}>
          Settings
        </Text>
        <Text
          variant="bodyMedium"
          style={{ color: theme.colors.onSurfaceVariant }}
        >
          Customize your experience
        </Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Cycle Settings
          </Text>
          <View style={styles.settingRow}>
            <View>
              <Text variant="bodyLarge" style={styles.settingLabel}>
                Cycle Length
              </Text>
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                Average days
              </Text>
            </View>
            <Text
              variant="titleLarge"
              style={{ color: theme.colors.primary, fontWeight: "700" }}
            >
              {settings.averageCycleLength}
            </Text>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.settingRow}>
            <View>
              <Text variant="bodyLarge" style={styles.settingLabel}>
                Period Length
              </Text>
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                Average days
              </Text>
            </View>
            <Text
              variant="titleLarge"
              style={{ color: theme.colors.primary, fontWeight: "700" }}
            >
              {settings.averagePeriodLength}
            </Text>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.settingRow}>
            <View>
              <Text variant="bodyLarge" style={styles.settingLabel}>
                Goal
              </Text>
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                Your tracking focus
              </Text>
            </View>
            <Text
              variant="bodyLarge"
              style={{
                color: theme.colors.onSurfaceVariant,
                fontWeight: "500",
                textTransform: "capitalize",
              }}
            >
              {settings.goal}
            </Text>
          </View>
        </Card.Content>
      </Card>

      {settingsGroups.map((group) => (
        <Card key={group.title} style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              {group.title}
            </Text>
            {group.items.map((item, index) => {
              const isClickable =
                item.type === "link" || item.type === "danger";
              const iconColor =
                item.type === "danger"
                  ? theme.colors.error
                  : theme.colors.onSurfaceVariant;
              const iconBg =
                item.type === "danger"
                  ? theme.colors.errorContainer
                  : theme.colors.surfaceVariant;
              const textColor =
                item.type === "danger"
                  ? theme.colors.error
                  : theme.colors.onSurface;

              const Content = (
                <View style={[styles.itemRow, { paddingVertical: 8 }]}>
                  <View style={styles.itemLeft}>
                    <View
                      style={[
                        styles.iconContainer,
                        { backgroundColor: iconBg },
                      ]}
                    >
                      <Icon icon={item.icon} size={20} color={iconColor} />
                    </View>
                    <View style={styles.textContainer}>
                      <Text
                        variant="bodyLarge"
                        style={{ fontWeight: "500", color: textColor }}
                      >
                        {item.label}
                      </Text>
                      <Text
                        variant="bodySmall"
                        style={{ color: theme.colors.onSurfaceVariant }}
                      >
                        {item.description}
                      </Text>
                    </View>
                  </View>
                  {item.type === "toggle" && (
                    <Switch
                      value={item.value}
                      onValueChange={item.onChange}
                      color={theme.colors.primary}
                      disabled={"disabled" in item && item.disabled}
                    />
                  )}
                  {(item.type === "link" || item.type === "danger") && (
                    <Icon
                      icon="chevron-right"
                      size={24}
                      color={theme.colors.onSurfaceVariant}
                    />
                  )}
                </View>
              );

              return (
                <View key={item.label}>
                  {isClickable ? (
                    <TouchableOpacity onPress={item.onClick}>
                      {Content}
                    </TouchableOpacity>
                  ) : (
                    Content
                  )}
                  {index < group.items.length - 1 && (
                    <Divider style={styles.divider} />
                  )}
                </View>
              );
            })}
          </Card.Content>
        </Card>
      ))}

      <View style={styles.footer}>
        <View style={styles.brandContainer}>
          <Icon icon="flower" size={20} color={theme.colors.primary} />
          <Text variant="titleMedium" style={styles.brandText}>
            Flora
          </Text>
        </View>
        <Text
          variant="bodySmall"
          style={{ color: theme.colors.onSurfaceVariant }}
        >
          Version 1.0.0
        </Text>
        <Text
          variant="labelSmall"
          style={{ color: theme.colors.onSurfaceVariant }}
        >
          Your cycle, your data, your privacy.
        </Text>
      </View>

      <Portal>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          action={{ label: "OK", onPress: () => setSnackbarVisible(false) }}
        >
          {snackbarMessage}
        </Snackbar>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingTop: 24, paddingBottom: 40 },
  header: { marginBottom: 24 },
  headerTitle: { fontWeight: "700" },
  card: { marginBottom: 16 },
  sectionTitle: { fontWeight: "600", marginBottom: 16 },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  settingLabel: { fontWeight: "500" },
  divider: { marginVertical: 8 },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  textContainer: { flex: 1 },
  footer: { alignItems: "center", paddingVertical: 24, gap: 4 },
  brandContainer: { flexDirection: "row", alignItems: "center", gap: 8 },
  brandText: { fontWeight: "700" },
});
