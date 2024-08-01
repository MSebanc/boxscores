import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {DatePicker} from 'rsuite';
import "rsuite/dist/rsuite.min.css";
import '../styles/navbar.css';

function convertToLocalDate(dateString) {
    let date = new Date(dateString);
    let timezoneOffset = date.getTimezoneOffset() * 60 * 1000;
    return new Date(date.getTime() + timezoneOffset);
}

function NavBar({ date }, ref) {
    const navigate = useNavigate();
    const [inputDate, setInputDate] = useState(date);

    useEffect(() => {
        setInputDate(date);
    }, [date]);

    const changeDate = (days) => {
        let currentDate = new Date(date);
        currentDate.setDate(currentDate.getDate() + days);
        let newDate = currentDate.toISOString().slice(0,10);
        navigate(`/${newDate}`);
    }

    const handleInputChange = (date) => {
        if (!date || isNaN(date.getTime())) return;
        let newDate = date.toISOString().slice(0,10);
        setInputDate(newDate);
    }

    const handleInputBlurAndClose = () => {
        navigate(`/${inputDate}`);
    }

    const handleOk = (date) => {
        let newDate = date.toISOString().slice(0,10);
        navigate(`/${newDate}`);
    }

    const disableFutureDates = (date) => {
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Set the time to 00:00:00 to compare only the date
        return date > currentDate;
    }

    return (
        <nav className="nav" ref={ref}>
            <button className="button" onClick={() => changeDate(-1)}>Previous Day</button>
            <DatePicker format="yyyy-MM-dd"
                        value={convertToLocalDate(inputDate)}
                        onChange={handleInputChange}
                        onBlur={handleInputBlurAndClose}
                        onClose={handleInputBlurAndClose}
                        onOk={handleOk}
                        shouldDisableDate={disableFutureDates}
                        className="date-picker"
                        cleanable={false}
                        size="lg"
            />
            <button className="button" onClick={() => changeDate(1)}>Next Day</button>
        </nav>
    );
}

export default React.forwardRef(NavBar);