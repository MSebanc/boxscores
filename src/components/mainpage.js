import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSchedule } from '../utils/apicalls';
import { isValidDate, getDateStringToday } from '../utils/dateValidator';
import NavBar from './navbar';
import Title from './title';
import Scoreboard from './scoreboard';
import BoxScores from './boxscores';
import ScrollArrow from './scrollarrow';

function MainPage() {
    const navigate = useNavigate();
    const params = useParams();

    // Initialize with today's date if params.date is undefined
    const [date, setDate] = useState(() => {
        if (!params.date || !isValidDate(params.date)) {
            return getDateStringToday();
        }
        return params.date;
    });

    const [navbarHeight, setNavbarHeight] = useState(0);

    const navbarRef = useRef(null);
    const mainPageRef = useRef(null);

    useEffect(() => {
        if (!isValidDate(params.date)) {
            const today = getDateStringToday();
            setDate(today);
            document.title = `Box Scores | ${today}`;
            navigate(`/${today}`);
        } else {
            setDate(params.date);
            document.title = `Box Scores | ${params.date}`;
        }
    }, [params.date, navigate]);

    const updatePaddingTop = useCallback(() => {
        if (navbarRef.current && mainPageRef.current) {
            const height = navbarRef.current.offsetHeight;
            setNavbarHeight(height);
            mainPageRef.current.style.paddingTop = `${height + 5}px`;
        }
    }, []);

    useEffect(() => {
        updatePaddingTop();
        window.addEventListener('resize', updatePaddingTop);
        return () => window.removeEventListener('resize', updatePaddingTop);
    }, [updatePaddingTop]);

    const { data, loading, error } = useSchedule(date);

    if (error) {
        return <div>Error loading schedule data</div>;
    }

    return (
        <div ref={mainPageRef}>
            <NavBar date={date} ref={navbarRef} />
            <Title date={date} />
            <Scoreboard data={data} loading={loading} navbarHeight={navbarHeight} />
            <BoxScores data={data} loading={loading} />
            <ScrollArrow />
        </div>
    );
}

export default MainPage;