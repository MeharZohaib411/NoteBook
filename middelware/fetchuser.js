    const jwt  = require ('jsonwebtoken');
    const JWT_SECRET = "meharisagoodboy";

    const fetchuser =(req,res,next)=>{
        const token = req.header('auth-token');
        if (!token) {
            res.status(401).send({error: "please authenticate a valiud token "})
        }
        try {
            const data = jwt.verify(token, JWT_SECRET);
            req.user = data;
            next();
            
        } catch (error) {
            res.status(401).send({error: "please authenticate a valiud token "})
            
        }
    }

    module.exports = fetchuser;