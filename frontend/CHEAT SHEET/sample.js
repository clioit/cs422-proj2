
const container = document.getElementById("container");
console.log(container);
/*this selects anything with the class container*/
/**const container = document.querySelector("container");
 *                      -works as well but make sure "container"
 *                      - is set as the CLASS and the ID
 */

function addObject(){
    /* this function is called by PRESS ME button */

    //create holder for additional element
    const newDiv = document.createElement("div");
    console.log(newDiv);

    // add a class name & id for styling and future reference
    newDiv.className =`js-test`;
    newDiv.id = `js-test`;

    // add information
    newDiv.innerHTML = `hello`;
    container.appendChild(newDiv);
}

function hideObject(){
    /** toggles visibility of thisDiv */
    
    const thisDiv = document.getElementById("js-test");
    thisDiv.classList.toggle("hide");
}