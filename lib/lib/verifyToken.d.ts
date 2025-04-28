import { VerifyCallback, JwtPayload, Secret } from 'jsonwebtoken';
import type { Jwt } from 'jsonwebtoken';
export declare const verifyToken: (token: string, key: Secret, callback: VerifyCallback<string | Jwt | JwtPayload>) => void;
