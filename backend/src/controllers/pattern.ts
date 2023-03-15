import { HttpServer } from '../server/HttpServer';
import { patternService } from '../services/pattern';
import { ControllerInterface } from './controller';
import { Request, Response } from 'restify';
import { BadRequestError, HttpError } from 'restify-errors';

// openapi specifications define the swagger ui and represent the functionality of each endpoint
/**
 * @openapi
 * components:
 *   schemas:
 *     Pattern:
 *       type: object
 *       properties:
 *          name:
 *              type: string
 *          description:
 *              type: string
 *          matching_terms:
 *              type: array
 *              items:
 *                  type: string
 *          workflow_step:
 *              type: array
 *              items:
 *                  type: object     
 */

// controller for handling every operation related to the pattern data model
export class PatternController implements ControllerInterface {
    public initialize(httpServer: HttpServer): void {
        httpServer.get('/api/pattern', this.list.bind(this));
        httpServer.get('/api/pattern/:id', this.getById.bind(this));
        httpServer.post('/api/pattern', this.create.bind(this));
        httpServer.put('/api/pattern/:id', this.update.bind(this));
        httpServer.del('/api/pattern/:id', this.delete.bind(this));
    }


    /**
     * @openapi
     * /api/pattern:
     *   get:
     *     description: "Get all pattern documents from database"
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Pattern'
     *     security:
     *       - azureoAuth:
     *          - <SCOPE>
     *        
     */
    private async list(req: Request, res: Response): Promise<void> {
        try {
            res.send(await patternService.list());
        } catch (err) {
            res.send(new BadRequestError());
        }
    }

    /**
     * @openapi
     * /api/pattern/{id}:
     *   get:
     *     description: "Get a specific pattern document"
     *     parameters:
     *       - name: id
     *         in: path
     *         description: pattern document ID
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
     *               $ref: '#/components/schemas/Pattern'
     *       404:
     *         description: Not found
     *     security:
     *       - azureoAuth:
     *          - <SCOPE>
     *
     */
    private async getById(req: Request, res: Response): Promise<void> {
        try {
            res.send(await patternService.getByID(req.params.id));
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
     * /api/pattern:
     *   post:
     *     description: "Create new pattern document"
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Pattern'
     *     responses:
     *       201:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Pattern'
     *       400:
     *         description: Invalid status value
     *     security:
     *       - azureoAuth:
     *          - <SCOPE>
     *
     */
    private async create(req: Request, res: Response): Promise<void> {
        try {
            const response = await patternService.create(req.body);
            if (response) {
                res.send(201, response);
            } else {
                res.send(new BadRequestError());
            }
        } catch (err) {
            console.log(err);
            res.send(new BadRequestError());
        }
    }

    /**
     * @openapi
     * /api/pattern/{id}:
     *   put:
     *     description: "Update a specific pattern document"
     *     parameters:
     *       - name: id
     *         in: path
     *         description: pattern ID
     *         required: true
     *         schema:
     *           type: string
     *           format: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Pattern'
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Pattern'
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
            res.send(await patternService.update({ ...req.body, _id: req.params.id }));
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
     * /api/pattern/{id}:
     *   delete:
     *     description: "Delete a specific pattern document"
     *     parameters:
     *       - name: id
     *         in: path
     *         description: pattern document ID
     *         required: true
     *         schema:
     *           type: string
     *           format: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Pattern'
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
            res.send(204, await patternService.delete(req.params.id));
        } catch (err) {
            if (err instanceof HttpError) {
                res.send(err);
            } else {
                res.send(new BadRequestError());
            }
        }
    }
}