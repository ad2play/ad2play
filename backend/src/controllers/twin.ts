import { HttpServer } from '../server/HttpServer';
import { twinService } from '../services/twin';
import { ControllerInterface } from './controller';
import { Request, Response } from 'restify';
import { BadRequestError } from 'restify-errors';

// openapi specifications define the swagger ui and represent the functionality of each endpoint
/**
 * @openapi
 * components:
 *   schemas:
 *     Twin:
 *       type: object      
 */

// controller for providing a single endpoint that alles the frontend to retrieve the twin information
export class TwinController implements ControllerInterface {
    public initialize(httpServer: HttpServer): void {
        httpServer.get('/api/twin', this.list.bind(this));
    }


    /**
     * @openapi
     * /api/twin:
     *   get:
     *     description: "Get all information from the Digital Twins"
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Twin'
     *     security:
     *       - azureoAuth:
     *          - <SCOPE>
     *        
     */
    private async list(req: Request, res: Response): Promise<void> {
        try {
            res.send(await twinService.list());
        } catch (err) {
            res.send(new BadRequestError());
        }
    }
}