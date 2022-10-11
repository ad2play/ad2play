import { HttpServer } from '../server/HttpServer';
import { csafService } from '../services/csaf';
import { ControllerInterface } from './controller';
import { Request, Response } from 'restify';
import { BadRequestError, HttpError } from 'restify-errors';
import util from 'util'
import fs from 'fs'
const readFile = util.promisify(fs.readFile);

// openapi specifications define the content of the swagger ui for the backend functionality
/**
 * @openapi
 * components:
 *   schemas:
 *     CSAF:
 *       type: object
 *       
 */

// controller handling every action related to the CSAF data model
export class CSAFController implements ControllerInterface {
    public initialize(httpServer: HttpServer): void {
        httpServer.get('/api/csaf', this.list.bind(this));
        httpServer.get('/api/csaf/:id', this.getById.bind(this));
        httpServer.post('/api/csaf', this.create.bind(this));
        httpServer.put('/api/csaf/:id', this.update.bind(this));
        httpServer.del('/api/csaf/:id', this.delete.bind(this));
    }


    /**
     * @openapi
     * /api/csaf:
     *   get:
     *     description: "Get all csaf documents from database"
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/CSAF'
     *     security:
     *       - azureoAuth:
     *          - <SCOPE>
     *        
     */
    private async list(req: Request, res: Response): Promise<void> {
        try {
            res.send(await csafService.list());
        } catch (err) {
            res.send(new BadRequestError());
        }
    }

    /**
     * @openapi
     * /api/csaf/{id}:
     *   get:
     *     description: "Get a specific csaf document"
     *     parameters:
     *       - name: id
     *         in: path
     *         description: csaf document ID
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
     *               $ref: '#/components/schemas/CSAF'
     *       404:
     *         description: Not found
     *     security:
     *       - azureoAuth:
     *          - <SCOPE>
     *
     */
    private async getById(req: Request, res: Response): Promise<void> {
        try {
            res.send(await csafService.getByID(req.params.id));
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
     * /api/csaf:
     *   post:
     *     description: "Create new csaf document"
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CSAF'
     *     responses:
     *       201:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/CSAF'
     *       400:
     *         description: Invalid status value
     *     security:
     *       - azureoAuth:
     *          - <SCOPE>
     *
     */
    private async create(req: Request, res: Response): Promise<void> {
        try {

            let data = {};
            if (req.files) {
                if (req.files.csafjson) {
                    const csafjson = JSON.parse((await readFile(req.files.csafjson.path, {})).toString());
                    data = csafjson;
                }
            } else {
                data = req.body;
            }

            const response = await csafService.create(data);
            if (response) {
                res.send(201, response);
            } else {
                res.send(new BadRequestError());
            }
        } catch (err) {
            res.send(new BadRequestError());
            console.log(err)
        }
    }

    /**
     * @openapi
     * /api/csaf/{id}:
     *   put:
     *     description: "Update a specific csaf document"
     *     parameters:
     *       - name: id
     *         in: path
     *         description: csaf ID
     *         required: true
     *         schema:
     *           type: string
     *           format: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CSAF'
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/CSAF'
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
            res.send(await csafService.update({ ...req.body, _id: req.params.id }));
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
     * /api/csaf/{id}:
     *   delete:
     *     description: "Delete a specific csaf document"
     *     parameters:
     *       - name: id
     *         in: path
     *         description: csaf document ID
     *         required: true
     *         schema:
     *           type: string
     *           format: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CSAF'
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
            res.send(204, await csafService.delete(req.params.id));
        } catch (err) {
            if (err instanceof HttpError) {
                res.send(err);
            } else {
                res.send(new BadRequestError());
            }
        }
    }
}