import { HttpServer } from '../server/HttpServer';

// interface that each controller must implement
export interface ControllerInterface {
    initialize(httpServer: HttpServer): void;
}
