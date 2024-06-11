export interface User {
    id: number;
    email: string;
    display_name: string;
    username: string;
    password: string;
    profile_picture?: string | null;
}
