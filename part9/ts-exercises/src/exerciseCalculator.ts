// 9.2 Exercise Calculator

interface ExerciseValues {
    target: number;
    dailyHours: number[];
}

interface Result {
    periodLength: number;
    trainingDays: number;
    success: boolean;
    rating: number;
    ratingDescription: string;
    target: number;
    average: number;
}

const parseExerciseArguments = (args: string[]): ExerciseValues => {
    if (args.length < 4) throw new Error('Not enough arguments');

    const target = Number(args[2]);
    const dailyHours = args.slice(3).map(h => Number(h));

    if (isNaN(target) || dailyHours.some(h => isNaN(h))) {
        throw new Error('Provided values were not numbers!');
    }

    return { target, dailyHours };
};

export const calculateExercises = (dailyHours: number[], target: number): Result => {
    const periodLength = dailyHours.length;
    const trainingDays = dailyHours.filter(h => h > 0).length;
    const average = dailyHours.reduce((sum, h) => sum + h, 0) / periodLength;
    const success = average >= target;

    let rating: number;
    let ratingDescription: string;

    if (average >= target) {
        rating = 3;
        ratingDescription = 'excellent, target reached!';
    } else if (average >= target * 0.75) {
        rating = 2;
        ratingDescription = 'not too bad but could be better';
    } else {
        rating = 1;
        ratingDescription = 'bad';
    }

    return {
        periodLength,
        trainingDays,
        success,
        rating,
        ratingDescription,
        target,
        average
    };
};

try {
    const { target, dailyHours } = parseExerciseArguments(process.argv);
    console.log(calculateExercises(dailyHours, target));
} catch (error: unknown) {
    let errorMessage = 'Something bad happened.';
    if (error instanceof Error) {
        errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
}
