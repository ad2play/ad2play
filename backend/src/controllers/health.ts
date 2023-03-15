import { HttpServer } from '../server/HttpServer';
import { ControllerInterface } from './controller';
import { Request, Response } from 'restify';

// controller only for the purpose of checking if the system is running correctly by a simple request
export class HealthController implements ControllerInterface {
    public initialize(httpServer: HttpServer): void {
        httpServer.get('/health', this.list.bind(this));
    }

    /**
     * @openapi
     * /health:
     *   get:
     *     description: Health Service
     *     responses:
     *       200:
     *         description: Returns a mysterious string.
     */
    private async list(req: Request, res: Response): Promise<void> {
        res.send(200);
    }
}
