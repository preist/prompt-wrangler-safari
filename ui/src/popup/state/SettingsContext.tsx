import { createContext, useState, useEffect, type ReactNode } from 'react';

export interface EnabledPlatforms {
  chatgpt: boolean;
  claude: boolean;
}

export interface EnabledDataTypes {
  email: boolean;
  phone: boolean;
  creditCard: boolean;
  ssn: boolean;
}

export interface SettingsContextValue {
  protectedMode: boolean;
  enabledPlatforms: EnabledPlatforms;
  enabledDataTypes: EnabledDataTypes;
  hasCompletedOnboarding: boolean;
  toggleProtectedMode: () => Promise<void>;
  togglePlatform: (platform: keyof EnabledPlatforms) => Promise<void>;
  toggleDataType: (type: keyof EnabledDataTypes) => Promise<void>;
  enableAllDataTypes: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

const DEFAULT_SETTINGS = {
  protectedMode: true,
  enabledPlatforms: {
    chatgpt: true,
    claude: false,
  },
  enabledDataTypes: {
    email: true,
    phone: true,
    creditCard: true,
    ssn: true,
  },
};

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider(props: SettingsProviderProps) {
  const { children } = props;

  const [protectedMode, setProtectedMode] = useState(DEFAULT_SETTINGS.protectedMode);
  const [enabledPlatforms, setEnabledPlatforms] = useState(DEFAULT_SETTINGS.enabledPlatforms);
  const [enabledDataTypes, setEnabledDataTypes] = useState(DEFAULT_SETTINGS.enabledDataTypes);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  // Load settings from chrome.storage on mount
  useEffect(() => {
    const loadSettings = async () => {
      const result = await chrome.storage.local.get([
        'settings.protectedMode',
        'settings.platforms',
        'settings.dataTypes',
        'settings.hasCompletedOnboarding',
      ]);

      if (result['settings.protectedMode'] !== undefined) {
        setProtectedMode(result['settings.protectedMode'] as boolean);
      }
      if (result['settings.platforms']) {
        setEnabledPlatforms(result['settings.platforms'] as EnabledPlatforms);
      }
      if (result['settings.dataTypes']) {
        setEnabledDataTypes(result['settings.dataTypes'] as EnabledDataTypes);
      }
      if (result['settings.hasCompletedOnboarding'] !== undefined) {
        setHasCompletedOnboarding(result['settings.hasCompletedOnboarding'] as boolean);
      }
    };

    void loadSettings();
  }, []);

  const toggleProtectedMode = async () => {
    const newValue = !protectedMode;
    setProtectedMode(newValue);

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (newValue) {
      if (!enabledPlatforms.chatgpt && !enabledPlatforms.claude) {
        const updatedPlatforms = {
          ...enabledPlatforms,
          chatgpt: true,
        };
        setEnabledPlatforms(updatedPlatforms);
        await chrome.storage.local.set({ 'settings.platforms': updatedPlatforms });
      }

      const anyDataTypeEnabled = Object.values(enabledDataTypes).some((enabled) => enabled);
      if (!anyDataTypeEnabled) {
        const updatedDataTypes = {
          email: true,
          phone: true,
          creditCard: true,
          ssn: true,
        };
        setEnabledDataTypes(updatedDataTypes);
        await chrome.storage.local.set({ 'settings.dataTypes': updatedDataTypes });

        if (tab?.id) {
          try {
            await chrome.tabs.sendMessage(tab.id, {
              type: 'UPDATE_DATA_TYPES',
              dataTypes: updatedDataTypes,
            });
          } catch {
            // Content script not available - ignore error
          }
        }
      }
    }

    await chrome.storage.local.set({ 'settings.protectedMode': newValue });

    if (tab?.id) {
      try {
        await chrome.tabs.sendMessage(tab.id, {
          type: 'TOGGLE_PROTECTED_MODE',
          enabled: newValue,
        });
      } catch {
        // Content script not available - ignore error
      }
    }
  };

  const togglePlatform = async (platform: keyof EnabledPlatforms) => {
    const newPlatforms = {
      ...enabledPlatforms,
      [platform]: !enabledPlatforms[platform],
    };
    setEnabledPlatforms(newPlatforms);
    await chrome.storage.local.set({ 'settings.platforms': newPlatforms });

    // If all platforms are now disabled, turn off Protected Mode
    if (!newPlatforms.chatgpt && !newPlatforms.claude && protectedMode) {
      setProtectedMode(false);
      await chrome.storage.local.set({ 'settings.protectedMode': false });

      // Notify content script
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.id) {
        try {
          await chrome.tabs.sendMessage(tab.id, {
            type: 'TOGGLE_PROTECTED_MODE',
            enabled: false,
          });
        } catch {
          // Content script not available - ignore error
        }
      }
    }
  };

  const toggleDataType = async (type: keyof EnabledDataTypes) => {
    const newDataTypes = {
      ...enabledDataTypes,
      [type]: !enabledDataTypes[type],
    };
    setEnabledDataTypes(newDataTypes);
    await chrome.storage.local.set({ 'settings.dataTypes': newDataTypes });

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      try {
        await chrome.tabs.sendMessage(tab.id, {
          type: 'UPDATE_DATA_TYPES',
          dataTypes: newDataTypes,
        });
      } catch {
        // Content script not available - ignore error
      }
    }

    const anyDataTypeEnabled = Object.values(newDataTypes).some((enabled) => enabled);
    if (!anyDataTypeEnabled && protectedMode) {
      setProtectedMode(false);
      await chrome.storage.local.set({ 'settings.protectedMode': false });

      if (tab?.id) {
        try {
          await chrome.tabs.sendMessage(tab.id, {
            type: 'TOGGLE_PROTECTED_MODE',
            enabled: false,
          });
        } catch {
          // Content script not available - ignore error
        }
      }
    }
  };

  const enableAllDataTypes = async () => {
    const newDataTypes = {
      email: true,
      phone: true,
      creditCard: true,
      ssn: true,
    };
    setEnabledDataTypes(newDataTypes);
    await chrome.storage.local.set({ 'settings.dataTypes': newDataTypes });

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      try {
        await chrome.tabs.sendMessage(tab.id, {
          type: 'UPDATE_DATA_TYPES',
          dataTypes: newDataTypes,
        });
      } catch {
        // Content script not available - ignore error
      }
    }
  };

  const completeOnboarding = async () => {
    // Set all default settings
    const newDataTypes = {
      email: true,
      phone: true,
      creditCard: true,
      ssn: true,
    };
    const newPlatforms = {
      chatgpt: true,
      claude: false,
    };

    setProtectedMode(true);
    setEnabledDataTypes(newDataTypes);
    setEnabledPlatforms(newPlatforms);
    setHasCompletedOnboarding(true);

    await chrome.storage.local.set({
      'settings.protectedMode': true,
      'settings.dataTypes': newDataTypes,
      'settings.platforms': newPlatforms,
      'settings.hasCompletedOnboarding': true,
    });

    // Notify content script
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      try {
        await chrome.tabs.sendMessage(tab.id, {
          type: 'TOGGLE_PROTECTED_MODE',
          enabled: true,
        });
        await chrome.tabs.sendMessage(tab.id, {
          type: 'UPDATE_DATA_TYPES',
          dataTypes: newDataTypes,
        });
      } catch {
        // Content script not available - ignore error
      }
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        protectedMode,
        enabledPlatforms,
        enabledDataTypes,
        hasCompletedOnboarding,
        toggleProtectedMode,
        togglePlatform,
        toggleDataType,
        enableAllDataTypes,
        completeOnboarding,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
