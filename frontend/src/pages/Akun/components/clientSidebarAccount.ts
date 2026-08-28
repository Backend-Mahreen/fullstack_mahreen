import type { AuthUser } from "../../../types/auth";

const getInitials = (name: string) => {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return initials || "M";
};

export const getClientSidebarAccount = (
  user: AuthUser,
  avatarSrc = user.profilePhoto,
) => {
  const nickname = typeof user.nickname === "string" ? user.nickname.trim() : "";
  const fullName = typeof user.fullName === "string" ? user.fullName.trim() : "";
  const displayName = nickname || fullName || "Pengguna Mahreen";
  const id = typeof user.id === "string" && user.id.trim()
    ? user.id.trim()
    : "MHR-USER";

  return {
    avatarSrc,
    displayName,
    id,
    initials: getInitials(displayName),
  } as const;
};
