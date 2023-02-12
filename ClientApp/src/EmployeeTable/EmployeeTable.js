import React, { useState, useEffect } from "react";
import './EmployeeTable.css';

const EmployeeTable = () => {
    const [init, setInit] = useState(false);

    const [employeeList, setEmployeeList] = useState([]);
    const [name, setName] = useState("");
    const [value, setValue] = useState(0);

    const [onEdit, setOnEdit] = useState(null);
    const [nameEdit, setNameEdit] = useState("");
    const [valueEdit, setValueEdit] = useState(0);

    const [status, setStatus] = useState(null);
    const [abcSum, setAbcSum] = useState(0);


    // GET ALL EMPLOYEE
    useEffect(() => {
        if (!init) {
            setInit(true);
            getAllEmployees();
        }
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

    // GET ALL EMPLOYEE
    const getAllEmployees = () => {
        fetch('http://localhost:5000/Employees')
            .then((response) => response.json())
            .then((data) => {
                setEmployeeList(data);
            })
            .then(() => getAbcSum())
            .catch((error) => setStatus(error.message));
    }

    // ADD EMPLOYEE
    const handleSubmit = (event) => {
        event.preventDefault();
        setStatus(null);
        fetch('http://localhost:5000/Employees', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                Name: name,
                Value: value
            }),
        }).then((response) => response.json())
            .then((data) => {
                if (data.statusInfo) {
                    setStatus(data.statusInfo);
                }
                else if (data.status === 500) {
                    setStatus(`${data.title} - Status ${data.status} - POST /Employees`);
                }
                else {
                    setEmployeeList([...employeeList, { name, value }]);
                }
            })
            .then(() => getAbcSum())
            .catch((error) => setStatus(error.message));
        setName("");
        setValue(0);
    };

    // UPDATE EMPLOYEE
    const handleEdit = (event, index, employee) => {
        event.preventDefault();
        setNameEdit(employee.name);
        setValueEdit(employee.value);
        setOnEdit({index, employee});
    };

    const handleCancelEdit = (event) => {
        event.preventDefault();
        setOnEdit(null);
    };

    const handleSubmitEdit = (event) => {
        setStatus(null);
        event.preventDefault();
        fetch('http://localhost:5000/Employees?' + new URLSearchParams({ name: onEdit.employee.name }), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                Name: nameEdit,
                Value: valueEdit
            }),
        }).then((response) => response.json())
            .then((data) => {
                if (data.statusInfo) {
                    setStatus(data.statusInfo);
                }
                else if (data.status === 500) {
                    setStatus(`${data.title} - Status ${data.status} - PUT /Employees?${new URLSearchParams({ name: onEdit.employee.name })}`);
                }
                else {
                    const newEmployeeList = [...employeeList];
                    newEmployeeList[onEdit.index] = { name: nameEdit, value: valueEdit };
                    setEmployeeList(newEmployeeList);
                    setOnEdit(null);
                }
            })
            .then(() => getAbcSum())
            .catch((error) => setStatus(error.message));
    };

    const onEditDisplay = (index, employeeName) => {
        return (
            <tr key={index}>
                <td>
                    <input
                        type="text"
                        value={nameEdit}
                        onChange={(e) => setNameEdit(e.target.value)}
                    />
                </td>
                <td>
                    <input
                        type="number"
                        value={valueEdit}
                        onChange={(e) => setValueEdit(e.target.value)}
                    />
                </td>
                <td className="action">
                    <button onClick={(e) => handleCancelEdit(e)}>Cancel</button>
                    <button type="submit">Submit</button> 
                    {/*  onClick={(e) => handleSubmitEdit(e, index, employeeName)}  */}
                </td>
            </tr>
        )
    }

    // DELETE EMPLOYEE
    const handleDelete = (event, index, employeeName) => {
        event.preventDefault();
        fetch('http://localhost:5000/Employees?' + new URLSearchParams({ name: employeeName }), {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 500) {
                    setStatus(`${data.title} - Status ${data.status} - DELETE /Employees?${new URLSearchParams({ name: employeeName })}`);
                }
                else {
                    setEmployeeList(employeeList.filter((_, i) => i !== index));
                }
            })
            .then(() => getAbcSum())
            .catch((error) => setStatus(error.message));
    };

    const handleIncrement = (event) => {
        event.preventDefault();
        fetch('http://localhost:5000/List/increment', { method: 'PUT' })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 500) {
                    setStatus(`${data.title} - Status ${data.status} - PUT /List/increment`);
                }
            })
            .then(() => getAllEmployees())
            .catch((error) => setStatus(error.message))
    }

    const getAbcSum = () => {
        fetch('http://localhost:5000/List/getAbcSum')
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 500) {
                    setStatus(`${data.title} - Status ${data.status} - GET /List/abcSum`);
                }
                else {
                    setAbcSum(data.number);
                }
            })
            .catch((error) => setStatus(error.message))
    }

    return (
        <div>
            {displayStatus()}

            <div>
                <button className="button-increment" onClick={handleIncrement}>Increment</button>
                <span>ABC Sum: {abcSum}</span>
            </div>

            {/* Add employee form */}
            <form id="formAddEmployee" onSubmit={handleSubmit}>
                <div className="form-name form-field">
                    <label for="name">Name</label>
                    <input
                        id="name"
                        placeholder="Enter the employee's name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="form-value form-field">
                    <label for="value">Value</label>
                    <input
                        id="value"
                        type="number"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                </div>
                <button type="submit">Add Employee</button>
            </form>

            {/* Form edit employee */}
            <form id="form_edit" onSubmit={handleSubmitEdit}>

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
                            (onEdit != null && onEdit.index === index) ?
                                onEditDisplay(index, employee.name) : // edit display for employees with inputs and buttons
                                (
                                    <tr key={index}>
                                        <td>{employee.name}</td>
                                        <td>{employee.value}</td>
                                        <td className="action">
                                            <button onClick={(e) => handleEdit(e, index, employee)}>Edit</button>
                                            <button onClick={(e) => handleDelete(e, index, employee.name)}>Delete</button>
                                        </td>
                                    </tr>
                                )
                        )}
                    </tbody>
                </table>
            </form>

        </div>
    );
}

export default EmployeeTable;