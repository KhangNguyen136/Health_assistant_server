
    /**
     * @openapi
     * components:
     *  schemas:
     *    lich su chat:
     *      type: object
     *      properties:
     *        ask:
     *          type: array
     *          items:
     *            type: string
     *        answer:
     *          type: array
     *          items:
     *            type: object
     *            properties:
     *              type:
     *                type: string
     *              content:
     *                type: string
     *              percen:
     *                type: number
     *        create_date:
     *          type: string
     *          format: date-time
     *        create_user:
     *          type: objectid
     *        status:
     *          type: integer
     */

     module.exports = mongoose => {
        var Schema = mongoose.Schema,
            ObjectId = Schema.ObjectId;
    
        var schema = mongoose.Schema({
            ask: String,
            answer: [{}],
            create_date: Date,
            create_user: ObjectId,
            status: Number
        }, { timestamps: true });
    
        schema.index({tieu_de: 'text', 'profile.something': 'text'});
        
        const Historychat = mongoose.model("Historychat", schema, 'Historychat');
        return Historychat;
    
    };