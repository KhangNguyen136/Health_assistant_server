const illness = require("../controllers/illnessController");
let express = require('express');
let router = express.Router();
const YAML = require('yaml');


/**
 * @openapi
 * /api/illness/search:
 *   get:
 *     tags:
 *     - Illness
 *     description: Tìm kiếm bệnh theo tên (có phân trang)
 *     parameters:
 *      - name: name
 *        in: path
 *        description: Tên bệnh
 *        required: false
 *      - name: limit
 *        in: path
 *        description: Số lượng kết quả trên một trang
 *        required: true
 *      - name: page
 *        in: path
 *        description: Trang muốn tìm kiếm
 *        required: false
 *     responses:
 *       '200':
 *         description: danh sách các bệnh, danh sách trang và tổng số bệnh tìm được.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Illness"
 *                 message:
 *                   type: string
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '500':
 *         description: Sever Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

router.get("/search/", illness.searchbyName);

// Create a new Illness
router.post("/", illness.create);

// Retrieve all Illnesss
router.get("/", illness.findAll);

// Retrieve all published Illnesss
router.get("/published", illness.findAllPublished);

// Retrieve a single Illness with id
router.get("/:id", illness.findOne);

// Update a Illness with id
router.put("/:id", illness.update);

// Delete a Illness with id
router.delete("/:id", illness.delete);

module.exports = router;