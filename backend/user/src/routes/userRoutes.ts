import express from 'express';
import createUpdateUserController from '../controllers/createUpdateUserController';
import getUserController from '../controllers/getUserController';
import userLoginController from '../controllers/userLoginController';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello from user service!');
});

// USER LOGIN
router.get("/login", userLoginController);

// GET USER
router.get("/get", getUserController);

// UPDATE USER
router.post("/update", createUpdateUserController);

export default router;