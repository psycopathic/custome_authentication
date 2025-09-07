import { Request, Response } from "express";

const getUser = (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        if(!id || isNaN(Number(id))) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        
    } catch (error) {
        console.log(`Error in getUser: ${error}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export default getUser;
