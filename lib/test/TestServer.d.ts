import express from 'express';
import supertest from 'supertest';
declare class Server {
    private readonly expressApp;
    constructor();
    get app(): express.Application;
}
export default Server;
declare class TestServer {
    private testApp;
    private testServer;
    private Klass;
    constructor(cls?: typeof Server);
    get app(): supertest.SuperTest<supertest.Test>;
    init(): Promise<void>;
    close(): Promise<void>;
}
export declare const testServer: TestServer;
