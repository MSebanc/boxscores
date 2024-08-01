import { useState, useEffect } from 'react';
import axios from 'axios';
import { isValidDate } from './dateValidator';

function useSchedule(date) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        if (!isValidDate(date)) {
            setError(null);
            setData(null);
            setLoading(false);
            return;
        }
        axios.get(`https://statsapi.mlb.com/api/v1/schedule/games/?sportId=1&date=${date}`)
            .then(response => {
                setData(response.data);
                setError(null);
            })
            .catch(error => {
                setError(error);
                setData(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [date]);

    return { data, loading, error };
}

function useLineScore(gamePk) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        if (!gamePk) {
            setError(null);
            setData(null);
            setLoading(false);
            return;
        }
        axios.get(`https://statsapi.mlb.com/api/v1/game/${gamePk}/linescore`)
            .then(response => {
                setData(response.data);
                setError(null);
            })
            .catch(error => {
                setError(error);
                setData(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [gamePk]);

    return { data, loading, error };
}

function useTeamInfo(teamId) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        if (!teamId) {
            setError(null);
            setData(null);
            setLoading(false);
            return;
        }
        axios.get(`https://statsapi.mlb.com/api/v1/teams/${teamId}`)
            .then(response => {
                setData(response.data);
                setError(null);
            })
            .catch(error => {
                setError(error);
                setData(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [teamId]);

    return { data, loading, error };
}

function useBoxScore(gamePk) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        if (!gamePk) {
            setError(null);
            setData(null);
            setLoading(false);
            return;
        }
        axios.get(`https://statsapi.mlb.com/api/v1/game/${gamePk}/boxscore`)
            .then(response => {
                setData(response.data);
                setError(null);
            })
            .catch(error => {
                setError(error);
                setData(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [gamePk]);

    return { data, loading, error };
}

export { useSchedule, useLineScore, useTeamInfo, useBoxScore };