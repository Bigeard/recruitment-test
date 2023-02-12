using InterviewTest.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using System.Collections.Generic;

namespace InterviewTest.Controllers
{
    public class ResultRequest {
        public int number;
    }

    [ApiController]
    [Route("[controller]")]
    public class EmployeesController : ControllerBase
    {
        private SqliteConnection CreateConnection()
        {
            var connectionStringBuilder = new SqliteConnectionStringBuilder { DataSource = "./SqliteDB.db" };
            var connection = new SqliteConnection(connectionStringBuilder.ConnectionString);
            connection.Open();
            return connection;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(GetAllEmployees());
        }

        [HttpPost]
        public IActionResult Add([FromBody] Employee employee)
        {
            var number = AddEmployee(employee);
            if (number < 1) return StatusCode(500); 
            return new JsonResult(new ResultRequest { number = number });
        }

        [HttpPut]
        public IActionResult Update(string name, [FromBody] Employee employee)
        {
            var number = UpdateEmployee(name, employee);
            if (number < 1) return StatusCode(500); 
            return new JsonResult(new ResultRequest { number = number });
        }

        [HttpDelete]
        public IActionResult Delete(string name)
        {
            var number = DeleteEmployee(name);
            if (number < 1) return StatusCode(500); 
            return new JsonResult(new ResultRequest { number = number });
        }

        // Get all employees
        public List<Employee> GetAllEmployees()
        {
            var employees = new List<Employee>();

            using (var connection = CreateConnection())
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

        // Add employee
        public int AddEmployee(Employee employee)
        {
            using (var connection = CreateConnection())
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
        public int UpdateEmployee(string name, Employee employee)
        {
            using (var connection = CreateConnection())
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
        public int DeleteEmployee(string name)
        {
            using (var connection = CreateConnection())
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
