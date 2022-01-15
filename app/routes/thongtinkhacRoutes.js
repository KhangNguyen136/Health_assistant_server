const thong_tin_y_te_khac = require("../controllers/searchImformationController");
let express = require('express');
let router = express.Router();
const YAML = require('yaml');


/**
 * @openapi
 * /api/thong_tin_y_te_khac/search:
 *   get:
 *     tags:
 *     - Thong tin y te Khac
 *     description: tim kiem cac thong tin khac ngoai cac thong tin binh thuong cuar benh
 *     parameters:
 *      - name: name
 *        in: path
 *        description: Tên bệnh
 *        required: false
 *     responses:
 *       '200':
 *         description: danh sach cac thong tin gan giong nhat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Thong tin y te khac"
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

router.get("/search/", thong_tin_y_te_khac.searchbyName);


module.exports = router;