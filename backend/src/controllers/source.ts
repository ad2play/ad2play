import { HttpServer } from '../server/HttpServer';
import { sourceService } from '../services/source';
import { ControllerInterface } from './controller';
import { Request, Response } from 'restify';
import { BadRequestError, HttpError } from 'restify-errors';

// openapi specifications define the swagger ui and represent the functionality of each endpoint
/**
 * @openapi
 * components:
 *   schemas:
 *     Source:
 *       type: object
 *       properties:
 *          name:
 *              type: string
 *          url:
 *              type: string
 *          last_fetch:
 *              type: string       
 */

// controller for handling every operation related to the source data model
export class SourceController implements ControllerInterface {
    public initialize(httpServer: HttpServer): void {
        httpServer.get('/api/source', this.list.bind(this));
        httpServer.get('/api/source/:id', this.getById.bind(this));
        httpServer.post('/api/source', this.create.bind(this));
        httpServer.put('/api/source/:id', this.update.bind(this));
        httpServer.del('/api/source/:id', this.delete.bind(this));
    }


    /**
     * @openapi
     * /api/source:
     *   get:
     *     description: "Get all source documents from database"
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Source'
     *     security:
     *       - azureoAuth:
     *          - <SCOPE>
     *        
     */
    private async list(req: Request, res: Response): Promise<void> {
        try {
            res.send(await sourceService.list());
        } catch (err) {
            res.send(new BadRequestError());
        }
    }

    /**
     * @openapi
     * /api/source/{id}:
     *   get:
     *     description: "Get a specific source document"
     *     parameters:
     *       - name: id
     *         in: path
     *         description: source document ID
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
     *               $ref: '#/components/schemas/Source'
     *       404:
     *         description: Not found
     *     security:
     *       - azureoAuth:
     *          - <SCOPE>
     *
     */
    private async getById(req: Request, res: Response): Promise<void> {
        try {
            res.send(await sourceService.getByID(req.params.id));
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
     * /api/source:
     *   post:
     *     description: "Create new source document"
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Source'
     *     responses:
     *       201:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Source'
     *       400:
     *         description: Invalid status value
     *     security:
     *       - azureoAuth:
     *          - <SCOPE>
     *
     */
    private async create(req: Request, res: Response): Promise<void> {
        try {
            const response = await sourceService.create(req.body);
            if (response) {
                res.send(201, response);
            } else {
                res.send(new BadRequestError());
            }
        } catch (err) {
            res.send(new BadRequestError());
        }
    }

    /**
     * @openapi
     * /api/source/{id}:
     *   put:
     *     description: "Update a specific source document"
     *     parameters:
     *       - name: id
     *         in: path
     *         description: source ID
     *         required: true
     *         schema:
     *           type: string
     *           format: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Source'
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Source'
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
            res.send(await sourceService.update({ ...req.body, _id: req.params.id }));
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
     * /api/source/{id}:
     *   delete:
     *     description: "Delete a specific source document"
     *     parameters:
     *       - name: id
     *         in: path
     *         description: source document ID
     *         required: true
     *         schema:
     *           type: string
     *           format: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Source'
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
            res.send(204, await sourceService.delete(req.params.id));
        } catch (err) {
            if (err instanceof HttpError) {
                res.send(err);
            } else {
                res.send(new BadRequestError());
            }
        }
    }
}