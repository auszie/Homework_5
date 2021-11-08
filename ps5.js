const wordInput = document.querySelector('#word_input');
const showRhymesButton = document.querySelector('#show_rhymes');
const showSynonmymsButton = document.querySelector('#show_synonyms');
const rhymesOutput = document.querySelector('#word_output');
const word_description = document.querySelector('#output_description');
const nowSaved = document.querySelector('#saved_words')

var savedWords = [];

 /**
 * Returns a list of objects grouped by some property. For example:
 * groupBy([{name: 'Steve', team:'blue'}, {name: 'Jack', team: 'red'}, {name: 'Carol', team: 'blue'}], 'team')
 * 
 * returns:
 * { 'blue': [{name: 'Steve', team: 'blue'}, {name: 'Carol', team: 'blue'}],
 *    'red': [{name: 'Jack', team: 'red'}]
 * }
 * 
 * @param {any[]} objects: An array of objects
 * @param {string|Function} property: A property to group objects by
 * @returns  An object where the keys representing group names and the values are the items in objects that are in that group
 */

  function groupBy(objects, property) {
    // If property is not a function, convert it to a function that accepts one argument (an object) and returns that object's
    // value for property (obj[property])
    if(typeof property !== 'function') {
        const propName = property;
        property = (obj) => obj[propName];
    }

    const groupedObjects = new Map(); // Keys: group names, value: list of items in that group
    for(const object of objects) {
        const groupName = property(object);
        //Make sure that the group exists
        if(!groupedObjects.has(groupName)) {
            groupedObjects.set(groupName, []);
        }
        groupedObjects.get(groupName).push(object);
    }

    // Create an object with the results. Sort the keys so that they are in a sensible "order"
    const result = {};
    for(const key of Array.from(groupedObjects.keys()).sort()) {
        result[key] = groupedObjects.get(key);
    }
    return result;
}
 function getRhymes(rel_rhy, callback) {
    fetch(`https://api.datamuse.com/words?${(new URLSearchParams({rel_rhy})).toString()}`)
        .then((response) => response.json())
        .then((data) => {
            callback(data);
            //rhymesOutput.innerHTML = '...loading';
            if (data == 0){
                word_description.innerHTML = "";
                word_description.innerHTML = "No Results"
            }
        }, (err) => {
            console.error(err);
        });
}

function getSynonyms(rel_syn, callback) {
    fetch(`https://api.datamuse.com/words?${(new URLSearchParams({rel_syn})).toString()}`)
        .then((response) => response.json())
        .then((data) => {
            callback(data);
            if (data == 0){
                word_description.innerHTML = "";
                word_description.innerHTML = "No Results"
            }
            //rhymesOutput.innerHTML = '...loading';
        }, (err) => {
            console.error(err);
        });
}





// Write your code here
showRhymesButton.addEventListener('click', () =>{
    rhy_word = wordInput.value;
    var ul = document.createElement("ul");
    // word_description.innerHTML = "";
    // word_description.innerHTML = "Words that rhyme with " + rhy_word;

    var completeDict = [];

   

    getRhymes(rhy_word, (result) =>{
        //console.log(result);

        rhy_word = wordInput.value;
        var ul = document.createElement("ul");
        

        
        
        var groupResults = groupBy(result, "numSyllables");
        console.log(groupResults);

        word_description.innerHTML =" Words that rhyme with " + rhy_word;

        if (groupResults == null){
            word_description.innerHTML = "";
            word_description.innerHTML = "No Results"
;       }
        else{
            word_description.innerHTML =" Words that rhyme with " + rhy_word;
        }
        
        
        //console.log(groupResults[1]);
        var check = 0;
        rhymesOutput.innerHTML = '';
        for (const key1 in groupResults){
            //console.log(groupResults[key1]);
            
            if (check == 0){
                //console.log("one")
                let newHeader = document.createElement('h3');
                newHeader.textContent = (groupResults[key1][key1]['numSyllables'] ) + " syllable";
                rhymesOutput.append(newHeader);
                check = 1;
            }
            else{
                
                let newHeader = document.createElement('h3');
                newHeader.textContent = (key1) + " syllables:";
                rhymesOutput.append(newHeader);
                //console.log(key1);
            }
            for (const key2 in groupResults[key1]){

                const wordict = groupResults[key1][key2];
                const newWord = wordict['word'];

                const newlist = document.createElement('li');
                //ul.appendChild(newlist);
                newlist.classList.add('li');
                newlist.textContent = newWord;
                rhymesOutput.append(newlist);


                var saveButton = document.createElement('button');
                saveButton.classList.add("btn");
                saveButton.classList.add("btn-sm");
                saveButton.classList.add('done');
                saveButton.setAttribute("type", "button");
                saveButton.textContent = '(Save)';
                newlist.append(saveButton);

                saveButton.addEventListener("click", function(){
                    savedWords.push(newWord);
                nowSaved.innerHTML = savedWords.join(', ')
             });
            }
        }
        
        
    });
    
    //console.log(completeDict);


});

document.getElementById('word_input').addEventListener("keypress", function(e){
    if (e.key == 'Enter') {
        console.log('working');
        }
    });



showSynonmymsButton.addEventListener('click', () =>{
    syn_word = wordInput.value;
    
    var ul = document.createElement("ul");


    

    getSynonyms(syn_word, (result) =>{
        //console.log(result);
        rhymesOutput.innerHTML = "...loading";
        rhymesOutput.innerHTML = '';

        if (result.length === undefined){
            word_description.innerHTML = "";
            word_description.innerHTML = "No Results"
;       }
        else{
            word_description.innerHTML = "";
            word_description.innerHTML = "Words with a meaning similar to " + syn_word;
        }
        
        for( const key in result){
            const wordict = result[key];
            const newWord = wordict['word'];
            const numSyllables = wordict['numSyllables']
            //console.log(numSyllables)
            

            const newlist = document.createElement('li');
            ul.appendChild(newlist);
            newlist.classList.add('ul');
            newlist.textContent = newWord;
            rhymesOutput.append(newlist);


            var saveButton = document.createElement('button');
            saveButton.classList.add("btn");
            saveButton.classList.add("btn-sm");
            saveButton.classList.add('done');
            saveButton.setAttribute("type", "button");
            saveButton.textContent = '(Save)';
            newlist.append(saveButton);

            saveButton.addEventListener("click", function(){
                savedWords.push(newWord);
                nowSaved.innerHTML = savedWords.join(', ')
            });

        }
        
    });
    

});

/**
 * Returns a list of objects grouped by some property. For example:
 * groupBy([{name: 'Steve', team:'blue'}, {name: 'Jack', team: 'red'}, {name: 'Carol', team: 'blue'}], 'team')
 * 
 * returns:
 * { 'blue': [{name: 'Steve', team: 'blue'}, {name: 'Carol', team: 'blue'}],
 *    'red': [{name: 'Jack', team: 'red'}]
 * }
 * 
 * @param {any[]} objects: An array of objects
 * @param {string|Function} property: A property to group objects by
 * @returns  An object where the keys representing group names and the values are the items in objects that are in that group
 */

 function groupBy(objects, property) {
    // If property is not a function, convert it to a function that accepts one argument (an object) and returns that object's
    // value for property (obj[property])
    if(typeof property !== 'function') {
        const propName = property;
        property = (obj) => obj[propName];
    }

    const groupedObjects = new Map(); // Keys: group names, value: list of items in that group
    for(const object of objects) {
        const groupName = property(object);
        //Make sure that the group exists
        if(!groupedObjects.has(groupName)) {
            groupedObjects.set(groupName, []);
        }
        groupedObjects.get(groupName).push(object);
    }

    // Create an object with the results. Sort the keys so that they are in a sensible "order"
    const result = {};
    for(const key of Array.from(groupedObjects.keys()).sort()) {
        result[key] = groupedObjects.get(key);
    }
    return result;
}


