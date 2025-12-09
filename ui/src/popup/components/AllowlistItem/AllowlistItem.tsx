import type { AllowlistItem as AllowlistItemType } from '@lib/storage/allowlist';
import { IssueIcon } from '@popup/components/IssueIcon/IssueIcon';

interface AllowlistItemProps {
  item: AllowlistItemType;
  onRemove: (value: string, type: AllowlistItemType['type']) => void;
}

export function AllowlistItem(props: AllowlistItemProps) {
  const { item, onRemove } = props;

  const expiryText = item.expiresAt === 'never' ? 'Allowed forever' : `Allowed for 24 hours`;

  return (
    <div className="allowlist-item">
      <IssueIcon type={item.type} />
      <div className="allowlist-item__content">
        <div className="allowlist-item__value">{item.value}</div>
        <div className="allowlist-item__expiry">{expiryText}</div>
      </div>
      <button
        type="button"
        className="allowlist-item__remove"
        onClick={() => {
          onRemove(item.value, item.type);
        }}
        aria-label="Remove from allowlist"
      >
        ×
      </button>
    </div>
  );
}
