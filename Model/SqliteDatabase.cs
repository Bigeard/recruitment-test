using Microsoft.Data.Sqlite;

namespace InterviewTest.Model
{
    public class SqliteDatabase
    {
        static public SqliteConnection CreateConnection()
        {
            var connectionStringBuilder = new SqliteConnectionStringBuilder { DataSource = "./SqliteDB.db" };
            var connection = new SqliteConnection(connectionStringBuilder.ConnectionString);
            connection.Open();
            return connection;
        }
    }
}
