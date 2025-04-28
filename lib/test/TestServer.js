"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testServer = void 0;
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const supertest_1 = __importDefault(require("supertest"));
afterAll(async () => {
    await exports.testServer.close();
});
beforeAll(async () => {
    await exports.testServer.init();
});
beforeEach(() => {
    jest.clearAllMocks();
});
const isAuthorized = () => (req, res, next) => {
    try {
        return passport_1.default.authenticate('dynamicStrategy', {
            session: false,
            failWithError: true,
        })(req, res, next);
    }
    catch (err) {
        return next(err);
    }
};
class Server {
    constructor() {
        this.expressApp = (0, express_1.default)();
        this.expressApp.get('/user', isAuthorized(), function (req, res) {
            res.status(200).json(req.user);
        }, function (err, _req, res, next) {
            const status = err.status || 500;
            const errorMessage = err.message;
            res.status(status);
            res.json({
                error: errorMessage,
                status,
            });
            next();
        });
    }
    get app() {
        return this.expressApp;
    }
}
exports.default = Server;
class TestServer {
    constructor(cls = Server) {
        this.Klass = cls;
    }
    get app() {
        return (0, supertest_1.default)(this.testServer);
    }
    async init() {
        this.testApp = new this.Klass().app;
        this.testServer = (0, http_1.createServer)(this.testApp);
    }
    async close() {
        await this.testServer.close();
    }
}
exports.testServer = new TestServer();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVzdFNlcnZlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0L1Rlc3RTZXJ2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsK0JBQTBEO0FBRTFELHNEQUE4QjtBQUM5Qix3REFBZ0M7QUFDaEMsMERBQWtDO0FBRWxDLFFBQVEsQ0FBQyxLQUFLLElBQUksRUFBRTtJQUNsQixNQUFNLGtCQUFVLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDM0IsQ0FBQyxDQUFDLENBQUM7QUFFSCxTQUFTLENBQUMsS0FBSyxJQUFJLEVBQUU7SUFDbkIsTUFBTSxrQkFBVSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQzFCLENBQUMsQ0FBQyxDQUFDO0FBRUgsVUFBVSxDQUFDLEdBQUcsRUFBRTtJQUNkLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztBQUN2QixDQUFDLENBQUMsQ0FBQztBQUVILE1BQU0sWUFBWSxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBUSxFQUFFLEdBQVEsRUFBRSxJQUFTLEVBQUUsRUFBRTtJQUMzRCxJQUFJO1FBQ0YsT0FBTyxrQkFBUSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsRUFBRTtZQUM5QyxPQUFPLEVBQUUsS0FBSztZQUNkLGFBQWEsRUFBRSxJQUFJO1NBQ3BCLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ3BCO0lBQUMsT0FBTyxHQUFHLEVBQUU7UUFDWixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNsQjtBQUNILENBQUMsQ0FBQztBQUVGLE1BQU0sTUFBTTtJQUdWO1FBRmlCLGVBQVUsR0FBd0IsSUFBQSxpQkFBTyxHQUFFLENBQUM7UUFHM0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQ2pCLE9BQU8sRUFDUCxZQUFZLEVBQUUsRUFDZCxVQUFVLEdBQUcsRUFBRSxHQUFHO1lBQ2hCLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqQyxDQUFDLEVBQ0QsVUFBVSxHQUFRLEVBQUUsSUFBUyxFQUFFLEdBQVEsRUFBRSxJQUFTO1lBQ2hELE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFDO1lBQ2pDLE1BQU0sWUFBWSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUM7WUFFakMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUVuQixHQUFHLENBQUMsSUFBSSxDQUFDO2dCQUNQLEtBQUssRUFBRSxZQUFZO2dCQUNuQixNQUFNO2FBQ1AsQ0FBQyxDQUFDO1lBRUgsSUFBSSxFQUFFLENBQUM7UUFDVCxDQUFDLENBQ0YsQ0FBQztJQUNKLENBQUM7SUFFRCxJQUFXLEdBQUc7UUFDWixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDekIsQ0FBQztDQUNGO0FBRUQsa0JBQWUsTUFBTSxDQUFDO0FBRXRCLE1BQU0sVUFBVTtJQU9kLFlBQW1CLEdBQUcsR0FBRyxNQUFNO1FBQzdCLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO0lBQ25CLENBQUM7SUFFRCxJQUFXLEdBQUc7UUFDWixPQUFPLElBQUEsbUJBQVMsRUFBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVNLEtBQUssQ0FBQyxJQUFJO1FBQ2YsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUM7UUFDcEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFBLG1CQUFZLEVBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFTSxLQUFLLENBQUMsS0FBSztRQUNoQixNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDaEMsQ0FBQztDQUNGO0FBRVksUUFBQSxVQUFVLEdBQWUsSUFBSSxVQUFVLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNyZWF0ZVNlcnZlciwgU2VydmVyIGFzIEh0dHBTZXJ2ZXIgfSBmcm9tICdodHRwJztcblxuaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgcGFzc3BvcnQgZnJvbSAncGFzc3BvcnQnO1xuaW1wb3J0IHN1cGVydGVzdCBmcm9tICdzdXBlcnRlc3QnO1xuXG5hZnRlckFsbChhc3luYyAoKSA9PiB7XG4gIGF3YWl0IHRlc3RTZXJ2ZXIuY2xvc2UoKTtcbn0pO1xuXG5iZWZvcmVBbGwoYXN5bmMgKCkgPT4ge1xuICBhd2FpdCB0ZXN0U2VydmVyLmluaXQoKTtcbn0pO1xuXG5iZWZvcmVFYWNoKCgpID0+IHtcbiAgamVzdC5jbGVhckFsbE1vY2tzKCk7XG59KTtcblxuY29uc3QgaXNBdXRob3JpemVkID0gKCkgPT4gKHJlcTogYW55LCByZXM6IGFueSwgbmV4dDogYW55KSA9PiB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHBhc3Nwb3J0LmF1dGhlbnRpY2F0ZSgnZHluYW1pY1N0cmF0ZWd5Jywge1xuICAgICAgc2Vzc2lvbjogZmFsc2UsXG4gICAgICBmYWlsV2l0aEVycm9yOiB0cnVlLFxuICAgIH0pKHJlcSwgcmVzLCBuZXh0KTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmV0dXJuIG5leHQoZXJyKTtcbiAgfVxufTtcblxuY2xhc3MgU2VydmVyIHtcbiAgcHJpdmF0ZSByZWFkb25seSBleHByZXNzQXBwOiBleHByZXNzLkFwcGxpY2F0aW9uID0gZXhwcmVzcygpO1xuXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmV4cHJlc3NBcHAuZ2V0KFxuICAgICAgJy91c2VyJyxcbiAgICAgIGlzQXV0aG9yaXplZCgpLFxuICAgICAgZnVuY3Rpb24gKHJlcSwgcmVzKSB7XG4gICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHJlcS51c2VyKTtcbiAgICAgIH0sXG4gICAgICBmdW5jdGlvbiAoZXJyOiBhbnksIF9yZXE6IGFueSwgcmVzOiBhbnksIG5leHQ6IGFueSkge1xuICAgICAgICBjb25zdCBzdGF0dXMgPSBlcnIuc3RhdHVzIHx8IDUwMDtcbiAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gZXJyLm1lc3NhZ2U7XG5cbiAgICAgICAgcmVzLnN0YXR1cyhzdGF0dXMpO1xuXG4gICAgICAgIHJlcy5qc29uKHtcbiAgICAgICAgICBlcnJvcjogZXJyb3JNZXNzYWdlLFxuICAgICAgICAgIHN0YXR1cyxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbmV4dCgpO1xuICAgICAgfSxcbiAgICApO1xuICB9XG5cbiAgcHVibGljIGdldCBhcHAoKTogZXhwcmVzcy5BcHBsaWNhdGlvbiB7XG4gICAgcmV0dXJuIHRoaXMuZXhwcmVzc0FwcDtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTZXJ2ZXI7XG5cbmNsYXNzIFRlc3RTZXJ2ZXIge1xuICBwcml2YXRlIHRlc3RBcHAhOiBleHByZXNzLkFwcGxpY2F0aW9uO1xuXG4gIHByaXZhdGUgdGVzdFNlcnZlciE6IEh0dHBTZXJ2ZXI7XG5cbiAgcHJpdmF0ZSBLbGFzczogdHlwZW9mIFNlcnZlcjtcblxuICBwdWJsaWMgY29uc3RydWN0b3IoY2xzID0gU2VydmVyKSB7XG4gICAgdGhpcy5LbGFzcyA9IGNscztcbiAgfVxuXG4gIHB1YmxpYyBnZXQgYXBwKCk6IHN1cGVydGVzdC5TdXBlclRlc3Q8c3VwZXJ0ZXN0LlRlc3Q+IHtcbiAgICByZXR1cm4gc3VwZXJ0ZXN0KHRoaXMudGVzdFNlcnZlcik7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgaW5pdCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0aGlzLnRlc3RBcHAgPSBuZXcgdGhpcy5LbGFzcygpLmFwcDtcbiAgICB0aGlzLnRlc3RTZXJ2ZXIgPSBjcmVhdGVTZXJ2ZXIodGhpcy50ZXN0QXBwKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBjbG9zZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLnRlc3RTZXJ2ZXIuY2xvc2UoKTtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgdGVzdFNlcnZlcjogVGVzdFNlcnZlciA9IG5ldyBUZXN0U2VydmVyKCk7XG4iXX0=