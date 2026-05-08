export interface LoginRequest {
    username: string;
    password: string;
}

export interface JwtResponse {
    accessToken: string;
    refreshToken: string;
}