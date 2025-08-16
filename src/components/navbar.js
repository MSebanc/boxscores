import React, { useEffect, useState, useCallback, forwardRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from 'rsuite';
import "rsuite/dist/rsuite.min.css";
import '../styles/navbar.css';

function convertToLocalDate(dateString) {
    const date = new Date(dateString);
    const timezoneOffset = date.getTimezoneOffset() * 60 * 1000;
    return new Date(date.getTime() + timezoneOffset);
}

const NavBar = forwardRef(({ date }, ref) => {
    const navigate = useNavigate();
    const [inputDate, setInputDate] = useState(date);
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 600);

    const isNextDayDisabled = useMemo(() => {
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);

        const today = new Date();

        // Compare just the date strings to avoid timezone issues
        const nextDayStr = nextDay.toISOString().slice(0, 10);
        const todayStr = today.toISOString().slice(0, 10);

        return nextDayStr > todayStr;
    }, [date]);

    useEffect(() => {
        setInputDate(date);
    }, [date]);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 600);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const changeDate = useCallback((days) => {
        const currentDate = new Date(date);
        currentDate.setDate(currentDate.getDate() + days);
        const newDate = currentDate.toISOString().slice(0, 10);
        navigate(`/${newDate}`);
    }, [date, navigate]);

    const handleInputChange = useCallback((date) => {
        if (!date || isNaN(date.getTime())) return;
        const newDate = date.toISOString().slice(0, 10);
        setInputDate(newDate);
    }, []);

    const handleInputBlurAndClose = useCallback(() => {
        navigate(`/${inputDate}`);
    }, [inputDate, navigate]);

    const handleOk = useCallback((date) => {
        const newDate = date.toISOString().slice(0, 10);
        navigate(`/${newDate}`);
    }, [navigate]);

    const disableFutureDates = useCallback((date) => {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        return date > currentDate;
    }, []);

    const handlePrevDay = useCallback(() => changeDate(-1), [changeDate]);
    const handleNextDay = useCallback(() => {
        if (!isNextDayDisabled) {
            changeDate(1);
        }
    }, [changeDate, isNextDayDisabled]);

    return (
        <nav className="nav" ref={ref}>
            <button className="button" onClick={handlePrevDay}>
                <span className="full-text">Previous Day</span>
                <span className="short-text">Prev Day</span>
            </button>
            <DatePicker
                format="yyyy-MM-dd"
                value={convertToLocalDate(inputDate)}
                onChange={handleInputChange}
                onBlur={handleInputBlurAndClose}
                onClose={handleInputBlurAndClose}
                onOk={handleOk}
                shouldDisableDate={disableFutureDates}
                className="date-picker"
                cleanable={false}
                size={isSmallScreen ? "m" : "lg"}
            />
            {!isNextDayDisabled ? (
                <button className="button" onClick={handleNextDay}>
                    <span>Next Day</span>
                </button>
            ) : (
                <button
                    className="button"
                    style={{
                        opacity: 0.3,
                        cursor: 'not-allowed',
                        pointerEvents: 'none'
                    }}
                >
                    <span>Next Day</span>
                </button>
            )}
        </nav>
    );
});

export default NavBar;