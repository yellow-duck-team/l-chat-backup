import { useEffect, useState } from 'react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import './DateInput.css';
import './Antd-DateInput.css';

const today = new Date();

const DateInputRow = ({ inputValue, inputType, inputFunction }) => {
  return (
    <div className="date-input-row">
      <input
        value={inputValue}
        onChange={(e) => inputFunction(inputType, e.target.value)}
      />
    </div>
  );
};

function DateInput({ currDate }) {
  const [Year, setYear] = useState(today.getFullYear());
  const [Month, setMonth] = useState(today.getMonth() + 1);
  const [Date, setDate] = useState(today.getDate());

  useEffect(() => {
    if (!currDate?.year || !currDate.month || !currDate.date) return;
    setYear(currDate.year);
    setMonth(currDate.month);
    setDate(currDate.date);
  }, [currDate]);

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current > dayjs().endOf('day');
  };

  const onDate = (inputType, value) => {
    if (inputType === 'year') setYear(value);
    else if (inputType === 'month') setMonth(value);
    else if (inputType === 'date') setDate(value);
  };

  const onDatePicker = (date, dateString) => {
    console.log(date, dateString);
  };

  const getParent = () => {
    const dropdownArr = document.getElementsByClassName('ant-picker-dropdown');
    console.log(dropdownArr);
    if (dropdownArr && dropdownArr.length > 0) {
      const datePickerParent = dropdownArr[0].parentElement.parentElement;
      // datePickerParent.style.position = "relative";
      datePickerParent.style.zIndex = '1500';
      console.log(datePickerParent);
      datePickerParent.onclick = (e) => {
        // Prevent bubbling
        e.preventDefault();
        e.stopPropagation();
        console.log(datePickerParent);

        console.log(datePickerParent);
      };
    }
  };

  return (
    <div
      className="date-input flex-col"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <DatePicker
        disabledDate={disabledDate}
        onChange={onDatePicker}
        onClick={getParent}
      />
      {/* <DateInputRow inputValue={Year} inputFunction={onDate} inputType="year" />
      <DateInputRow
        inputValue={Month}
        inputFunction={onDate}
        inputType="month"
      />
      <DateInputRow inputValue={Date} inputFunction={onDate} inputType="date" /> */}
      {/* <input type="date" max={`${Year}-${Month}-${Date}`} /> */}
    </div>
  );
}

export default DateInput;
