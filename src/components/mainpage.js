import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSchedule } from '../utils/apicalls';
import {isValidDate, getDateStringToday} from '../utils/dateValidator';
import NavBar from './navbar';
import Title from './title';
import Scoreboard from './scoreboard';
import BoxScores from './boxscores';
import ScrollArrow from './scrollarrow';

function MainPage() {
    const navigate = useNavigate();
    const params = useParams();

    const [date, setDate] = useState(params.date);

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

    const updatePaddingTop = () => {
        if (navbarRef.current && mainPageRef.current) {
            const navbarHeight = navbarRef.current.offsetHeight;
            mainPageRef.current.style.paddingTop = `${navbarHeight + 5}px`;
        }
    };

    useEffect(() => {
        updatePaddingTop();
        window.addEventListener('resize', updatePaddingTop);
        return () => window.removeEventListener('resize', updatePaddingTop);
    }, []);

    const { data, loading, error } = useSchedule(date);

    useEffect(() => {
        if (data) {
            console.log(data);
        }
        if (loading) {
            console.log('loading');
        }
        if (error) {
            console.log(error);
        }
    }, [data, loading, error]);

    return (
        <div ref={mainPageRef}>
            <NavBar date={date} ref={navbarRef} />
            <Title date={date} />
            <Scoreboard data={data} loading={loading} navbarHeight={navbarRef.current ? navbarRef.current.offsetHeight : 0} />
            <BoxScores data={data} loading={loading} />
            <ScrollArrow />
        </div>
    );
}

export default MainPage;