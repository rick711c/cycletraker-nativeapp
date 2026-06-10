import Icon from "@/src/components/ui/Icon";
import {
    PRIVACY_STORAGE_KEY,
    PRIVACY_URL,
    PRIVACY_VERSION,
} from "@/src/constants";
import { hapticLight, hapticSuccess } from "@/src/lib/haptics";
import { useRouter } from "expo-router";
import "expo-sqlite/localStorage/install";
import React, { useState } from "react";
import { Linking, ScrollView, StyleSheet, View } from "react-native";
import { Button, Checkbox, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePrivacy } from "./_layout";

export default function PrivacyConsentScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { markPrivacyAccepted } = usePrivacy();
  const [accepted, setAccepted] = useState(false);

  const toggleAccepted = () => {
    hapticLight();
    setAccepted(!accepted);
  };

  const handleContinue = () => {
    hapticSuccess();
    localStorage.setItem(PRIVACY_STORAGE_KEY, PRIVACY_VERSION);
    markPrivacyAccepted();
    router.replace("/(tabs)");
  };

  const openPrivacyPolicy = () => {
    Linking.openURL(PRIVACY_URL).catch(() => {});
  };

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView style={styles.root} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Icon
            icon="shield-lock-outline"
            size={48}
            color={theme.colors.primary}
          />
          <Text
            variant="headlineSmall"
            style={[styles.title, { color: theme.colors.onBackground }]}
          >
            Your Privacy Matters
          </Text>
          <Text
            variant="bodyMedium"
            style={{
              color: theme.colors.onSurfaceVariant,
              textAlign: "center",
            }}
          >
            Flora is a 100% offline app. Please review our privacy practices
            before continuing.
          </Text>
        </View>

        <View
          style={[
            styles.highlightCard,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <HighlightRow
            icon="cloud-off-outline"
            title="No Cloud, No Servers"
            description="All your data stays on this device. We never upload anything."
            color={theme.colors.primary}
            theme={theme}
          />
          <HighlightRow
            icon="eye-off-outline"
            title="Zero Data Collection"
            description="We don't collect, sell, or share any personal or health data."
            color={theme.colors.primary}
            theme={theme}
          />
          <HighlightRow
            icon="lock-outline"
            title="Your Data, Your Control"
            description="No analytics, no trackers, no ads. Complete privacy."
            color={theme.colors.primary}
            theme={theme}
          />
        </View>

        <View
          style={[
            styles.warningBox,
            { backgroundColor: `${theme.colors.error}14` },
          ]}
        >
          <View style={styles.warningHeader}>
            <Icon
              icon="alert-circle-outline"
              size={22}
              color={theme.colors.error}
            />
            <Text
              variant="titleSmall"
              style={{
                color: theme.colors.error,
                fontWeight: "700",
                marginLeft: 8,
              }}
            >
              Important Warning
            </Text>
          </View>
          <Text
            variant="bodyMedium"
            style={{
              color: theme.colors.onSurface,
              marginTop: 8,
              lineHeight: 22,
            }}
          >
            Your data lives only on this phone.{" "}
            <Text style={{ fontWeight: "700" }}>
              Uninstalling the app or clearing app storage will permanently
              delete all your health records.
            </Text>{" "}
            This action cannot be undone.
          </Text>
        </View>

        <View style={styles.checkboxRow}>
          <Checkbox.Android
            status={accepted ? "checked" : "unchecked"}
            onPress={toggleAccepted}
            color={theme.colors.primary}
          />
          <Text
            variant="bodyMedium"
            style={[styles.checkboxLabel, { color: theme.colors.onSurface }]}
          >
            I have read and agree to the{" "}
            <Text
              style={{
                color: theme.colors.primary,
                fontWeight: "600",
                textDecorationLine: "underline",
              }}
              onPress={openPrivacyPolicy}
            >
              Privacy Policy
            </Text>
          </Text>
        </View>

        <Button
          mode="contained"
          onPress={handleContinue}
          disabled={!accepted}
          contentStyle={styles.buttonContent}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          Continue
        </Button>

        <Text
          variant="labelSmall"
          style={[styles.footerText, { color: theme.colors.onSurfaceVariant }]}
        >
          You can review the privacy policy anytime from Settings.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function HighlightRow({
  icon,
  title,
  description,
  color,
  theme,
}: {
  icon: string;
  title: string;
  description: string;
  color: string;
  theme: any;
}) {
  return (
    <View style={styles.highlightRow}>
      <View style={[styles.highlightIcon, { backgroundColor: `${color}18` }]}>
        <Icon icon={icon} size={22} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          variant="bodyLarge"
          style={{ color: theme.colors.onSurface, fontWeight: "600" }}
        >
          {title}
        </Text>
        <Text
          variant="bodySmall"
          style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}
        >
          {description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: 24, paddingBottom: 48 },
  header: { alignItems: "center", marginBottom: 28, gap: 10 },
  title: { fontWeight: "700", marginTop: 8 },
  highlightCard: { borderRadius: 16, padding: 20, gap: 18, marginBottom: 20 },
  highlightRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  highlightIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  warningBox: { borderRadius: 14, padding: 16, marginBottom: 24 },
  warningHeader: { flexDirection: "row", alignItems: "center" },
  checkboxRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  checkboxLabel: { flex: 1, marginLeft: 4, lineHeight: 22 },
  button: { borderRadius: 12, marginBottom: 16 },
  buttonContent: { height: 52 },
  buttonLabel: { fontSize: 16, fontWeight: "600" },
  footerText: { textAlign: "center" },
});
