import express, { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Question, { TQuestion } from "../models/Question";
import { createQuestionValidators, idValidators, updateQuestionValidators } from './validators';

/**
 * Router for the question service.
 */

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello from question service!');
});

// Create a new question
router.post('/create', [
    ...createQuestionValidators,
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { title, description, category, complexity } = req.body;
        const question = { title, description, category, complexity };
        const newQuestion = new Question(question);
        await newQuestion.save();
        return res.status(200).json({ message: 'Question created succesfully', question: newQuestion });
    } catch (error) {
        return res.status(500).send('Internal server error');
    }
});

// Retrieve a specific question by id
router.get('/:id', [
    ...idValidators,
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const questionId = parseInt(req.params.id, 10);
    try {
        const question = await Question
            .findOne({ questionid: questionId })
            .exec();
        return res.json(question);
    }
    catch (error) {
        res.status(500).send('Internal server error');
    }
});

// Retrieve all questions
router.get('/all', async (req: Request, res: Response) => {
    try {
        const questions = await Question
            .find()
            .lean()
            .exec();
        return res.json(questions);
    }
    catch (error) {
        return res.status(500).send('Internal server error');
    }
});

// Update a specific question by id
router.post('/:id/update', [
    ...updateQuestionValidators,
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const questionId = parseInt(req.params.id);
    const updateData: Partial<TQuestion> = {};
    if (req.body.title) {
        updateData.title = req.body.title;
    }
    if (req.body.description) {
        updateData.description = req.body.description;
    }
    if (req.body.category) {
        updateData.category = req.body.category;
    }
    if (req.body.complexity) {
        updateData.complexity = req.body.complexity;
    }

    try {
        const updatedQuestion = await Question
            .findOneAndUpdate(
                { questionid: questionId },
                { $set: updateData },
            );
        return res.json(updatedQuestion);
    }
    catch (error) {
        return res.status(500).send('Internal server error');
    }
});

// Delete a specific question by id
router.post('/:id/delete', [
    ...idValidators,
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const questionId = parseInt(req.params.id);
    try {
        const deletedQuestion = await Question
            .findOneAndDelete({ questionid: questionId })
            .exec();
        return res.json(deletedQuestion);
    }
    catch (error) {
        return res.status(500).send('Internal server error');
    }
});

export default router;