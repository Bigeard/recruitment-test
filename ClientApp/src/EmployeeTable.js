import React, { useState, useEffect } from "react";


const EmployeeTable = () => {
    const [employeeList, setEmployeeList] = useState([]);
    const [name, setName] = useState("");
    const [value, setValue] = useState(0);

    const [onEditIndex, setOnEditIndex] = useState(null);
    const [nameEdit, setNameEdit] = useState("");
    const [valueEdit, setValueEdit] = useState(0);

    useEffect(() => {
        fetch('http://localhost:5000/Employees')
            .then((response) => response.json())
            .then((data) => {
                setEmployeeList(data);
            })
    });

    // ADD EMPLOYEE
    const handleSubmit = (event) => {
        event.preventDefault();
        setEmployeeList([...employeeList, { name, value }]);
        setName("");
        setValue(0);
    };

    // REMOVE EMPLOYEE
    const handleRemove = (index) => {
        setEmployeeList(employeeList.filter((_, i) => i !== index));
    };

    // EDIT EMPLOYEE
    const handleEdit = (index, employee) => {
        setNameEdit(employee.name);
        setValueEdit(employee.value);
        setOnEditIndex(index);
    };

    const handleCancelEdit = (index) => {
        setOnEditIndex(null);
    };

    const handleSubmitEdit = (index) => {
        // DO IT
    };

    const onEditDisplay = (index) => {
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
                    <button onClick={() => handleCancelEdit(index)}>Cancel</button>
                    <button onClick={() => handleSubmitEdit(index)}>Submit</button>
                </td>
            </tr>
        )
    }

    return (
        <div>
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
                        onEditDisplay(index) : 
                        (
                            <tr key={index}>
                                <td>{employee.name}</td>
                                <td>{employee.value}</td>
                                <td>
                                    <button onClick={() => handleEdit(index, employee)}>Edit</button>
                                    <button onClick={() => handleRemove(index)}>Remove</button>
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