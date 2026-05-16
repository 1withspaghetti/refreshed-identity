export interface UserPreview {
	id: string;
	name: string;
	email: string;
	pfp: string | null;
}

export interface User extends UserPreview {
	firstLogin: Date;
	lastLogin: Date;
}

export type SessionUser = UserPreview;
