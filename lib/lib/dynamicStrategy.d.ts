/// <reference types="node" />
import { IncomingHttpHeaders } from 'http2';
import { Jwt, JwtPayload } from 'jsonwebtoken';
import { Strategy } from 'passport-strategy';
export interface StrategyOptions {
    publicKey: string;
}
interface Request {
    headers: IncomingHttpHeaders;
}
export declare class DynamicStrategy extends Strategy {
    authHeaderRegex: RegExp;
    name: string;
    _secretOrKeyProvider: (request: Request, rawJwtToken: any, done: any) => void;
    verify: (payload: Jwt | JwtPayload | string | undefined, done: any) => void;
    constructor(options: StrategyOptions, verify: (payload: Jwt | JwtPayload | string | undefined, done: any) => void);
    authenticate(req: Request, _options?: any): void;
    jwtFromRequest(request: Request): string | null;
}
export {};
