import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from '../components/ui/Icon';
import { MobileLayout } from '../components/layout/MobileLayout';
import { CycleHistory } from '../components/cycle/CycleHistory';

export default function CycleHistoryPage() {
  const theme = useTheme();
  const navigation = useNavigation();

  return (
    <MobileLayout>
      <View style={styles.container}>
        {/* Top bar with back button */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: theme.colors.surfaceVariant }]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Icon icon="arrow-left" size={22} color={theme.colors.onSurface} />
          </TouchableOpacity>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
            Cycle History
          </Text>
          <View style={{ width: 40 }} />
        </View>

        {/* CycleHistory component */}
        <CycleHistory />
      </View>
    </MobileLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
