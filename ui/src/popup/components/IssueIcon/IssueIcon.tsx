import EmailIcon from './assets/email.svg?react';
import PhoneIcon from './assets/phone.svg?react';
import CreditCardIcon from './assets/credit_card.svg?react';
import SsnIcon from './assets/ssn.svg?react';

interface IssueIconProps {
  type: string;
}

export function IssueIcon(props: IssueIconProps) {
  const { type } = props;

  switch (type) {
    case 'email':
      return <EmailIcon className="issue-icon" />;
    case 'phone':
      return <PhoneIcon className="issue-icon" />;
    case 'creditCard':
      return <CreditCardIcon className="issue-icon" />;
    case 'ssn':
      return <SsnIcon className="issue-icon" />;
    default:
      return null;
  }
}
