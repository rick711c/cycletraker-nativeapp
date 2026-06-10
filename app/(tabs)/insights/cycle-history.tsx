import { CycleHistory } from "@/src/components/cycle/CycleHistory";
import Icon from "@/src/components/ui/Icon";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

export default function CycleHistoryScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={styles.container}
    >
      <View style={styles.topBar}>
        <TouchableOpacity
          style={[
            styles.backButton,
            { backgroundColor: theme.colors.surfaceVariant },
          ]}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Icon icon="arrow-left" size={22} color={theme.colors.onSurface} />
        </TouchableOpacity>
        <Text
          variant="titleMedium"
          style={{ color: theme.colors.onSurface, fontWeight: "600" }}
        >
          Cycle History
        </Text>
        <View style={{ width: 40 }} />
      </View>
      <CycleHistory />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 16, paddingBottom: 24 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
