import { HttpServer } from '../server/HttpServer';
import { taskService } from '../services/task';
import { ControllerInterface } from './controller';
import { Request, Response } from 'restify';
import { BadRequestError, HttpError } from 'restify-errors';

// openapi specifications define the swagger ui and represent the functionality of each endpoint
/**
 * @openapi
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *          type:
 *              type: string
 *          description:
 *              type: string
 *          assigned_to:
 *              type: string
 *          manual_action_required:
 *              type: boolean
 *          done:
 *              type: boolean
 *          approved:
 *              type: boolean
 *          created:
 *              type: string
 *          modified:
 *              type: string
 *          csaf_files:
 *              type: array
 *              items:
 *                  type: string
 *          playbook:
 *              type: array
 *              items:
 *                  type: string    
 */

// controller for handling every operation related to the task data model
export class TaskController implements ControllerInterface {
    public initialize(httpServer: HttpServer): void {
        httpServer.get('/api/task', this.list.bind(this));
        httpServer.get('/api/task/:id', this.getById.bind(this));
        httpServer.post('/api/task', this.create.bind(this));
        httpServer.put('/api/task/:id', this.update.bind(this));
        httpServer.del('/api/task/:id', this.delete.bind(this));
    }


    /**
     * @openapi
     * /api/task:
     *   get:
     *     description: "Get all task documents from database"
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Task'
     *     security:
     *       - azureoAuth:
     *          - <SCOPE>
     *        
     */
    private async list(req: Request, res: Response): Promise<void> {
        try {
            res.send(await taskService.list());
        } catch (err) {
            res.send(new BadRequestError());
        }
    }

    /**
     * @openapi
     * /api/task/{id}:
     *   get:
     *     description: "Get a specific task document"
     *     parameters:
     *       - name: id
     *         in: path
     *         description: task document ID
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
     *               $ref: '#/components/schemas/Task'
     *       404:
     *         description: Not found
     *     security:
     *       - azureoAuth:
     *          - <SCOPE>
     *
     */
    private async getById(req: Request, res: Response): Promise<void> {
        try {
            res.send(await taskService.getByID(req.params.id));
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
     * /api/task:
     *   post:
     *     description: "Create new task document"
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Task'
     *     responses:
     *       201:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Task'
     *       400:
     *         description: Invalid status value
     *     security:
     *       - azureoAuth:
     *          - <SCOPE>
     *
     */
    private async create(req: Request, res: Response): Promise<void> {
        try {
            const response = await taskService.create(req.body);
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
     * /api/task/{id}:
     *   put:
     *     description: "Update a specific task document"
     *     parameters:
     *       - name: id
     *         in: path
     *         description: task ID
     *         required: true
     *         schema:
     *           type: string
     *           format: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Task'
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Task'
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
            res.send(await taskService.update({ ...req.body, _id: req.params.id }));
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
     * /api/task/{id}:
     *   delete:
     *     description: "Delete a specific task document"
     *     parameters:
     *       - name: id
     *         in: path
     *         description: task document ID
     *         required: true
     *         schema:
     *           type: string
     *           format: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Task'
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
            res.send(204, await taskService.delete(req.params.id));
        } catch (err) {
            if (err instanceof HttpError) {
                res.send(err);
            } else {
                res.send(new BadRequestError());
            }
        }
    }
}
