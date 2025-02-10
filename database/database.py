import sqlite3

# Define database path
db_path = "./backend/database/question_data.db"

# Connect to the database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()


# drop unit
cursor.execute("DROP TABLE IF EXISTS unit")
conn.commit()  # Save changes

cursor.execute("""
    CREATE TABLE IF NOT EXISTS unit (
        unit CHAR(10) NOT NULL UNIQUE
    )
""")
conn.commit()  # Save changes

cursor.execute("INSERT INTO unit (unit) VALUES ('g')")
conn.commit()  
cursor.execute("INSERT INTO unit (unit) VALUES ('ug')")
conn.commit()  
cursor.execute("INSERT INTO unit (unit) VALUES ('mg')")
conn.commit()  

cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
conn.commit()  # Save changes
# Fetch and print all table names
tables = cursor.fetchall()
print("\nTables in the database:")
for table in tables:
    print(table[0])


# Close the connection
conn.close()
