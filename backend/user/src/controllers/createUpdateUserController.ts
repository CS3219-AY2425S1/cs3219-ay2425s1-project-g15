import { Request, Response } from 'express';
import userModel from '../models/userModel';
import getUserCredentials from '../utils/getUserCredentials';

const createUpdateUserController = async (req: Request, res: Response) => {
    const accessToken = req.headers.access_token;
    const updateFields = req.body;

    const userInfo = await getUserCredentials(accessToken);

    if (userInfo.error) {
        return res.status(401).json(userInfo);
    }

    const { email } = userInfo;

    try {
        const userDocument = await userModel.findOneAndUpdate(
            { email },
            { $set: updateFields},
            { new: true, runValidators: true }
        );
    
        res.json(userDocument);
    } catch (err) {
        res.status(500).json({
            error: `Unable to create or update user: ${err}`
        });
    }
}

export default createUpdateUserController;