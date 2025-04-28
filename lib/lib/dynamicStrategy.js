"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicStrategy = void 0;
// eslint-disable-next-line no-duplicate-imports
const passport_strategy_1 = require("passport-strategy");
const verifyToken_1 = require("./verifyToken");
class DynamicStrategy extends passport_strategy_1.Strategy {
    constructor(options, verify) {
        super();
        this.authHeaderRegex = /(\S+)\s+(\S+)/;
        this.name = 'dynamicStrategy';
        const publicKey = options.publicKey;
        if (!publicKey) {
            throw new Error('You must provide your Dynamic public key for verification.');
        }
        this.verify = verify;
        // Passport expects this to be a callback. Our publicKey is static so
        // we wrap it in a simple function that returns it
        this._secretOrKeyProvider = (_request, _rawJwtToken, done) => {
            done(null, publicKey);
        };
    }
    authenticate(req, _options) {
        const token = this.jwtFromRequest(req);
        if (!token) {
            return this.fail('Missing JWT token', 401);
        }
        this._secretOrKeyProvider(req, token, (_secretOrKeyError, secretOrKey) => {
            return (0, verifyToken_1.verifyToken)(token, secretOrKey, (err, payload) => {
                if (err) {
                    return this.fail('Invalid token', 401);
                }
                else {
                    const verified = (error, user, info) => {
                        if (error) {
                            return this.error(error);
                        }
                        else if (!user) {
                            return this.fail('User not found', 401);
                        }
                        else {
                            return this.success(user, info);
                        }
                    };
                    try {
                        this.verify(payload, verified);
                    }
                    catch (ex) {
                        return this.error(ex);
                    }
                }
            });
        });
    }
    jwtFromRequest(request) {
        let jwtToken = null;
        const cookies = request.cookies;
        if (typeof cookies === 'object' &&
            !Array.isArray(cookies) &&
            cookies.DYNAMIC_JWT_TOKEN &&
            typeof cookies.DYNAMIC_JWT_TOKEN === 'string') {
            jwtToken = cookies.DYNAMIC_JWT_TOKEN;
        }
        else {
            const authHeader = request.headers.authorization;
            if (authHeader) {
                const bearerSchemeMatches = authHeader.match(this.authHeaderRegex);
                jwtToken = bearerSchemeMatches ? bearerSchemeMatches[2] : null;
            }
        }
        return jwtToken;
    }
}
exports.DynamicStrategy = DynamicStrategy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHluYW1pY1N0cmF0ZWd5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpYi9keW5hbWljU3RyYXRlZ3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsZ0RBQWdEO0FBQ2hELHlEQUE2QztBQUM3QywrQ0FBNEM7QUFVNUMsTUFBYSxlQUFnQixTQUFRLDRCQUFRO0lBTzNDLFlBQ0UsT0FBd0IsRUFDeEIsTUFBMkU7UUFFM0UsS0FBSyxFQUFFLENBQUM7UUFWVixvQkFBZSxHQUFHLGVBQWUsQ0FBQztRQUNsQyxTQUFJLEdBQUcsaUJBQWlCLENBQUM7UUFXdkIsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQztRQUVwQyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2QsTUFBTSxJQUFJLEtBQUssQ0FDYiw0REFBNEQsQ0FDN0QsQ0FBQztTQUNIO1FBRUQsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFFckIscUVBQXFFO1FBQ3JFLGtEQUFrRDtRQUNsRCxJQUFJLENBQUMsb0JBQW9CLEdBQUcsQ0FBQyxRQUFRLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxFQUFFO1lBQzNELElBQUksQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDeEIsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVELFlBQVksQ0FBQyxHQUFZLEVBQUUsUUFBYztRQUN2QyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRXZDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDVixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDNUM7UUFFRCxJQUFJLENBQUMsb0JBQW9CLENBQ3ZCLEdBQUcsRUFDSCxLQUFLLEVBQ0wsQ0FBQyxpQkFBc0IsRUFBRSxXQUFtQixFQUFFLEVBQUU7WUFDOUMsT0FBTyxJQUFBLHlCQUFXLEVBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsRUFBRTtnQkFDdEQsSUFBSSxHQUFHLEVBQUU7b0JBQ1AsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxHQUFHLENBQUMsQ0FBQztpQkFDeEM7cUJBQU07b0JBQ0wsTUFBTSxRQUFRLEdBQUcsQ0FBQyxLQUFVLEVBQUUsSUFBWSxFQUFFLElBQVksRUFBRSxFQUFFO3dCQUMxRCxJQUFJLEtBQUssRUFBRTs0QkFDVCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7eUJBQzFCOzZCQUFNLElBQUksQ0FBQyxJQUFJLEVBQUU7NEJBQ2hCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLENBQUMsQ0FBQzt5QkFDekM7NkJBQU07NEJBQ0wsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQzt5QkFDakM7b0JBQ0gsQ0FBQyxDQUFDO29CQUVGLElBQUk7d0JBQ0YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7cUJBQ2hDO29CQUFDLE9BQU8sRUFBTyxFQUFFO3dCQUNoQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7cUJBQ3ZCO2lCQUNGO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQ0YsQ0FBQztJQUNKLENBQUM7SUFFRCxjQUFjLENBQUMsT0FBZ0I7UUFDN0IsSUFBSSxRQUFRLEdBQWtCLElBQUksQ0FBQztRQUNuQyxNQUFNLE9BQU8sR0FBSSxPQUFlLENBQUMsT0FBTyxDQUFDO1FBQ3pDLElBQ0UsT0FBTyxPQUFPLEtBQUssUUFBUTtZQUMzQixDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO1lBQ3ZCLE9BQU8sQ0FBQyxpQkFBaUI7WUFDekIsT0FBTyxPQUFPLENBQUMsaUJBQWlCLEtBQUssUUFBUSxFQUM3QztZQUNBLFFBQVEsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUM7U0FDdEM7YUFBTTtZQUNMLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDO1lBQ2pELElBQUksVUFBVSxFQUFFO2dCQUNkLE1BQU0sbUJBQW1CLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7Z0JBQ25FLFFBQVEsR0FBRyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQzthQUNoRTtTQUNGO1FBQ0QsT0FBTyxRQUFRLENBQUM7SUFDbEIsQ0FBQztDQUNGO0FBckZELDBDQXFGQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluY29taW5nSHR0cEhlYWRlcnMgfSBmcm9tICdodHRwMic7XG5pbXBvcnQgeyBKd3QsIEp3dFBheWxvYWQsIFNlY3JldCB9IGZyb20gJ2pzb253ZWJ0b2tlbic7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZHVwbGljYXRlLWltcG9ydHNcbmltcG9ydCB7IFN0cmF0ZWd5IH0gZnJvbSAncGFzc3BvcnQtc3RyYXRlZ3knO1xuaW1wb3J0IHsgdmVyaWZ5VG9rZW4gfSBmcm9tICcuL3ZlcmlmeVRva2VuJztcblxuZXhwb3J0IGludGVyZmFjZSBTdHJhdGVneU9wdGlvbnMge1xuICBwdWJsaWNLZXk6IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIFJlcXVlc3Qge1xuICBoZWFkZXJzOiBJbmNvbWluZ0h0dHBIZWFkZXJzO1xufVxuXG5leHBvcnQgY2xhc3MgRHluYW1pY1N0cmF0ZWd5IGV4dGVuZHMgU3RyYXRlZ3kge1xuICBhdXRoSGVhZGVyUmVnZXggPSAvKFxcUyspXFxzKyhcXFMrKS87XG4gIG5hbWUgPSAnZHluYW1pY1N0cmF0ZWd5JztcblxuICBfc2VjcmV0T3JLZXlQcm92aWRlcjogKHJlcXVlc3Q6IFJlcXVlc3QsIHJhd0p3dFRva2VuOiBhbnksIGRvbmU6IGFueSkgPT4gdm9pZDtcbiAgdmVyaWZ5OiAocGF5bG9hZDogSnd0IHwgSnd0UGF5bG9hZCB8IHN0cmluZyB8IHVuZGVmaW5lZCwgZG9uZTogYW55KSA9PiB2b2lkO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIG9wdGlvbnM6IFN0cmF0ZWd5T3B0aW9ucyxcbiAgICB2ZXJpZnk6IChwYXlsb2FkOiBKd3QgfCBKd3RQYXlsb2FkIHwgc3RyaW5nIHwgdW5kZWZpbmVkLCBkb25lOiBhbnkpID0+IHZvaWQsXG4gICkge1xuICAgIHN1cGVyKCk7XG5cbiAgICBjb25zdCBwdWJsaWNLZXkgPSBvcHRpb25zLnB1YmxpY0tleTtcblxuICAgIGlmICghcHVibGljS2V5KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdZb3UgbXVzdCBwcm92aWRlIHlvdXIgRHluYW1pYyBwdWJsaWMga2V5IGZvciB2ZXJpZmljYXRpb24uJyxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdGhpcy52ZXJpZnkgPSB2ZXJpZnk7XG5cbiAgICAvLyBQYXNzcG9ydCBleHBlY3RzIHRoaXMgdG8gYmUgYSBjYWxsYmFjay4gT3VyIHB1YmxpY0tleSBpcyBzdGF0aWMgc29cbiAgICAvLyB3ZSB3cmFwIGl0IGluIGEgc2ltcGxlIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBpdFxuICAgIHRoaXMuX3NlY3JldE9yS2V5UHJvdmlkZXIgPSAoX3JlcXVlc3QsIF9yYXdKd3RUb2tlbiwgZG9uZSkgPT4ge1xuICAgICAgZG9uZShudWxsLCBwdWJsaWNLZXkpO1xuICAgIH07XG4gIH1cblxuICBhdXRoZW50aWNhdGUocmVxOiBSZXF1ZXN0LCBfb3B0aW9ucz86IGFueSkge1xuICAgIGNvbnN0IHRva2VuID0gdGhpcy5qd3RGcm9tUmVxdWVzdChyZXEpO1xuXG4gICAgaWYgKCF0b2tlbikge1xuICAgICAgcmV0dXJuIHRoaXMuZmFpbCgnTWlzc2luZyBKV1QgdG9rZW4nLCA0MDEpO1xuICAgIH1cblxuICAgIHRoaXMuX3NlY3JldE9yS2V5UHJvdmlkZXIoXG4gICAgICByZXEsXG4gICAgICB0b2tlbixcbiAgICAgIChfc2VjcmV0T3JLZXlFcnJvcjogYW55LCBzZWNyZXRPcktleTogU2VjcmV0KSA9PiB7XG4gICAgICAgIHJldHVybiB2ZXJpZnlUb2tlbih0b2tlbiwgc2VjcmV0T3JLZXksIChlcnIsIHBheWxvYWQpID0+IHtcbiAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5mYWlsKCdJbnZhbGlkIHRva2VuJywgNDAxKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgdmVyaWZpZWQgPSAoZXJyb3I6IGFueSwgdXNlcjogb2JqZWN0LCBpbmZvOiBvYmplY3QpID0+IHtcbiAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKCF1c2VyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmFpbCgnVXNlciBub3QgZm91bmQnLCA0MDEpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnN1Y2Nlc3ModXNlciwgaW5mbyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHRoaXMudmVyaWZ5KHBheWxvYWQsIHZlcmlmaWVkKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGV4OiBhbnkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZXJyb3IoZXgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICk7XG4gIH1cblxuICBqd3RGcm9tUmVxdWVzdChyZXF1ZXN0OiBSZXF1ZXN0KSB7XG4gICAgbGV0IGp3dFRva2VuOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgICBjb25zdCBjb29raWVzID0gKHJlcXVlc3QgYXMgYW55KS5jb29raWVzO1xuICAgIGlmIChcbiAgICAgIHR5cGVvZiBjb29raWVzID09PSAnb2JqZWN0JyAmJlxuICAgICAgIUFycmF5LmlzQXJyYXkoY29va2llcykgJiZcbiAgICAgIGNvb2tpZXMuRFlOQU1JQ19KV1RfVE9LRU4gJiZcbiAgICAgIHR5cGVvZiBjb29raWVzLkRZTkFNSUNfSldUX1RPS0VOID09PSAnc3RyaW5nJ1xuICAgICkge1xuICAgICAgand0VG9rZW4gPSBjb29raWVzLkRZTkFNSUNfSldUX1RPS0VOO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBhdXRoSGVhZGVyID0gcmVxdWVzdC5oZWFkZXJzLmF1dGhvcml6YXRpb247XG4gICAgICBpZiAoYXV0aEhlYWRlcikge1xuICAgICAgICBjb25zdCBiZWFyZXJTY2hlbWVNYXRjaGVzID0gYXV0aEhlYWRlci5tYXRjaCh0aGlzLmF1dGhIZWFkZXJSZWdleCk7XG4gICAgICAgIGp3dFRva2VuID0gYmVhcmVyU2NoZW1lTWF0Y2hlcyA/IGJlYXJlclNjaGVtZU1hdGNoZXNbMl0gOiBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gand0VG9rZW47XG4gIH1cbn1cbiJdfQ==