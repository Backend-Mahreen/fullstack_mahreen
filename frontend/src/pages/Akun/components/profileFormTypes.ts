export type ProfileEditForm = {
  profilePhoto: string;
  fullName: string;
  nickname: string;
  email: string;
  whatsapp: string;
  birthDate: string;
  country: string;
  province: string;
  city: string;
  address: string;
  jobTitle: string;
  institution: string;
  linkedin: string;
};

export type ProfileFieldChange = <K extends keyof ProfileEditForm>(key: K, value: ProfileEditForm[K]) => void;
