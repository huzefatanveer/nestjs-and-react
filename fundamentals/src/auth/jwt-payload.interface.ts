// src/auth/jwt-payload.interface.ts
export interface JwtPayload {
    sub: string; // This will typically be the user ID
    username: string; // Include any other properties you expect to use
}
