/* E2 Library - JS */

/*-----------------------------------------------------------*/
/* Starter code - DO NOT edit the code below. */
/*-----------------------------------------------------------*/

// global counts
let numberOfBooks = 0; // total number of books
let numberOfPatrons = 0; // total number of patrons

// global arrays
const libraryBooks = [] // Array of books owned by the library (whether they are loaned or not)
const patrons = [] // Array of library patrons.

// Book 'class'
class Book {
	constructor(title, author, genre) {
		this.title = title;
		this.author = author;
		this.genre = genre;
		this.patron = null; // will be the patron object

		// set book ID
		this.bookId = numberOfBooks;
		numberOfBooks++;
	}

	setLoanTime() {
		// Create a setTimeout that waits 3 seconds before indicating a book is overdue

		const self = this; // keep book in scope of anon function (why? the call-site for 'this' in the anon function is the DOM window)
		setTimeout(function() {
			
			console.log('overdue book!', self.title)
			changeToOverdue(self);

		}, 3000)

	}
}

// Patron constructor
const Patron = function(name) {
	this.name = name;
	this.cardNumber = numberOfPatrons;

	numberOfPatrons++;
}


// Adding these books does not change the DOM - we are simply setting up the 
// book and patron arrays as they appear initially in the DOM.
libraryBooks.push(new Book('Harry Potter', 'J.K. Rowling', 'Fantasy'));
libraryBooks.push(new Book('1984', 'G. Orwell', 'Dystopian Fiction'));
libraryBooks.push(new Book('A Brief History of Time', 'S. Hawking', 'Cosmology'));

patrons.push(new Patron('Jim John'))
patrons.push(new Patron('Kelly Jones'))

// Patron 0 loans book 0
libraryBooks[0].patron = patrons[0]
// Set the overdue timeout
libraryBooks[0].setLoanTime()  // check console to see a log after 3 seconds


/* Select all DOM form elements you'll need. */ 
const bookAddForm = document.querySelector('#bookAddForm');
const bookInfoForm = document.querySelector('#bookInfoForm');
const bookLoanForm = document.querySelector('#bookLoanForm');
const patronAddForm = document.querySelector('#patronAddForm');

/* bookTable element */
const bookTable = document.querySelector('#bookTable')
/* bookInfo element */
const bookInfo = document.querySelector('#bookInfo')
/* Full patrons entries element */
const patronEntries = document.querySelector('#patrons')

/* Event listeners for button submit and button click */

bookAddForm.addEventListener('submit', addNewBookToBookList);
bookLoanForm.addEventListener('submit', loanBookToPatron);
patronAddForm.addEventListener('submit', addNewPatron)
bookInfoForm.addEventListener('submit', getBookInfo);

/* Listen for click patron entries - will have to check if it is a return button in returnBookToLibrary */
patronEntries.addEventListener('click', returnBookToLibrary)

/*-----------------------------------------------------------*/
/* End of starter code - do *not* edit the code above. */
/*-----------------------------------------------------------*/


/** ADD your code to the functions below. DO NOT change the function signatures. **/


/*** Functions that don't edit DOM themselves, but can call DOM functions 
     Use the book and patron arrays appropriately in these functions.
 ***/

// Adds a new book to the global book list and calls addBookToLibraryTable()
function addNewBookToBookList(e) {
	e.preventDefault();

	const bookName = document.querySelector('#newBookName').value
	const bookAuthor = document.querySelector('#newBookAuthor').value
	const bookGenre = document.querySelector('#newBookGenre').value
	// Add book book to global array
	const newBook = new Book(bookName, bookAuthor, bookGenre)
	libraryBooks.push(newBook)

	// Call addBookToLibraryTable properly to add book to the DOM
	addBookToLibraryTable(newBook)
	
}

// Changes book patron information, and calls addBookToPatronLoans
function loanBookToPatron(e) {
	e.preventDefault();

	// Get correct book and patron
	const bookId = parseInt(document.querySelector('#loanBookId').value)
	const cardNumber = parseInt(document.querySelector('#loanCardNum').value)
	const patron = patrons[cardNumber]

	// Add patron to the book's patron property
	const book = libraryBooks[bookId]
	book.patron = patron

	// Add book to the patron's book table in the DOM by calling addBookToPatronLoans()
	addBookToPatronLoans(book)

	// add card number to book library table
	changeBookLoanCard(bookId, cardNumber)

	// Start the book loan timer.
	book.setLoanTime()
	

}

// Changes book patron information and calls returnBookToLibraryTable()
function returnBookToLibrary(e){
	e.preventDefault();
	// check if return button was clicked, otherwise do nothing.
	if (e.target.classList.contains('return')){
		// Call removeBookFromPatronTable()
		const bookEntry = e.target.parentElement.parentElement
		removeBookFromPatronTable(bookEntry)

		// Change the book object to have a patron of 'null'
		const bookId = bookEntry.firstElementChild
	}


}

// Creates and adds a new patron
function addNewPatron(e) {
	e.preventDefault();

	// Add a new patron to global array


	// Call addNewPatronEntry() to add patron to the DOM

}

// Gets book info and then displays
function getBookInfo(e) {
	e.preventDefault();

	// Get correct book

	// Call displayBookInfo()	

}


/*-----------------------------------------------------------*/
/*** DOM functions below - use these to create and edit DOM objects ***/

// Adds a book to the library table.
function addBookToLibraryTable(book) {
	// Add code here
	const idCell = document.createElement('td')
	const titleCell = document.createElement('td')
	const cardNumberCell = document.createElement('td')
	// book id
	idCell.appendChild(document.createTextNode(book.bookId))
	// book title
	const strong = document.createElement('strong')
	strong.appendChild(document.createTextNode(book.title))
	titleCell.appendChild(strong)

	// where to add the entry
	const table = bookTable.getElementsByTagName('tbody')[0]
	const newRow = table.insertRow()
	
	newRow.appendChild(idCell)
	newRow.appendChild(titleCell)
	
	// possibly adding a patron, if exists
	if (book.patron != null) {
		cardNumberCell.appendChild(document.createTextNode(book.patron.cardNumber))
	} else {
		cardNumberCell.appendChild(document.createTextNode(''))
	}
	newRow.appendChild(cardNumberCell)

}


// Displays deatiled info on the book in the Book Info Section
function displayBookInfo(book) {
	// Add code here

}

// Adds a book to a patron's book list with a status of 'Within due date'. 
// (don't forget to add a 'return' button).
function addBookToPatronLoans(book) {
	// Add code here

	// where to put the new entry
	const patrons = document.querySelectorAll('.patron')
	const position = book.patron.cardNumber
	const table = patrons[position].querySelector('tbody')

	// create book entry
	const bookEntry = document.createElement('tr')
	const idCell = document.createElement('td')
	idCell.appendChild(document.createTextNode(book.bookId))
	const titleCell = document.createElement('td')
	const strong = document.createElement('strong')
	strong.appendChild(document.createTextNode(book.title))
	titleCell.appendChild(strong)
	const statusCell = document.createElement('td')
	const status = document.createElement('span')
	status.className = 'green'
	status.appendChild(document.createTextNode('Within due date'))
	statusCell.appendChild(status)
	const returnCell = document.createElement('td')
	const button = document.createElement('button')
	button.className = 'return'
	button.appendChild(document.createTextNode('return'))
	returnCell.appendChild(button)
	
	bookEntry.appendChild(idCell)
	bookEntry.appendChild(titleCell)
	bookEntry.appendChild(statusCell)
	bookEntry.appendChild(returnCell)

	// add the entry
	table.appendChild(bookEntry)
}

// Adds a new patron with no books in their table to the DOM, including name, card number,
// and blank book list (with only the <th> headers: BookID, Title, Status).
function addNewPatronEntry(patron) {
	// Add code here

}


// Removes book from patron's book table and remove patron card number from library book table
function removeBookFromPatronTable(book) {
	// Add code here
	const bookId = parseInt(book.firstElementChild.innerText)
	const cardNumber = parseInt(libraryBooks[bookId].patron.cardNumber)
	const patrons = patronEntries.querySelectorAll('.patron')
	const table = patrons[cardNumber].getElementsByTagName('tbody')[0]
	// remove card number from book library table
	changeBookLoanCard(bookId, '')
	table.removeChild(book)

}

// Set status to red 'Overdue' in the book's patron's book table.
function changeToOverdue(book) {
	// Add code here

}

function changeBookLoanCard(bookId, cardNumber) {
	const table = bookTable.getElementsByTagName('tbody')[0]
	const row = table.querySelectorAll('tr')[bookId+1]
	const cell = row.querySelectorAll('td')[2]
	// replace current card number with new card number
	cell.replaceChild(document.createTextNode(cardNumber), cell.childNodes[0])
}

