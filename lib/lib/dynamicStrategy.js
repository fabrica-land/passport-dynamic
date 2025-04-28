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
            cookies.DYNAMIC_JWT_TOKEN) {
            jwtToken = String(cookies.DYNAMIC_JWT_TOKEN);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHluYW1pY1N0cmF0ZWd5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpYi9keW5hbWljU3RyYXRlZ3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsZ0RBQWdEO0FBQ2hELHlEQUE2QztBQUM3QywrQ0FBNEM7QUFVNUMsTUFBYSxlQUFnQixTQUFRLDRCQUFRO0lBTzNDLFlBQ0UsT0FBd0IsRUFDeEIsTUFBMkU7UUFFM0UsS0FBSyxFQUFFLENBQUM7UUFWVixvQkFBZSxHQUFHLGVBQWUsQ0FBQztRQUNsQyxTQUFJLEdBQUcsaUJBQWlCLENBQUM7UUFXdkIsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQztRQUVwQyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2QsTUFBTSxJQUFJLEtBQUssQ0FDYiw0REFBNEQsQ0FDN0QsQ0FBQztTQUNIO1FBRUQsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFFckIscUVBQXFFO1FBQ3JFLGtEQUFrRDtRQUNsRCxJQUFJLENBQUMsb0JBQW9CLEdBQUcsQ0FBQyxRQUFRLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxFQUFFO1lBQzNELElBQUksQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDeEIsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVELFlBQVksQ0FBQyxHQUFZLEVBQUUsUUFBYztRQUN2QyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRXZDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDVixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDNUM7UUFFRCxJQUFJLENBQUMsb0JBQW9CLENBQ3ZCLEdBQUcsRUFDSCxLQUFLLEVBQ0wsQ0FBQyxpQkFBc0IsRUFBRSxXQUFtQixFQUFFLEVBQUU7WUFDOUMsT0FBTyxJQUFBLHlCQUFXLEVBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsRUFBRTtnQkFDdEQsSUFBSSxHQUFHLEVBQUU7b0JBQ1AsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxHQUFHLENBQUMsQ0FBQztpQkFDeEM7cUJBQU07b0JBQ0wsTUFBTSxRQUFRLEdBQUcsQ0FBQyxLQUFVLEVBQUUsSUFBWSxFQUFFLElBQVksRUFBRSxFQUFFO3dCQUMxRCxJQUFJLEtBQUssRUFBRTs0QkFDVCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7eUJBQzFCOzZCQUFNLElBQUksQ0FBQyxJQUFJLEVBQUU7NEJBQ2hCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLENBQUMsQ0FBQzt5QkFDekM7NkJBQU07NEJBQ0wsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQzt5QkFDakM7b0JBQ0gsQ0FBQyxDQUFDO29CQUVGLElBQUk7d0JBQ0YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7cUJBQ2hDO29CQUFDLE9BQU8sRUFBTyxFQUFFO3dCQUNoQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7cUJBQ3ZCO2lCQUNGO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQ0YsQ0FBQztJQUNKLENBQUM7SUFFRCxjQUFjLENBQUMsT0FBZ0I7UUFDN0IsSUFBSSxRQUFRLEdBQWtCLElBQUksQ0FBQztRQUNuQyxNQUFNLE9BQU8sR0FBSSxPQUFlLENBQUMsT0FBTyxDQUFDO1FBQ3pDLElBQ0UsT0FBTyxPQUFPLEtBQUssUUFBUTtZQUMzQixDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO1lBQ3ZCLE9BQU8sQ0FBQyxpQkFBaUIsRUFDekI7WUFDQSxRQUFRLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1NBQzlDO2FBQU07WUFDTCxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQztZQUNqRCxJQUFJLFVBQVUsRUFBRTtnQkFDZCxNQUFNLG1CQUFtQixHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO2dCQUNuRSxRQUFRLEdBQUcsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7YUFDaEU7U0FDRjtRQUNELE9BQU8sUUFBUSxDQUFDO0lBQ2xCLENBQUM7Q0FDRjtBQXBGRCwwQ0FvRkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmNvbWluZ0h0dHBIZWFkZXJzIH0gZnJvbSAnaHR0cDInO1xuaW1wb3J0IHsgSnd0LCBKd3RQYXlsb2FkLCBTZWNyZXQgfSBmcm9tICdqc29ud2VidG9rZW4nO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWR1cGxpY2F0ZS1pbXBvcnRzXG5pbXBvcnQgeyBTdHJhdGVneSB9IGZyb20gJ3Bhc3Nwb3J0LXN0cmF0ZWd5JztcbmltcG9ydCB7IHZlcmlmeVRva2VuIH0gZnJvbSAnLi92ZXJpZnlUb2tlbic7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3RyYXRlZ3lPcHRpb25zIHtcbiAgcHVibGljS2V5OiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBSZXF1ZXN0IHtcbiAgaGVhZGVyczogSW5jb21pbmdIdHRwSGVhZGVycztcbn1cblxuZXhwb3J0IGNsYXNzIER5bmFtaWNTdHJhdGVneSBleHRlbmRzIFN0cmF0ZWd5IHtcbiAgYXV0aEhlYWRlclJlZ2V4ID0gLyhcXFMrKVxccysoXFxTKykvO1xuICBuYW1lID0gJ2R5bmFtaWNTdHJhdGVneSc7XG5cbiAgX3NlY3JldE9yS2V5UHJvdmlkZXI6IChyZXF1ZXN0OiBSZXF1ZXN0LCByYXdKd3RUb2tlbjogYW55LCBkb25lOiBhbnkpID0+IHZvaWQ7XG4gIHZlcmlmeTogKHBheWxvYWQ6IEp3dCB8IEp3dFBheWxvYWQgfCBzdHJpbmcgfCB1bmRlZmluZWQsIGRvbmU6IGFueSkgPT4gdm9pZDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBvcHRpb25zOiBTdHJhdGVneU9wdGlvbnMsXG4gICAgdmVyaWZ5OiAocGF5bG9hZDogSnd0IHwgSnd0UGF5bG9hZCB8IHN0cmluZyB8IHVuZGVmaW5lZCwgZG9uZTogYW55KSA9PiB2b2lkLFxuICApIHtcbiAgICBzdXBlcigpO1xuXG4gICAgY29uc3QgcHVibGljS2V5ID0gb3B0aW9ucy5wdWJsaWNLZXk7XG5cbiAgICBpZiAoIXB1YmxpY0tleSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnWW91IG11c3QgcHJvdmlkZSB5b3VyIER5bmFtaWMgcHVibGljIGtleSBmb3IgdmVyaWZpY2F0aW9uLicsXG4gICAgICApO1xuICAgIH1cblxuICAgIHRoaXMudmVyaWZ5ID0gdmVyaWZ5O1xuXG4gICAgLy8gUGFzc3BvcnQgZXhwZWN0cyB0aGlzIHRvIGJlIGEgY2FsbGJhY2suIE91ciBwdWJsaWNLZXkgaXMgc3RhdGljIHNvXG4gICAgLy8gd2Ugd3JhcCBpdCBpbiBhIHNpbXBsZSBmdW5jdGlvbiB0aGF0IHJldHVybnMgaXRcbiAgICB0aGlzLl9zZWNyZXRPcktleVByb3ZpZGVyID0gKF9yZXF1ZXN0LCBfcmF3Snd0VG9rZW4sIGRvbmUpID0+IHtcbiAgICAgIGRvbmUobnVsbCwgcHVibGljS2V5KTtcbiAgICB9O1xuICB9XG5cbiAgYXV0aGVudGljYXRlKHJlcTogUmVxdWVzdCwgX29wdGlvbnM/OiBhbnkpIHtcbiAgICBjb25zdCB0b2tlbiA9IHRoaXMuand0RnJvbVJlcXVlc3QocmVxKTtcblxuICAgIGlmICghdG9rZW4pIHtcbiAgICAgIHJldHVybiB0aGlzLmZhaWwoJ01pc3NpbmcgSldUIHRva2VuJywgNDAxKTtcbiAgICB9XG5cbiAgICB0aGlzLl9zZWNyZXRPcktleVByb3ZpZGVyKFxuICAgICAgcmVxLFxuICAgICAgdG9rZW4sXG4gICAgICAoX3NlY3JldE9yS2V5RXJyb3I6IGFueSwgc2VjcmV0T3JLZXk6IFNlY3JldCkgPT4ge1xuICAgICAgICByZXR1cm4gdmVyaWZ5VG9rZW4odG9rZW4sIHNlY3JldE9yS2V5LCAoZXJyLCBwYXlsb2FkKSA9PiB7XG4gICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmFpbCgnSW52YWxpZCB0b2tlbicsIDQwMSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHZlcmlmaWVkID0gKGVycm9yOiBhbnksIHVzZXI6IG9iamVjdCwgaW5mbzogb2JqZWN0KSA9PiB7XG4gICAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmICghdXNlcikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmZhaWwoJ1VzZXIgbm90IGZvdW5kJywgNDAxKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zdWNjZXNzKHVzZXIsIGluZm8pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICB0aGlzLnZlcmlmeShwYXlsb2FkLCB2ZXJpZmllZCk7XG4gICAgICAgICAgICB9IGNhdGNoIChleDogYW55KSB7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLmVycm9yKGV4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICApO1xuICB9XG5cbiAgand0RnJvbVJlcXVlc3QocmVxdWVzdDogUmVxdWVzdCkge1xuICAgIGxldCBqd3RUb2tlbjogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gICAgY29uc3QgY29va2llcyA9IChyZXF1ZXN0IGFzIGFueSkuY29va2llcztcbiAgICBpZiAoXG4gICAgICB0eXBlb2YgY29va2llcyA9PT0gJ29iamVjdCcgJiZcbiAgICAgICFBcnJheS5pc0FycmF5KGNvb2tpZXMpICYmXG4gICAgICBjb29raWVzLkRZTkFNSUNfSldUX1RPS0VOXG4gICAgKSB7XG4gICAgICBqd3RUb2tlbiA9IFN0cmluZyhjb29raWVzLkRZTkFNSUNfSldUX1RPS0VOKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgYXV0aEhlYWRlciA9IHJlcXVlc3QuaGVhZGVycy5hdXRob3JpemF0aW9uO1xuICAgICAgaWYgKGF1dGhIZWFkZXIpIHtcbiAgICAgICAgY29uc3QgYmVhcmVyU2NoZW1lTWF0Y2hlcyA9IGF1dGhIZWFkZXIubWF0Y2godGhpcy5hdXRoSGVhZGVyUmVnZXgpO1xuICAgICAgICBqd3RUb2tlbiA9IGJlYXJlclNjaGVtZU1hdGNoZXMgPyBiZWFyZXJTY2hlbWVNYXRjaGVzWzJdIDogbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGp3dFRva2VuO1xuICB9XG59XG4iXX0=