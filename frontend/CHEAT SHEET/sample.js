
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

function postChapter() {
  console.log("entered postChapter");
  // postchapter adds a new chapter from user into the database
  // get chapter input
  const chapter = document.getElementById('new-chapter').value;
  const chapterMsg = document.getElementById('chapter-message');
  const chapterPage = document.getElementById('chapter-page').value;
  const chapPageMsg = document.getElementById('chap-page-message');
  // check if a section was entered
  if (!chapter) {
    chapterMsg.textContent = 'Please enter a chapter name!';
    return;
  }
  if (!chapterPage) {
    chapPageMsg.textContent = 'On what page does the chapter start?';
    return;
  }
  // POST request to endpoint
  fetch(`/pdfs/${pdf_id}/chapters`, {
    method: 'POST',
    body: JSON.stringify({
      title: chapter,
      start_page: chapterPage
   })
  })
  // check response is json
  .then(async response => {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return { status: response.status, body: data };
    } else {
      const text = await response.text();
      throw new Error(`Unexpected response: ${text}`);
    }
  })
  // handle result
  .then(result => {
    if (result.status === 201) {
      chapPageMsg.textContent = result.body.message;
      window.location.reload();
    } else {
      chapPageMsg.textContent = result.body.message || 'Add section failed.';
    }
  })
  .catch(error => {
    chapPageMsg.textContent = 'An error occurred: ' + error.message;
  });
}


// posting new data to BE
function postSection() {
  console.log("entered postSection");
  // postSection adds a new section tag from user into the database
  // get section tag input
  const section = document.getElementById('new-section').value;
  const sectionMsg = document.getElementById('section-message');
  const sectionPage = document.getElementById('section-page').value;
  const pageMsg = document.getElementById('page-message');
  // check if a section was entered
  if (!section) {
    sectionMsg.textContent = 'Please give your tag a name. Labels are a great way to organize your notes and can help you review later!';
    return;
  }
  if (!sectionPage) {
    pageMsg.textContent = 'Please enter a page number for the start of the section.';
    return;
  }
  if (!sectionPage) {
    pageMsg.textContent = 'Please select a chapter.';
    return;
  }

  // POST request to endpoint
  fetch(`/pdfs/${pdf_id}/chapters/${chap_id}/sections`, {
    method: 'POST',
    body: JSON.stringify({
      title: section,
      start_page: sectionPage
   })
  })
  // check response is json
  .then(async response => {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return { status: response.status, body: data };
    } else {
      const text = await response.text();
      throw new Error(`Unexpected response: ${text}`);
    }
  })
  // handle result
  .then(result => {
    if (result.status === 201) {
      pageMsg.textContent = result.body.message;
      sectionMsg.textContent = "";
      setChap();
      // setTimeout(() => window.location.reload(), 1500);
    } else {
      pageMsg.textContent = result.body.message || 'Add section failed.';
    }
  })
  .catch(error => {
    pageMsg.textContent = 'An error occurred: ' + error.message;
  });
}