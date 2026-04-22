export function getTossClientKey(): string | null {
  const v = process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY?.trim();
  return v || null;
}

export function getTossWidgetSecretKey(): string | null {
  const v = process.env.TOSS_PAYMENTS_WIDGET_SECRET_KEY?.trim();
  return v || null;
}
