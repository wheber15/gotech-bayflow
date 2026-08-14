import { AppUser } from "./auth.types";

// Prototype-only client credentials. Never use real credentials in this file.
export const mockUsers: AppUser[] = [
  { id: "usr-bay-001", username: "bay.operator", displayName: "Bay Operator", role: "BAY_OPERATOR", active: true, pin: "246810", failedLoginAttempts: 0 },
  { id: "usr-bay-002", username: "bay.relief", displayName: "Relief Bay Operator", role: "BAY_OPERATOR", active: true, pin: "135790", failedLoginAttempts: 0 },
  { id: "usr-admin-001", username: "logistics.admin", displayName: "Logistics Admin", role: "ADMIN", active: true, password: "PrototypeAdmin!", failedLoginAttempts: 0 },
];
