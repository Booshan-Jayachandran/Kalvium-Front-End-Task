import React, { useState, useEffect } from 'react';

function AttendanceSystem() {
  const [attendanceList, setAttendanceList] = useState([]);
  const [currentStudent, setCurrentStudent] = useState({
    rollNumber: '',
    firstName: '',
    lastName: '',
    department: 'Choose',
    section: 'Choose',
  });

  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  // State to track whether the roll number contains an alphabet
  const [rollNumberHasAlphabet, setRollNumberHasAlphabet] = useState(false);
  // State to track whether the first name contains invalid characters
  const [firstNameHasInvalidCharacters, setFirstNameHasInvalidCharacters] = useState(false);
  // State to track whether the last name contains invalid characters
  const [lastNameHasInvalidCharacters, setLastNameHasInvalidCharacters] = useState(false);

  useEffect(() => {
    // Function to update current date and time
    const updateDateTime = () => {
      const now = new Date();
      const formattedDate = now.toLocaleDateString();
      const formattedTime = now.toLocaleTimeString();

      setCurrentDate(formattedDate);
      setCurrentTime(formattedTime);
    };

    // Update current date and time initially
    updateDateTime();

    // Update current date and time every second
    const interval = setInterval(updateDateTime, 1000);

    // Cleanup when the component unmounts
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Define regular expressions for input validation
    const rollNumberRegex = /^[0-9]*$/; // Only numbers
    const nameRegex = /^[A-Za-z .]*$/;  // Alphabets, space, and full stop

    // Validate input based on the field name
    if (name === 'rollNumber') {
      if (!rollNumberRegex.test(value)) {
        setRollNumberHasAlphabet(true);
      } else {
        setRollNumberHasAlphabet(false);
      }
    }

    if (name === 'firstName') {
      if (!nameRegex.test(value)) {
        setFirstNameHasInvalidCharacters(true);
      } else {
        setFirstNameHasInvalidCharacters(false);
      }
    }

    if (name === 'lastName') {
      if (!nameRegex.test(value)) {
        setLastNameHasInvalidCharacters(true);
      } else {
        setLastNameHasInvalidCharacters(false);
      }
    }

    setCurrentStudent({
      ...currentStudent,
      [name]: value,
    });
  };

  const handleAddAttendance = () => {
    if (
      currentStudent.firstName &&
      currentStudent.lastName &&
      currentStudent.rollNumber &&
      currentStudent.department !== 'Choose' &&
      currentStudent.section !== 'Choose' &&
      !rollNumberHasAlphabet &&
      !firstNameHasInvalidCharacters &&
      !lastNameHasInvalidCharacters
    ) {
      // Add the current date and time to the student object
      const now = new Date();
      currentStudent.dateTime = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;

      setAttendanceList([...attendanceList, currentStudent]);
      setCurrentStudent({
        rollNumber: '',
        firstName: '',
        lastName: '',
        department: 'Choose',
        section: 'Choose',
      });

      // Reset validation flags
      setRollNumberHasAlphabet(false);
      setFirstNameHasInvalidCharacters(false);
      setLastNameHasInvalidCharacters(false);
    }
  };

  const departmentOptions = [
    'Choose',
    'CSE(general)',
    'CSE(AIML)',
    'CSE(CSBS)',
    'CSE(BDA)',
    'Mech',
    'VisCom',
    'EEE',
    'ECE',
  ];

  const sectionOptions = ['Choose', 'A', 'B', 'C', 'D', 'E', 'F', 'G'];

  return (
    <div>
      {/* Current Date and Time */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          backgroundColor: 'lightgray',
          padding: '5px',
          textAlign: 'right',
        }}
      >
        <div>Date: {currentDate}</div>
        <div>Time: {currentTime}</div>
      </div>

      {/* Rest of the content */}
      <h1>Attendance System</h1>
      <div className="form-container">
        <div>
          <label htmlFor="rollNumber">Roll Number:</label>
          <input
            type="text"
            id="rollNumber"
            name="rollNumber"
            value={currentStudent.rollNumber}
            onChange={handleInputChange}
          />
          {rollNumberHasAlphabet && (
            <span className="error">X</span>
          )}
        </div>
        <div className="name-container">
          <div className="name-field">
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={currentStudent.firstName}
              onChange={handleInputChange}
            />
            {firstNameHasInvalidCharacters && (
              <span className="error">X</span>
            )}
          </div>
          <div className="name-field">
            <label htmlFor="lastName">Last Name:</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={currentStudent.lastName}
              onChange={handleInputChange}
            />
            {lastNameHasInvalidCharacters && (
              <span className="error">X</span>
            )}
          </div>
        </div>
        <div>
          <label htmlFor="department">Department:</label>
          <select
            id="department"
            name="department"
            value={currentStudent.department}
            onChange={handleInputChange}
          >
            {departmentOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="section">Section:</label>
          <select
            id="section"
            name="section"
            value={currentStudent.section}
            onChange={handleInputChange}
          >
            {sectionOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <button onClick={handleAddAttendance} disabled={rollNumberHasAlphabet || firstNameHasInvalidCharacters || lastNameHasInvalidCharacters}>Mark Attendance</button>
      </div>
      <h2>Attendance History (Last 20 Records)</h2>
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Roll Number</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Department</th>
            <th>Section</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {attendanceList
            .slice(-20)
            .map((student, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{student.rollNumber}</td>
                <td>{student.firstName}</td>
                <td>{student.lastName}</td>
                <td>{student.department}</td>
                <td>{student.section}</td>
                <td>{student.dateTime.split(' ')[0]}</td>
                <td>{student.dateTime.split(' ')[1]}</td>
              </tr>
            ))}
        </tbody>
      </table>
      {/* Footer */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          backgroundColor: 'lightgray',
          padding: '5px',
          textAlign: 'center',
        }}
      >
        <p>
          Facing any issues? Contact us at{' '}
          <a href="mailto:booshan.jv@gmail.com">booshan.jv@gmail.com</a>
        </p>
        <p>We are also open to DMs if you love it!!</p>
      </div>
    </div>
  );
}

export default AttendanceSystem;
