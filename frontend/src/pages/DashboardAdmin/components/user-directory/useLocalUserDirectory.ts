import { useCallback, useEffect, useState } from "react";
import { adminRolesDropdownService } from "../../../../services/admin/adminRolesDropdownService";
import { userDirectoryRepository } from "../../../../services/userDirectory/userDirectoryRepository";
import type { DirectoryRoleOption, NewDirectoryUser } from "./types";

export const useLocalUserDirectory = () => {
  const [snapshot, setSnapshot] = useState(() => userDirectoryRepository.getSnapshot());
  const [rolesDropdown, setRolesDropdown] = useState<DirectoryRoleOption[]>([]);

  useEffect(() => {
    const refresh = () => setSnapshot(userDirectoryRepository.getSnapshot());
    return userDirectoryRepository.subscribe(refresh);
  }, []);

  useEffect(() => {
    void adminRolesDropdownService.getRoles().then(setRolesDropdown);
  }, []);

  const recordAudit = useCallback((action: string, detail: string) => {
    userDirectoryRepository.recordAudit(action, detail);
  }, []);

  const addUser = useCallback((draft: NewDirectoryUser) =>
    userDirectoryRepository.addUser(draft), []);

  const updateUser = useCallback((id: string, fields: Parameters<typeof userDirectoryRepository.updateUser>[1]) =>
    userDirectoryRepository.updateUser(id, fields), []);

  const updateUserStatus = useCallback((id: string, status: "Active" | "Pending" | "Suspended") =>
    userDirectoryRepository.updateUserStatus(id, status), []);

  const updateUserRole = useCallback((id: string, role: string) =>
    userDirectoryRepository.updateUserRole(id, role), []);

  const deleteUser = useCallback((id: string, force = false) =>
    userDirectoryRepository.deleteUser(id, force), []);

  return {
    users: snapshot.users,
    auditEntries: snapshot.auditEntries,
    rolesDropdown,
    roles: snapshot.roles ?? [],
    roleBreakdown: snapshot.roleBreakdown ?? [],
    monthlyGrowth: snapshot.monthlyGrowth ?? [],
    addUser,
    updateUser,
    updateUserStatus,
    updateUserRole,
    deleteUser,
    recordAudit,
    metrics: snapshot.metrics,
  };
};
