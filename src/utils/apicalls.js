import { useState, useEffect } from 'react';
import axios from 'axios';
import { isValidDate } from './dateValidator';

const API_CONFIG = {
    baseURL: 'https://statsapi.mlb.com/api/v1',
    endpoints: {
        schedule: (date) => `/schedule/games/?sportId=1&date=${date}`,
        linescore: (gamePk) => `/game/${gamePk}/linescore`,
        team: (teamId) => `/teams/${teamId}`,
        boxscore: (gamePk) => `/game/${gamePk}/boxscore`
    }
};

const useApiCall = (url, dependency, validator = null) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            if (validator && !validator(dependency)) {
                setError(null);
                setData(null);
                setLoading(false);
                return;
            }

            if (!dependency) {
                setError(null);
                setData(null);
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${API_CONFIG.baseURL}${url}`);
                setData(response.data);
                setError(null);
            } catch (error) {
                setError(error);
                setData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [dependency, url, validator]);

    return { data, loading, error };
};

function useSchedule(date) {
    return useApiCall(
        API_CONFIG.endpoints.schedule(date),
        date,
        isValidDate
    );
}

function useLineScore(gamePk) {
    return useApiCall(
        API_CONFIG.endpoints.linescore(gamePk),
        gamePk
    );
}

function useTeamInfo(teamId) {
    return useApiCall(
        API_CONFIG.endpoints.team(teamId),
        teamId
    );
}

function useBoxScore(gamePk) {
    return useApiCall(
        API_CONFIG.endpoints.boxscore(gamePk),
        gamePk
    );
}

export { useSchedule, useLineScore, useTeamInfo, useBoxScore };