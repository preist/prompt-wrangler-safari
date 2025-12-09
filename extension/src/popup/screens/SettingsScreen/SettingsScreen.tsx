import { useSettings } from '@popup/hooks/useSettings';
import { Toggle } from '@popup/components/Toggle/Toggle';
import { SettingsSection } from '@popup/components/SettingsSection/SettingsSection';
import { SettingsItem } from '@popup/components/SettingsItem/SettingsItem';
import { ScreenContainer } from '@popup/components/ScreenContainer/ScreenContainer';
import { ScreenPanel } from '@popup/components/ScreenPanel/ScreenPanel';

export function SettingsScreen() {
  const { protectedMode, enabledDataTypes, toggleDataType, enableAllDataTypes } = useSettings();

  const allChecked =
    enabledDataTypes.email &&
    enabledDataTypes.phone &&
    enabledDataTypes.creditCard &&
    enabledDataTypes.ssn;

  const handleCheckAll = () => {
    if (!protectedMode) return;
    void enableAllDataTypes();
  };

  return (
    <ScreenContainer>
      <ScreenPanel
        title="Settings"
        action={{
          label: 'Check all',
          onClick: handleCheckAll,
          disabled: !protectedMode,
          show: !allChecked,
        }}
      >
        <SettingsSection
          title="Private data"
          description="Select which types of data should be protected"
        >
          <SettingsItem title="Email addresses">
            <Toggle
              label=""
              checked={enabledDataTypes.email}
              disabled={!protectedMode}
              onChange={() => toggleDataType('email')}
            />
          </SettingsItem>

          <SettingsItem title="Phone Numbers">
            <Toggle
              label=""
              checked={enabledDataTypes.phone}
              disabled={!protectedMode}
              onChange={() => toggleDataType('phone')}
            />
          </SettingsItem>

          <SettingsItem title="Credit Card Information">
            <Toggle
              label=""
              checked={enabledDataTypes.creditCard}
              disabled={!protectedMode}
              onChange={() => toggleDataType('creditCard')}
            />
          </SettingsItem>

          <SettingsItem title="Social Security Numbers">
            <Toggle
              label=""
              checked={enabledDataTypes.ssn}
              disabled={!protectedMode}
              onChange={() => toggleDataType('ssn')}
            />
          </SettingsItem>
        </SettingsSection>
      </ScreenPanel>
    </ScreenContainer>
  );
}
