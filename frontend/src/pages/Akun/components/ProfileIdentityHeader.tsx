import { BadgeCheck, Camera } from "lucide-react";
import type { AuthUser } from "../../../types/auth";
import { getInitials } from "../../../utils/formatName";

type ProfileIdentityHeaderProps = Readonly<{
  user: AuthUser;
  avatarSrc?: string;
  memberSince: string;
  onPhotoSelected: (file: File) => void;
}>;

const ProfileIdentityHeader = ({ user, avatarSrc, memberSince, onPhotoSelected }: ProfileIdentityHeaderProps) => (
  <header className="profile-editor-identity" data-profile-reveal="1">
    <div className="profile-editor-identity__avatar-wrap">
      {avatarSrc ? (
        <img decoding="async" className="profile-editor-identity__avatar" src={avatarSrc} alt={`Foto profil ${user.fullName}`} />
      ) : (
        <span className="profile-editor-identity__avatar profile-editor-identity__avatar--fallback" aria-label={`Inisial profil ${user.fullName}`}>
          {getInitials(user.fullName)}
        </span>
      )}
      <label className="profile-editor-identity__photo-button" aria-label="Ganti foto profil">
        <Camera aria-hidden="true" />
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onPhotoSelected(file);
            event.currentTarget.value = "";
          }}
        />
      </label>
    </div>

    <div className="profile-editor-identity__copy">
      <div className="profile-editor-identity__name-row">
        <h1>{user.fullName}</h1>
        <span className="profile-editor-verified"><BadgeCheck aria-hidden="true" />Verified</span>
      </div>
      <p className="profile-editor-id">Mahreen ID: {user.id}</p>
      <p className="profile-editor-member">Member since {memberSince} · {user.province || "Jakarta"}, ID</p>
    </div>
  </header>
);

export default ProfileIdentityHeader;
