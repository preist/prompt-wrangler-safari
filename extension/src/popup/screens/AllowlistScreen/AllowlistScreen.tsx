import { useState, useEffect } from 'react';
import type { AllowlistItem as AllowlistItemType } from '@lib/storage/allowlist';
import {
  getAllowlist,
  removeFromAllowlist,
  cleanExpiredAllowlistItems,
} from '@lib/storage/allowlist';
import { ScreenContainer } from '@popup/components/ScreenContainer/ScreenContainer';
import { ScreenEmptyState } from '@popup/components/ScreenEmptyState/ScreenEmptyState';
import { ScreenPanel } from '@popup/components/ScreenPanel/ScreenPanel';
import { AllowlistItem } from '@popup/components/AllowlistItem/AllowlistItem';

export function AllowlistScreen() {
  const [allowlist, setAllowlist] = useState<AllowlistItemType[]>([]);

  useEffect(() => {
    void (async () => {
      await cleanExpiredAllowlistItems();
      const items = await getAllowlist();
      setAllowlist(items);
    })();
  }, []);

  const handleRemove = async (value: string, type: AllowlistItemType['type']) => {
    await removeFromAllowlist(value, type);
    await cleanExpiredAllowlistItems();
    const items = await getAllowlist();
    setAllowlist(items);
  };

  const handleClearAll = async () => {
    for (const item of allowlist) {
      await removeFromAllowlist(item.value, item.type);
    }
    await cleanExpiredAllowlistItems();
    const items = await getAllowlist();
    setAllowlist(items);
  };

  if (allowlist.length === 0) {
    return (
      <ScreenContainer>
        <ScreenEmptyState title="Allowlist empty" description="Items you allow will appear here" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScreenPanel
        title="Allow list"
        action={{
          label: 'Clear all',
          onClick: () => {
            void handleClearAll();
          },
        }}
      >
        {allowlist.map((item, index) => (
          <AllowlistItem
            key={`${item.value}-${item.type}-${index.toString()}`}
            item={item}
            onRemove={handleRemove}
          />
        ))}
      </ScreenPanel>
    </ScreenContainer>
  );
}
