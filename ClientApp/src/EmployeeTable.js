import React, { useState, useEffect } from "react";


const EmployeeTable = () => {
    const [employeeList, setEmployeeList] = useState([]);
    const [name, setName] = useState("");
    const [value, setValue] = useState(0);

    const [onEditIndex, setOnEditIndex] = useState(null);
    const [nameEdit, setNameEdit] = useState("");
    const [valueEdit, setValueEdit] = useState(0);

    const [status, setStatus] = useState(null);

    // GET ALL EMPLOYEE
    useEffect(() => {
        fetch('http://localhost:5000/Employees')
            .then((response) => response.json())
            .then((data) => {
                setEmployeeList(data);
            })
    });

    const displayStatus = () => {
        if (status != null) {
            return (
                <div>
                    <span>{status}</span><button onClick={() => setStatus(null)}>X</button>
                </div>
            )
        }
    }

    // ADD EMPLOYEE
    const handleSubmit = (event) => {
        event.preventDefault();
        fetch('http://localhost:5000/Employees', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                Name: name,
                Value: value
            }),
        }).then((response) => response.json())
            .then((data) => {
                if (data.status === 400) {
                    setStatus(`${data.title} - Status ${data.status}`);
                }
                else {
                    setEmployeeList([...employeeList, { name, value }]);
                }
            })
            .catch((error) => setStatus(error.message))
        setName("");
        setValue(0);
    };

    // UPDATE EMPLOYEE
    const handleEdit = (index, employee) => {
        setNameEdit(employee.name);
        setValueEdit(employee.value);
        setOnEditIndex(index);
    };

    const handleCancelEdit = () => {
        setOnEditIndex(null);
    };

    const handleSubmitEdit = (index, employeeName) => {
        fetch('http://localhost:5000/Employees?' + new URLSearchParams({ name: employeeName }), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                Name: nameEdit,
                Value: valueEdit
            }),
        }).then((response) => response.json())
            .then((data) => {
                if (data.status === 400) {
                    setStatus(`${data.title} - Status ${data.status}`);
                }
                else {
                    employeeList[index] = { name, value };
                }
            })
            .catch((error) => setStatus(error.message))
        setOnEditIndex(null);
    };

    const onEditDisplay = (index, employeeName) => {
        return (
            <tr key={index}>
                <td>
                    <input
                        type="text"
                        value={nameEdit}
                        onChange={(event) => setNameEdit(event.target.value)}
                    />
                </td>
                <td>
                    <input
                        type="number"
                        value={valueEdit}
                        onChange={(event) => setValueEdit(event.target.value)}
                    />
                </td>
                <td>
                    <button onClick={() => handleCancelEdit()}>Cancel</button>
                    <button onClick={() => handleSubmitEdit(index, employeeName)}>Submit</button>
                </td>
            </tr>
        )
    }

    // DELETE EMPLOYEE
    const handleRemove = (index, employeeName) => {
        fetch('http://localhost:5000/Employees?' + new URLSearchParams({ name: employeeName }), {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 400) {
                    setStatus(`${data.title} - Status ${data.status}`);
                }
                else {
                    setEmployeeList(employeeList.filter((_, i) => i !== index));
                }
            })
            .catch((error) => setStatus(error.message))
    };

    return (
        <div>
            {displayStatus()}

            {/* Add employee form */}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />
                <input
                    type="number"
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                />
                <button type="submit">Add Employee</button>
            </form>

            {/* List of employees */}
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Value</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employeeList.map((employee, index) =>
                        (onEditIndex != null && onEditIndex === index) ?
                            onEditDisplay(index, employee.name) : // edit display for employees with inputs and buttons
                            (
                                <tr key={index}>
                                    <td>{employee.name}</td>
                                    <td>{employee.value}</td>
                                    <td>
                                        <button onClick={() => handleEdit(index, employee)}>Edit</button>
                                        <button onClick={() => handleRemove(index, employee.name)}>Remove</button>
                                    </td>
                                </tr>
                            )
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default EmployeeTable;