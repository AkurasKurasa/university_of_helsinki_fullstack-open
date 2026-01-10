// 9.4-9.7 Express server with TypeScript

import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
    res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
    const height = Number(req.query.height);
    const weight = Number(req.query.weight);

    if (isNaN(height) || isNaN(weight)) {
        res.status(400).json({ error: 'malformatted parameters' });
        return;
    }

    const bmi = calculateBmi(height, weight);
    res.json({
        weight,
        height,
        bmi
    });
});

app.post('/exercises', (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { daily_exercises, target } = req.body;

    if (!daily_exercises || !target) {
        res.status(400).json({ error: 'parameters missing' });
        return;
    }

    if (!Array.isArray(daily_exercises) || isNaN(Number(target))) {
        res.status(400).json({ error: 'malformatted parameters' });
        return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const dailyHours = daily_exercises.map(h => Number(h));

    if (dailyHours.some(h => isNaN(h))) {
        res.status(400).json({ error: 'malformatted parameters' });
        return;
    }

    const result = calculateExercises(dailyHours, Number(target));
    res.json(result);
});

const PORT = 3003;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
