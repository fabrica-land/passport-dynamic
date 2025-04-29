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
        if (typeof cookies !== 'object') {
            console.warn('request.cookies is not an object');
        }
        else if (Array.isArray(cookies)) {
            console.warn('request.cookies is an array');
        }
        else if (!cookies.DYNAMIC_JWT_TOKEN) {
            console.warn('request.cookies does not contain DYNAMIC_JWT_TOKEN');
        }
        else if (typeof cookies.DYNAMIC_JWT_TOKEN === 'string') {
            console.warn('request.cookies.DYNAMIC_JWT_TOKEN is not a string');
        }
        console.log('request.cookies.DYNAMIC_JWT_TOKEN raw value:', cookies === null || cookies === void 0 ? void 0 : cookies.DYNAMIC_JWT_TOKEN);
        console.log('request.cookies raw value::', cookies);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHluYW1pY1N0cmF0ZWd5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpYi9keW5hbWljU3RyYXRlZ3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsZ0RBQWdEO0FBQ2hELHlEQUE2QztBQUM3QywrQ0FBNEM7QUFVNUMsTUFBYSxlQUFnQixTQUFRLDRCQUFRO0lBTzNDLFlBQ0UsT0FBd0IsRUFDeEIsTUFBMkU7UUFFM0UsS0FBSyxFQUFFLENBQUM7UUFWVixvQkFBZSxHQUFHLGVBQWUsQ0FBQztRQUNsQyxTQUFJLEdBQUcsaUJBQWlCLENBQUM7UUFXdkIsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQztRQUVwQyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2QsTUFBTSxJQUFJLEtBQUssQ0FDYiw0REFBNEQsQ0FDN0QsQ0FBQztTQUNIO1FBRUQsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFFckIscUVBQXFFO1FBQ3JFLGtEQUFrRDtRQUNsRCxJQUFJLENBQUMsb0JBQW9CLEdBQUcsQ0FBQyxRQUFRLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxFQUFFO1lBQzNELElBQUksQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDeEIsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVELFlBQVksQ0FBQyxHQUFZLEVBQUUsUUFBYztRQUN2QyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRXZDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDVixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDNUM7UUFFRCxJQUFJLENBQUMsb0JBQW9CLENBQ3ZCLEdBQUcsRUFDSCxLQUFLLEVBQ0wsQ0FBQyxpQkFBc0IsRUFBRSxXQUFtQixFQUFFLEVBQUU7WUFDOUMsT0FBTyxJQUFBLHlCQUFXLEVBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsRUFBRTtnQkFDdEQsSUFBSSxHQUFHLEVBQUU7b0JBQ1AsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxHQUFHLENBQUMsQ0FBQztpQkFDeEM7cUJBQU07b0JBQ0wsTUFBTSxRQUFRLEdBQUcsQ0FBQyxLQUFVLEVBQUUsSUFBWSxFQUFFLElBQVksRUFBRSxFQUFFO3dCQUMxRCxJQUFJLEtBQUssRUFBRTs0QkFDVCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7eUJBQzFCOzZCQUFNLElBQUksQ0FBQyxJQUFJLEVBQUU7NEJBQ2hCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLENBQUMsQ0FBQzt5QkFDekM7NkJBQU07NEJBQ0wsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQzt5QkFDakM7b0JBQ0gsQ0FBQyxDQUFDO29CQUVGLElBQUk7d0JBQ0YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7cUJBQ2hDO29CQUFDLE9BQU8sRUFBTyxFQUFFO3dCQUNoQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7cUJBQ3ZCO2lCQUNGO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQ0YsQ0FBQztJQUNKLENBQUM7SUFFRCxjQUFjLENBQUMsT0FBZ0I7UUFDN0IsSUFBSSxRQUFRLEdBQWtCLElBQUksQ0FBQztRQUNuQyxNQUFNLE9BQU8sR0FBSSxPQUFlLENBQUMsT0FBTyxDQUFDO1FBQ3pDLElBQUksT0FBTyxPQUFPLEtBQUssUUFBUSxFQUFFO1lBQy9CLE9BQU8sQ0FBQyxJQUFJLENBQUMsa0NBQWtDLENBQUMsQ0FBQztTQUNsRDthQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUNqQyxPQUFPLENBQUMsSUFBSSxDQUFDLDZCQUE2QixDQUFDLENBQUM7U0FDN0M7YUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixFQUFFO1lBQ3JDLE9BQU8sQ0FBQyxJQUFJLENBQUMsb0RBQW9ELENBQUMsQ0FBQztTQUNwRTthQUFNLElBQUksT0FBTyxPQUFPLENBQUMsaUJBQWlCLEtBQUssUUFBUSxFQUFFO1lBQ3hELE9BQU8sQ0FBQyxJQUFJLENBQUMsbURBQW1ELENBQUMsQ0FBQztTQUNuRTtRQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsb0NBQW9DLEVBQUUsT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLGlCQUFpQixDQUFDLENBQUM7UUFDOUUsSUFDRSxPQUFPLE9BQU8sS0FBSyxRQUFRO1lBQzNCLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7WUFDdkIsT0FBTyxDQUFDLGlCQUFpQjtZQUN6QixPQUFPLE9BQU8sQ0FBQyxpQkFBaUIsS0FBSyxRQUFRLEVBQzdDO1lBQ0EsUUFBUSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQztTQUN0QzthQUFNO1lBQ0wsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7WUFDakQsSUFBSSxVQUFVLEVBQUU7Z0JBQ2QsTUFBTSxtQkFBbUIsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztnQkFDbkUsUUFBUSxHQUFHLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO2FBQ2hFO1NBQ0Y7UUFDRCxPQUFPLFFBQVEsQ0FBQztJQUNsQixDQUFDO0NBQ0Y7QUEvRkQsMENBK0ZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5jb21pbmdIdHRwSGVhZGVycyB9IGZyb20gJ2h0dHAyJztcbmltcG9ydCB7IEp3dCwgSnd0UGF5bG9hZCwgU2VjcmV0IH0gZnJvbSAnanNvbndlYnRva2VuJztcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1kdXBsaWNhdGUtaW1wb3J0c1xuaW1wb3J0IHsgU3RyYXRlZ3kgfSBmcm9tICdwYXNzcG9ydC1zdHJhdGVneSc7XG5pbXBvcnQgeyB2ZXJpZnlUb2tlbiB9IGZyb20gJy4vdmVyaWZ5VG9rZW4nO1xuXG5leHBvcnQgaW50ZXJmYWNlIFN0cmF0ZWd5T3B0aW9ucyB7XG4gIHB1YmxpY0tleTogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgUmVxdWVzdCB7XG4gIGhlYWRlcnM6IEluY29taW5nSHR0cEhlYWRlcnM7XG59XG5cbmV4cG9ydCBjbGFzcyBEeW5hbWljU3RyYXRlZ3kgZXh0ZW5kcyBTdHJhdGVneSB7XG4gIGF1dGhIZWFkZXJSZWdleCA9IC8oXFxTKylcXHMrKFxcUyspLztcbiAgbmFtZSA9ICdkeW5hbWljU3RyYXRlZ3knO1xuXG4gIF9zZWNyZXRPcktleVByb3ZpZGVyOiAocmVxdWVzdDogUmVxdWVzdCwgcmF3Snd0VG9rZW46IGFueSwgZG9uZTogYW55KSA9PiB2b2lkO1xuICB2ZXJpZnk6IChwYXlsb2FkOiBKd3QgfCBKd3RQYXlsb2FkIHwgc3RyaW5nIHwgdW5kZWZpbmVkLCBkb25lOiBhbnkpID0+IHZvaWQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgb3B0aW9uczogU3RyYXRlZ3lPcHRpb25zLFxuICAgIHZlcmlmeTogKHBheWxvYWQ6IEp3dCB8IEp3dFBheWxvYWQgfCBzdHJpbmcgfCB1bmRlZmluZWQsIGRvbmU6IGFueSkgPT4gdm9pZCxcbiAgKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIGNvbnN0IHB1YmxpY0tleSA9IG9wdGlvbnMucHVibGljS2V5O1xuXG4gICAgaWYgKCFwdWJsaWNLZXkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ1lvdSBtdXN0IHByb3ZpZGUgeW91ciBEeW5hbWljIHB1YmxpYyBrZXkgZm9yIHZlcmlmaWNhdGlvbi4nLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICB0aGlzLnZlcmlmeSA9IHZlcmlmeTtcblxuICAgIC8vIFBhc3Nwb3J0IGV4cGVjdHMgdGhpcyB0byBiZSBhIGNhbGxiYWNrLiBPdXIgcHVibGljS2V5IGlzIHN0YXRpYyBzb1xuICAgIC8vIHdlIHdyYXAgaXQgaW4gYSBzaW1wbGUgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGl0XG4gICAgdGhpcy5fc2VjcmV0T3JLZXlQcm92aWRlciA9IChfcmVxdWVzdCwgX3Jhd0p3dFRva2VuLCBkb25lKSA9PiB7XG4gICAgICBkb25lKG51bGwsIHB1YmxpY0tleSk7XG4gICAgfTtcbiAgfVxuXG4gIGF1dGhlbnRpY2F0ZShyZXE6IFJlcXVlc3QsIF9vcHRpb25zPzogYW55KSB7XG4gICAgY29uc3QgdG9rZW4gPSB0aGlzLmp3dEZyb21SZXF1ZXN0KHJlcSk7XG5cbiAgICBpZiAoIXRva2VuKSB7XG4gICAgICByZXR1cm4gdGhpcy5mYWlsKCdNaXNzaW5nIEpXVCB0b2tlbicsIDQwMSk7XG4gICAgfVxuXG4gICAgdGhpcy5fc2VjcmV0T3JLZXlQcm92aWRlcihcbiAgICAgIHJlcSxcbiAgICAgIHRva2VuLFxuICAgICAgKF9zZWNyZXRPcktleUVycm9yOiBhbnksIHNlY3JldE9yS2V5OiBTZWNyZXQpID0+IHtcbiAgICAgICAgcmV0dXJuIHZlcmlmeVRva2VuKHRva2VuLCBzZWNyZXRPcktleSwgKGVyciwgcGF5bG9hZCkgPT4ge1xuICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZhaWwoJ0ludmFsaWQgdG9rZW4nLCA0MDEpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB2ZXJpZmllZCA9IChlcnJvcjogYW55LCB1c2VyOiBvYmplY3QsIGluZm86IG9iamVjdCkgPT4ge1xuICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5lcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXVzZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5mYWlsKCdVc2VyIG5vdCBmb3VuZCcsIDQwMSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3VjY2Vzcyh1c2VyLCBpbmZvKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgdGhpcy52ZXJpZnkocGF5bG9hZCwgdmVyaWZpZWQpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXg6IGFueSkge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy5lcnJvcihleCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgKTtcbiAgfVxuXG4gIGp3dEZyb21SZXF1ZXN0KHJlcXVlc3Q6IFJlcXVlc3QpIHtcbiAgICBsZXQgand0VG9rZW46IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICAgIGNvbnN0IGNvb2tpZXMgPSAocmVxdWVzdCBhcyBhbnkpLmNvb2tpZXM7XG4gICAgaWYgKHR5cGVvZiBjb29raWVzICE9PSAnb2JqZWN0Jykge1xuICAgICAgY29uc29sZS53YXJuKCdyZXF1ZXN0LmNvb2tpZXMgaXMgbm90IGFuIG9iamVjdCcpO1xuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShjb29raWVzKSkge1xuICAgICAgY29uc29sZS53YXJuKCdyZXF1ZXN0LmNvb2tpZXMgaXMgYW4gYXJyYXknKTtcbiAgICB9IGVsc2UgaWYgKCFjb29raWVzLkRZTkFNSUNfSldUX1RPS0VOKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ3JlcXVlc3QuY29va2llcyBkb2VzIG5vdCBjb250YWluIERZTkFNSUNfSldUX1RPS0VOJyk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgY29va2llcy5EWU5BTUlDX0pXVF9UT0tFTiA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnNvbGUud2FybigncmVxdWVzdC5jb29raWVzLkRZTkFNSUNfSldUX1RPS0VOIGlzIG5vdCBhIHN0cmluZycpO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZygnVGhlIHJhdyB0b2tlbiB2YWx1ZSBpbiB0aGUgY29va2llOicsIGNvb2tpZXM/LkRZTkFNSUNfSldUX1RPS0VOKTtcbiAgICBpZiAoXG4gICAgICB0eXBlb2YgY29va2llcyA9PT0gJ29iamVjdCcgJiZcbiAgICAgICFBcnJheS5pc0FycmF5KGNvb2tpZXMpICYmXG4gICAgICBjb29raWVzLkRZTkFNSUNfSldUX1RPS0VOICYmXG4gICAgICB0eXBlb2YgY29va2llcy5EWU5BTUlDX0pXVF9UT0tFTiA9PT0gJ3N0cmluZydcbiAgICApIHtcbiAgICAgIGp3dFRva2VuID0gY29va2llcy5EWU5BTUlDX0pXVF9UT0tFTjtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgYXV0aEhlYWRlciA9IHJlcXVlc3QuaGVhZGVycy5hdXRob3JpemF0aW9uO1xuICAgICAgaWYgKGF1dGhIZWFkZXIpIHtcbiAgICAgICAgY29uc3QgYmVhcmVyU2NoZW1lTWF0Y2hlcyA9IGF1dGhIZWFkZXIubWF0Y2godGhpcy5hdXRoSGVhZGVyUmVnZXgpO1xuICAgICAgICBqd3RUb2tlbiA9IGJlYXJlclNjaGVtZU1hdGNoZXMgPyBiZWFyZXJTY2hlbWVNYXRjaGVzWzJdIDogbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGp3dFRva2VuO1xuICB9XG59XG4iXX0=