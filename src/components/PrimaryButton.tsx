import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
};

export function PrimaryButton({ title, onPress, disabled, style }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        disabled ? styles.buttonDisabled : null,
        pressed && !disabled ? styles.buttonPressed : null,
        style,
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#111827',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  text: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
