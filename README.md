# EuropeanHistoryData
This data can be used in applications to study for AP euro please report factual inaccuracies by creating a new issue. 

# Contributing 
Please create a new branch and add what you want, when you are ready make a pull request and it will be reviewed to see if it meets the standards. 
### Startup
after creating a new branch and pulling the main run ```npm i``` to set everything up you can run three commands in the terminal, 
```npm run build``` - This will put together all the info in all the JSON files and output it into one file
```npm run jsonify``` - It will generate JSON files based on what is placed in this file -> <https://github.com/Educational-technologies/EuropeanHistoryData/blob/main/TimeLineData.js> 
```npm run search``` It allows you to search all the .json files to see if something already has been made **IT is still a WIP** so if you are not sure if something hasn't already been created then just manually check. 

### Information 
For creating new events please make a new file in Data called it 
```EVENT_NAME.json```
Then please format it as follows: 
```
{
        "title": "Pico della Mirandola",
        "date": "Late 15th Century",
        "dateValue": 1486,
        "type": "person",
        "tags": [],
        "summary": "Mirandola was an %{Italian Renaissance#The Italian Renaissance} philosopher with a focus on #{Individualism}. His most famous work, Oration on the Dignity of Man, discussed the unlimited potential of humans, their free will allowing them to shape their place in the Universe."
}
```
This displays two important things, if there is another 'article' mentioned in summary please link it, this is done by doing %{The Text you want to display#real title of it}, next another important feature is shown, the #{} this allows you to get the definition of something so you can either so #{case doesn't matter} of a word that is already defined in ```EuropeanHistory\Definitions``` or you can add a new one follow this structure:
``` 
//For words like nationalism, where there are synonyms like national identity do as follows otherwise it's the same, but with only one word. 
{
    "nationalism": "DEF of nationalism",
    "national identity": "same def"
}
// Then name the file NATIONALISM&NATIONAL_IDENTITY.json or if it's a single word WORD.json
```

### Special features 
Currently, there are three special annotations 

#### #{}
    This tells it to define the word, so write it in any case you want But it must be in the EuropeanHistory\Definitions directory, or you can add it 

#### %{}
    This is a way to link ideas and 'articles' together so just do %{Text you want displayed#The title of the article}
    
#### &{}
    This just tells the system to bold the word ex: 
        The &{Renaissance} was cool! | Renaissance would be bolded 

#### tags 
Tags are essential as they signify what the data is of, all of the tags are found here: 
```
important_date: For events found on the important dates sheet,
TBD
```

#### type 
Type is much like tags but it is just one thing so it's the overarching idea,
```
person: if it is a person,
war: if it is a war/battle,
idea: something like the universal man,
tech: technology ex: Seed Drill, 
law: a law, 
treaty: A treaty,
revolution: a revolution or mass protest, 
death: diseases famines genocides, 
building: important landmarks like the Palace of Versailles,
economy: Things that affect the economy like a tariff or something: corn laws  | more specific than law, 
era: something like the scientific revolution, 
art: art type or example, 
unification: a unification movement. 
```



