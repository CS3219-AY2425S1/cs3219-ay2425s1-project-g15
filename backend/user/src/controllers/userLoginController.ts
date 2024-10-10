import { Request, Response } from 'express';
import getUserCredentials from '../utils/getUserCredentials';
import userModel from '../models/userModel';

const userLoginController = async (req: Request, res: Response) => {
    const accessToken = req.headers.access_token;

    const userInfo = await getUserCredentials(accessToken);

    if (userInfo.error) {
        return res.status(401).json(userInfo);
    }

    const { name, email } = userInfo;

    try {
        const userDocument = await userModel.findOneAndUpdate(
            { email },
            { 
                $set: { lastLoggedIn: Date.now() },
                $setOnInsert: { username: name, email }
            },
            { upsert: true, new: true, runValidators: true }
        );

        console.log(userDocument)
    
        res.json(userDocument);
    } catch (err) {
        res.status(500).json({
            error: `Unable to login user: ${err}`
        });
    }
}

export default userLoginController;