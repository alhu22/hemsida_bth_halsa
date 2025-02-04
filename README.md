# läkemedelsberäkningar
Hemsida för läkemedelsstudenterna på BTH ska kunna öva på olika läkemedelsberäkningar.


## Databas

| id | question | anser_unit | answer_formula | variating_values | course | question_type |
id(int): UID with auto increment
question(text): The string for the question
    Ex. "Question %%var_name%%kg rest of question %%var_name2%%?"
answer_unit(text): The unit of the answer store as string.
    Ex. "kg"
    Ex. "ml/s"
answer_formula(text): A string with the formula to calculate the answer using the variables.
    Ex. "var_name + var_name2"
variating_values(text): A string in JSON format that sets the rules to generate the values for the question.
    Ex. "{'var_name': [50, 70], 'var_name2': [10, 20]}"
course(text): The course code for the question two letters and 4 numbers. (This will later be connected to a course database with the name of the course as well)
    Ex. "ab1234"
question_type(text): Short string describing the question type
    Ex. "Enhetsomvandling"

{
    "question": "Omvandla %%var_name%%kg till %%var_name2%%g.",
    "answer_unit": "g",
    "answer_formula": "var_name * 1000",
    "variating_values": "{ 'var_name': [50, 70], 'var_name2': [10, 20] }",
    "course": "KM1423",
    "question_type": "Enhetsomvandling"
}

### Formatera Frågor
Variabler representeras i frågot med %%variabel_namn%%.
    Innanför %% får der endast vara stora och små bockstäver a-z, A-Z, siffror 0-9, och _. Inga mellanslag.
    Dock måste variabelnamnet börja med en bokstav. (a-z, A-Z)
    Om endast %%name%% eller %%namn%% sätts in i frågan kommer det att automatiskt ersättas med ett slumpmässigt namn från en lista.
    Variabel namn som är 'upptagna':
        condition: För att kunna generera regler kring hur variabelvärderna bestäms.
        name & namn: För att ståppa in ett slumpmäsigt namn.

### Formatera Varierande Variabler
Vilka värden som variabeln ska anta kan defineras på olika sätt.
    Vill man ha att det är sen siffera mellan två tal är det [minsta, största]
        Ex. [4, 16] då är dert ett heltal mellan 4 och 16
    Vill man att det ska anta ett värde i en lista av värden så representeras det genom en lista på dessa siffror. [tal1, tal2, tal3, ..., taln]
        NOTE: Om man vill ha valet mellan två tal måste man skriva det största talet först sedan det minsta talet. (UNDERLINE THIS SECTION)
        NOTE: Om man skriver 3 tal så måste det tredje talet vara större än andra - första
        Ex. [20, 10]
        Ex. [5, 10, 15, 20]
        Ex. [1, 0.5, 10]
    Vill man att värdena ska anta ett flyttal (att sifferan har decimaler) går det att indikera som ett tredje element i en lista [minsta, största, steg]. (UNDERLINE THIS SECTION) 
        NOTE: steg måste vara mindre än största talet - minsta talet.
        Ex. [1, 10, 0.1] Då är det ett slumpmässigt tal mellan 1 och 10 med en decimal.
        Ex. [-10, 10, 0.01] Då är det ett slumpmässigt tal mellan -10 och 10 med två decimal.
        Ex. [1, 5, 0.5] Då är det ett slumpmässigt tal mellan 1 och 5 med steg av 0.5.
    Det går också att ha en lista av karaktärer eller ord som variablen kan anta.
        Ex. ['a', 'b', 'c', ..., 'n']
        Ex. ['Medicin 1', 'Medicin 2', ..., 'Medicin n']

#### Avancerat
Om man vill ha mer kontroll över variabelgenereringen går det genom att lägga till en sträng som extra variable. Kalla den condition (UNDERLINE THIS WORD AND BOLD) och formatera strängen efter de nedanstående reglerna.
    Om en variabel måste vara störe/mindre än eller störe/mindre eller lika med en annan använd:
        Större: big_var > small_var
        Större eller lika med: big_var >= small_var
        Mindre: small_var < big_var
        Mindre eller lika med: small_var <= big_var

    Om du har en variabel för till exempel en medicin, %%medicin_typ%% och olika mediciner har olika doser så kan man kalla en variabel %%valfritt_namn_1%% som man vill ska vara dosen. 
    Frågan hade kunnat se ut som:
        "Om läkaren skriver up %%valfritt_namn_1%%mg av %%medicin_typ%% ..."
            vi antar att medicin_typ är ['Medicin 1', 'Medicin 2', 'Medicin 3']

    Om man då inte lägger till en [lista] för valfritt_namn_1(underline) istället skriver du:
        valfritt_namn_1 = medicin_typ ? [2,5,10], [3,6,8], [1,5, 0.5]
            Då kommer valfritt_namn_1 att anta värdet i den listan som är på 'samma plats'
                är det Medicin 1 blir valfritt_namn_1 = [2,5,10]
                är det Medicin 2 blir valfritt_namn_1 = [3,6,8]
                och så vidare...
            NOTE: Det måste vara lika många listor efter ? som det finns alternativ för medicin_typ.
                Om det är så att Medicin 1 och 2 har samma får man skriva det två gånger
                    valfritt_namn_1 = medicin_typ ? [2,5,10], [2,5,10], [1,5, 0.5]
            NOTE: Hur listorna fungerar är som beskrivs ovan.


    



