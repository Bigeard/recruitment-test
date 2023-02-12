using InterviewTest.Model;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace InterviewTest.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EmployeesController : ControllerBase
    {
        // I Action Result

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(GetAllEmployees());
        }

        [HttpPost]
        public IActionResult Add([FromBody] Employee employee)
        {
            if (employee.Name.Length < 1) return new JsonResult(new { statusInfo = "Error you need to have at least one letter" });
            if (GetEmployeeExist(employee)) return new JsonResult(new { statusInfo = "Error the employee already exists" });
            var number = AddEmployee(employee);
            if (number < 1) return StatusCode(500);
            return new JsonResult(new { number = number });
        }

        [HttpPut]
        public IActionResult Update(string name, [FromBody] Employee employee)
        {
            if (!name.Equals(employee.Name))
            {
                if (GetEmployeeExist(employee))
                {
                    return new JsonResult(new { statusInfo = "Error the employee already exists" });
                }
            }
            var number = UpdateEmployee(name, employee);
            if (number < 1) return StatusCode(500);
            return new JsonResult(new { number = number });
        }

        [HttpDelete]
        public IActionResult Delete(string name)
        {
            var number = DeleteEmployee(name);
            if (number < 1) return StatusCode(500);
            return new JsonResult(new { number = number });
        }


        // SERVICES

        // Get all employees
        private List<Employee> GetAllEmployees()
        {
            var employees = new List<Employee>();

            using (var connection = SqliteDatabase.CreateConnection())
            {
                connection.Open();

                var queryCmd = connection.CreateCommand();
                queryCmd.CommandText = @"SELECT Name, Value FROM Employees";
                using (var reader = queryCmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        employees.Add(new Employee
                        {
                            Name = reader.GetString(0),
                            Value = reader.GetInt32(1)
                        });
                    }
                }
            }

            return employees;
        }

        // Get employee
        private bool GetEmployeeExist(Employee employee)
        {
            using (var connection = SqliteDatabase.CreateConnection())
            {
                using (var queryCmd = connection.CreateCommand())
                {
                    queryCmd.CommandText = @"SELECT 1 FROM Employees WHERE Name = @Name";
                    queryCmd.Parameters.AddWithValue("@Name", employee.Name);
                    var reader = queryCmd.ExecuteReader();
                    return reader.HasRows;
                }
            }
        }

        // Add employee
        private int AddEmployee(Employee employee)
        {
            using (var connection = SqliteDatabase.CreateConnection())
            {
                using (var queryCmd = connection.CreateCommand())
                {
                    queryCmd.CommandText = @"INSERT INTO Employees (Name, Value) VALUES (@Name, @Value)";
                    queryCmd.Parameters.AddWithValue("@Name", employee.Name);
                    queryCmd.Parameters.AddWithValue("@Value", employee.Value);
                    return queryCmd.ExecuteNonQuery();
                }
            }
        }

        // Update employee
        private int UpdateEmployee(string name, Employee employee)
        {
            using (var connection = SqliteDatabase.CreateConnection())
            {
                using (var queryCmd = connection.CreateCommand())
                {
                    queryCmd.CommandText = @"UPDATE Employees SET Name = @Name, Value = @Value WHERE Name = @PreviousName";
                    queryCmd.Parameters.AddWithValue("@Name", employee.Name);
                    queryCmd.Parameters.AddWithValue("@Value", employee.Value);
                    queryCmd.Parameters.AddWithValue("@PreviousName", name);
                    return queryCmd.ExecuteNonQuery();
                }
            }
        }

        // Delete Employee
        private int DeleteEmployee(string name)
        {
            using (var connection = SqliteDatabase.CreateConnection())
            {
                using (var queryCmd = connection.CreateCommand())
                {
                    queryCmd.CommandText = @"DELETE FROM Employees WHERE Name = @Name";
                    queryCmd.Parameters.AddWithValue("@Name", name);
                    return queryCmd.ExecuteNonQuery();
                }
            }

        }
    }
}
