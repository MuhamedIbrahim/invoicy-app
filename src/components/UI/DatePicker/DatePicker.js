import React from 'react';
import Picker from 'react-date-picker/dist/entry.nostyle';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import './DatePicker.css';
import './Calendar.css';

const DatePicker = React.memo((props) => {
    return (
        <Picker
            value={props.value}
            className={props.className}
            onChange={props.payload ? value => props.changed(props.payload, value) : props.changed}
            calendarIcon={<CalendarTodayIcon />}
            dayPlaceholder="dd"
            monthPlaceholder="mm"
            yearPlaceholder="yyyy"
            clearIcon={null}
        />
    );
});

export default DatePicker;