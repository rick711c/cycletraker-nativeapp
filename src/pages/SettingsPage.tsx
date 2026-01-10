import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, Card, Switch, Divider, Avatar, Icon, useTheme, Snackbar, Portal } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { MobileLayout } from '../components/layout/MobileLayout';
import { useCycleStore } from '../hooks/useCycleStore';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function SettingsPage() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { settings, updateSettings, setOnboarded } = useCycleStore();
  
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleReset = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to delete all your data permanently? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              setOnboarded(false);
              // Reset navigation stack
              navigation.reset({
                index: 0,
                routes: [{ name: 'Onboarding' as never }],
              });
            } catch (error) {
              console.error('Failed to clear data', error);
            }
          },
        },
      ]
    );
  };

  const settingsGroups = [
    {
      title: 'Notifications',
      items: [
        {
          icon: 'bell-outline', // NotificationsIcon
          label: 'Period Reminders',
          description: 'Get notified before your period',
          type: 'toggle' as const,
          value: settings.notificationsEnabled,
          onChange: () => updateSettings({ notificationsEnabled: !settings.notificationsEnabled }),
        },
      ],
    },
    {
      title: 'Privacy',
      items: [
        {
          icon: 'lock-outline', // LockIcon
          label: 'App Lock',
          description: 'Require passcode to open',
          type: 'toggle' as const,
          value: false,
          onChange: () => showSnackbar('Coming soon!'),
        },
        {
          icon: 'theme-light-dark', // DarkModeIcon
          label: 'Discreet Mode',
          description: 'Hide sensitive notifications',
          type: 'toggle' as const,
          value: false,
          onChange: () => showSnackbar('Coming soon!'),
        },
      ],
    },
    {
      title: 'Data',
      items: [
        {
          icon: 'download', // DownloadIcon
          label: 'Export Data',
          description: 'Download your health data',
          type: 'link' as const,
          onClick: () => showSnackbar('Coming soon!'),
        },
        {
          icon: 'delete', // DeleteIcon
          label: 'Clear All Data',
          description: 'Delete all your data permanently',
          type: 'danger' as const,
          onClick: handleReset,
        },
      ],
    },
  ];

  return (
    <MobileLayout>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text variant="headlineSmall" style={styles.headerTitle}>
            Settings
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Customize your experience
          </Text>
        </View>

        {/* Cycle Settings */}
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
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  Average days
                </Text>
              </View>
              <Text variant="titleLarge" style={{ color: theme.colors.primary, fontWeight: '700' }}>
                {settings.averageCycleLength}
              </Text>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.settingRow}>
              <View>
                <Text variant="bodyLarge" style={styles.settingLabel}>
                  Period Length
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  Average days
                </Text>
              </View>
              <Text variant="titleLarge" style={{ color: theme.colors.primary, fontWeight: '700' }}>
                {settings.averagePeriodLength}
              </Text>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.settingRow}>
              <View>
                <Text variant="bodyLarge" style={styles.settingLabel}>
                  Goal
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  Your tracking focus
                </Text>
              </View>
              <Text 
                variant="bodyLarge" 
                style={{ color: theme.colors.onSurfaceVariant, fontWeight: '500', textTransform: 'capitalize' }}
              >
                {settings.goal}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Settings Groups */}
        {settingsGroups.map((group) => (
          <Card key={group.title} style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                {group.title}
              </Text>
              
              {group.items.map((item, index) => {
                // Determine interactivity
                const isClickable = item.type === 'link' || item.type === 'danger';
                
                // Color logic
                const iconColor = item.type === 'danger' ? theme.colors.error : theme.colors.onSurfaceVariant;
                const iconBg = item.type === 'danger' ? theme.colors.errorContainer : theme.colors.surfaceVariant;
                const textColor = item.type === 'danger' ? theme.colors.error : theme.colors.onSurface;

                const Content = (
                  <View style={[styles.itemRow, { paddingVertical: 8 }]}>
                    <View style={styles.itemLeft}>
                      <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
                        <Icon source={item.icon} size={20} color={iconColor} />
                      </View>
                      <View style={styles.textContainer}>
                        <Text variant="bodyLarge" style={{ fontWeight: '500', color: textColor }}>
                          {item.label}
                        </Text>
                        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                          {item.description}
                        </Text>
                      </View>
                    </View>
                    
                    {item.type === 'toggle' && (
                      <Switch 
                        value={item.value} 
                        onValueChange={item.onChange} 
                        color={theme.colors.primary} 
                      />
                    )}
                    
                    {(item.type === 'link' || item.type === 'danger') && (
                      <Icon source="chevron-right" size={24} color={theme.colors.onSurfaceVariant} />
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
                    {index < group.items.length - 1 && <Divider style={styles.divider} />}
                  </View>
                );
              })}
            </Card.Content>
          </Card>
        ))}

        {/* App Info */}
        <View style={styles.footer}>
          <View style={styles.brandContainer}>
            <Icon source="flower" size={20} color={theme.colors.primary} />
            <Text variant="titleMedium" style={styles.brandText}>
              Flora
            </Text>
          </View>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Version 1.0.0
          </Text>
          <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Your cycle, your data, your privacy.
          </Text>
        </View>

        {/* Feedback Snackbar */}
        <Portal>
          <Snackbar
            visible={snackbarVisible}
            onDismiss={() => setSnackbarVisible(false)}
            duration={3000}
            action={{
              label: 'OK',
              onPress: () => setSnackbarVisible(false),
            }}
          >
            {snackbarMessage}
          </Snackbar>
        </Portal>
      </ScrollView>
    </MobileLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontWeight: '700',
  },
  card: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingLabel: {
    fontWeight: '500',
  },
  divider: {
    marginVertical: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 16,
    gap: 4,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  brandText: {
    fontWeight: '600',
  },
});