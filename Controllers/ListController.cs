using InterviewTest.Model;
using Microsoft.AspNetCore.Mvc;
using System;

namespace InterviewTest.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ListController : ControllerBase
    {
        // I Action Result

        [HttpPut]
        [Route("/[controller]/increment")]
        public IActionResult Increment()
        {
            var number = IncrementEmployeeValues();
            if (number < 1) return StatusCode(500); 
            return new JsonResult(new { number = number });
        }

        [HttpGet]
        [Route("/[controller]/getAbcSum")]
        public IActionResult GetAbcSum()
        {
            var abcSum = FindAbcSum();
            if (abcSum < 1117) {
                return new JsonResult(new { number = 0 });
            }
            return new JsonResult(new { number = abcSum });
        }

        // SERVICES

        private int IncrementEmployeeValues()
        {
            using (var connection = SqliteDatabase.CreateConnection())
            {
                using (var queryCmd = connection.CreateCommand())
                {
                    queryCmd.CommandText = @"UPDATE Employees 
                                            SET Value = Value + 
                                            CASE 
                                                WHEN SUBSTR(Name, 1, 1) = 'E' THEN 1
                                                WHEN SUBSTR(Name, 1, 1) = 'G' THEN 10
                                                ELSE 100
                                            END";
                    return queryCmd.ExecuteNonQuery();
                }
            }
        }

        private int FindAbcSum()
        {
            var abcSum = 0;
            using (var connection = SqliteDatabase.CreateConnection())
            {
                using (var queryCmd = connection.CreateCommand())
                {
                    queryCmd.CommandText = @"SELECT SUM(Value) 
                                            FROM Employees
                                            WHERE SUBSTR(Name, 1, 1) IN ('A', 'B', 'C')";
                    abcSum = Convert.ToInt32(queryCmd.ExecuteScalar());
                }
            }
            return abcSum;
        }

    }
}
