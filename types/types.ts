export interface User {
    id: number;
    email: string;
    displayName: string;
    username: string;
    password: string;
    profilePicture?: string | null;
}
