import { HttpServer } from '../server/HttpServer';
import { playbookService } from '../services/playbook';
import { ControllerInterface } from './controller';
import { Request, Response } from 'restify';
import { BadRequestError, HttpError } from 'restify-errors';

// openapi specifications define the swagger ui and represent the functionality of each endpoint
/**
 * @openapi
 * components:
 *   schemas:
 *     Playbook:
 *       type: object
 *       
 */

// controller for handling every operation related to the playbook data model
export class PlaybookController implements ControllerInterface {
    public initialize(httpServer: HttpServer): void {
        httpServer.get('/api/playbook', this.list.bind(this));
        httpServer.get('/api/playbook/:id', this.getById.bind(this));
        httpServer.post('/api/playbook', this.create.bind(this));
        httpServer.put('/api/playbook/:id', this.update.bind(this));
        httpServer.del('/api/playbook/:id', this.delete.bind(this));
    }


    /**
     * @openapi
     * /api/playbook:
     *   get:
     *     description: "Get all playbooks from database"
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Playbook'
     *     security:
     *       - azureoAuth:
     *          - <SCOPE>
     *        
     */
    private async list(req: Request, res: Response): Promise<void> {
        try {
            res.send(await playbookService.list());
        } catch (err) {
            res.send(new BadRequestError());
        }
    }

    /**
     * @openapi
     * /api/playbook/{id}:
     *   get:
     *     description: "Get a specific playbook"
     *     parameters:
     *       - name: id
     *         in: path
     *         description: playbook ID
     *         required: true
     *         schema: 
     *           type: string
     *           format: string
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Playbook'
     *       404:
     *         description: Not found
     *     security:
     *       - azureoAuth:
     *          - <SCOPE>
     *
     */
    private async getById(req: Request, res: Response): Promise<void> {
        try {
            res.send(await playbookService.getByID(req.params.id));
        } catch (err) {
            if (err instanceof HttpError) {
                res.send(err);
            } else {
                res.send(new BadRequestError());
            }
        }
    }

    /**
     * @openapi
     * /api/playbook:
     *   post:
     *     description: "Create new playbook"
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Playbook'
     *     responses:
     *       201:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Playbook'
     *       400:
     *         description: Invalid status value
     *     security:
     *       - azureoAuth:
     *          - <SCOPE>
     *
     */
    private async create(req: Request, res: Response): Promise<void> {
        try {
            const response = await playbookService.create(req.body);
            if (response) {
                res.send(201, response);
            } else {
                res.send(new BadRequestError());
            }
        } catch (err) {
            console.log(err)
            res.send(new BadRequestError());
        }
    }

    /**
     * @openapi
     * /api/playbook/{id}:
     *   put:
     *     description: "Update a specific playbook"
     *     parameters:
     *       - name: id
     *         in: path
     *         description: playbook ID
     *         required: true
     *         schema:
     *           type: string
     *           format: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Playbook'
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Playbook'
     *       400:
     *         description: Invalid status value
     *       404:
     *         description: Not found
     *     security:
     *       - azureoAuth:
     *          - <SCOPE>
     *
     */
    private async update(req: Request, res: Response): Promise<void> {
        try {
            res.send(await playbookService.update({ ...req.body, _id: req.params.id }));
        } catch (err) {
            if (err instanceof HttpError) {
                res.send(err);
            } else {
                res.send(new BadRequestError());
            }
        }
    }

    /**
     * @openapi
     * /api/playbook/{id}:
     *   delete:
     *     description: "Delete a specific playbook"
     *     parameters:
     *       - name: id
     *         in: path
     *         description: playbook ID
     *         required: true
     *         schema:
     *           type: string
     *           format: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Playbook'
     *     responses:
     *       204:
     *         description: OK
     *       400:
     *         description: Invalid status value
     *       404:
     *         description: Not found
     *     security:
     *       - azureoAuth:
     *          - <SCOPE>
     *
     */
    private async delete(req: Request, res: Response): Promise<void> {
        try {
            res.send(204, await playbookService.delete(req.params.id));
        } catch (err) {
            if (err instanceof HttpError) {
                res.send(err);
            } else {
                res.send(new BadRequestError());
            }
        }
    }
}