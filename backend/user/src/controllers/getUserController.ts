import { Request, Response } from 'express';
import getUserCredentials from '../utils/getUserCredentials';
import userModel from '../models/userModel';

const getUserController = async (req: Request, res: Response) => {
    const accessToken = req.headers.access_token;
    
    const userInfo = await getUserCredentials(accessToken);

    if (userInfo.error) {
        return res.status(401).json(userInfo);
    }

    const { email } = userInfo;

    try {
        const userDocument = await userModel.findOne({ email });
        res.json(userDocument);
    } catch (err) {
        res.status(500).json({
            error: `Unable to get user: ${err}`
        });
    }
}

export default getUserController;