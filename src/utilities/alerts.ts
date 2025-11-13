import { type AlertModel } from "@/env";

const alertsOrder: Record<string, number> = {
  emergency: 1,
  error: 2,
  warning: 3,
  success: 4,
  info: 5,
};

export function cleanAlerts(alertsData: AlertModel[]) {
  return (
    alertsData
      ?.filter(Boolean)
      ?.sort(
        (a, b) => (alertsOrder[a.type] ?? 0) - (alertsOrder[b.type] ?? 0),
      ) ?? []
  );
}
