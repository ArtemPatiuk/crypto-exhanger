export interface IUser {
	id: string;
	email: string;
	role: ("USER" | "ADMIN")[];
}
// provider ?: "GOOGLE" | null;
// createdAt: string;
// updatedAt: string;
