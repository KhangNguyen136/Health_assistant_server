export default async function diagnose(req, res, next) {
    try {
        const data = req.body
        console.log(data);
    } catch (error) {
        next(error);
    }
}