const LEADERBOARD_KEY = 'genAiArcadeLeaderboard';
const MAX_SCORES = 10;

export const getScores = () => {
    try {
        const scoresJSON = localStorage.getItem(LEADERBOARD_KEY);
        if (!scoresJSON) return [];
        const scores = JSON.parse(scoresJSON);
        return scores.sort((a, b) => b.score - a.score);
    } catch (error) {
        console.error("Failed to parse scores from localStorage", error);
        return [];
    }
};

export const addScore = (name, score) => {
    const newScore = {
        name: name.trim(),
        score: score,
        date: new Date().toISOString(),
    };

    const scores = getScores();
    scores.push(newScore);

    const updatedScores = scores
        .sort((a, b) => b.score - a.score)
        .slice(0, MAX_SCORES);

    try {
        localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updatedScores));
    } catch (error) {
        console.error("Failed to save scores to localStorage", error);
    }
};