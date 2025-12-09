export function classnames(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
