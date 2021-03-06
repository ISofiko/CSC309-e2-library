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
		const bookId = parseInt(bookEntry.firstElementChild.innerText)
		removeBookFromPatronTable(bookEntry)

		// Change the book object to have a patron of 'null'
		libraryBooks[bookId].patron = null
	}


}

// Creates and adds a new patron
function addNewPatron(e) {
	e.preventDefault();

	// Add a new patron to global array
	const newPatronName = document.querySelector('#newPatronName').value
	const patron = new Patron(newPatronName)
	patrons.push(patron)

	// Call addNewPatronEntry() to add patron to the DOM
	addNewPatronEntry(patron)

}

// Gets book info and then displays
function getBookInfo(e) {
	e.preventDefault();

	// Get correct book
	const bookId = parseInt(document.querySelector('#bookInfoId').value)
	const book = libraryBooks[bookId]

	// Call displayBookInfo()
	displayBookInfo(book)

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
	const childNodes = bookInfo.getElementsByTagName('p')

	bookIdValue = childNodes[0]
	bookTitleValue = childNodes[1]
	authorValue = childNodes[2]
	genreValue = childNodes[3]
	loanerValue = childNodes[4]
	
	// bookId
	const newBookId = document.createElement('span')
	newBookId.appendChild(document.createTextNode(book.bookId))
	bookIdValue.replaceChild(newBookId, bookIdValue.childNodes[1])

	const newTitle = document.createElement('span')
	newTitle.appendChild(document.createTextNode(book.title))
	bookTitleValue.replaceChild(newTitle, bookTitleValue.childNodes[1])

	const newAuthor = document.createElement('span')
	newAuthor.appendChild(document.createTextNode(book.author))
	authorValue.replaceChild(newAuthor, authorValue.childNodes[1])

	const newGenre = document.createElement('span')
	newGenre.appendChild(document.createTextNode(book.genre))
	genreValue.replaceChild(newGenre, genreValue.childNodes[1])

	const newLoaner = document.createElement('span')
	if (!book.patron) {
		// if there is no loaner, the loaner value is N/A
		newLoaner.appendChild(document.createTextNode('N/A'))
	} else {
		newLoaner.appendChild(document.createTextNode(book.patron.name))
	}
	loanerValue.replaceChild(newLoaner, loanerValue.childNodes[1])

}

// Adds a book to a patron's book list with a status of 'Within due date'. 
// (don't forget to add a 'return' button).
function addBookToPatronLoans(book) {
	// Add code here

	// where to put the new entry
	const patronsDisplayed = document.querySelectorAll('.patron')
	const position = book.patron.cardNumber
	const table = patronsDisplayed[position].querySelector('tbody')

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
	const newPatronEnty = document.createElement('div')
	newPatronEnty.className = 'patron'

	const nameSpan = document.createElement('span')
	nameSpan.appendChild(document.createTextNode((patron.name)))
	nameSpan.className = 'bold'
	const name = document.createElement('p')
	name.appendChild(document.createTextNode('Name: '))
	name.appendChild(nameSpan)
	newPatronEnty.appendChild(name)

	const cardSpan = document.createElement('span')
	cardSpan.appendChild(document.createTextNode(patron.cardNumber))
	cardSpan.className = 'bold'
	const cardNumber = document.createElement('p')
	cardNumber.appendChild(document.createTextNode('Card Number: '))
	cardNumber.appendChild(cardSpan)
	newPatronEnty.appendChild(cardNumber)

	const loanTitle = document.createElement('h4')
	loanTitle.appendChild(document.createTextNode('Books on loan:'))
	newPatronEnty.appendChild(loanTitle)

	const patronLoansTable = document.createElement('table')
	patronLoansTable.className = 'patronLoansTable'
	const tbody = document.createElement('tbody')
	const tableHeader = document.createElement('tr')

	const bookIdHeader = document.createElement('th')
	bookIdHeader.appendChild(document.createTextNode('BookID'))
	tableHeader.appendChild(bookIdHeader)
	const titleHeader = document.createElement('th')
	titleHeader.appendChild(document.createTextNode('Title'))
	tableHeader.appendChild(titleHeader)
	const cardHeader = document.createElement('th')
	cardHeader.appendChild(document.createTextNode('Status'))
	tableHeader.appendChild(cardHeader)
	const returnHeader = document.createElement('th')
	returnHeader.appendChild(document.createTextNode('Return'))
	tableHeader.appendChild(returnHeader)

	tbody.appendChild(tableHeader)
	patronLoansTable.appendChild(tbody)
	newPatronEnty.appendChild(patronLoansTable)


	patronEntries.appendChild(newPatronEnty)

}


// Removes book from patron's book table and remove patron card number from library book table
function removeBookFromPatronTable(book) {
	// Add code here
	const bookId = parseInt(book.firstElementChild.innerText)
	const cardNumber = parseInt(libraryBooks[bookId].patron.cardNumber)
	const patronsDisplayed = patronEntries.querySelectorAll('.patron')
	const table = patronsDisplayed[cardNumber].getElementsByTagName('tbody')[0]
	// remove card number from book library table
	changeBookLoanCard(bookId, '')
	table.removeChild(book)

}

// Set status to red 'Overdue' in the book's patron's book table.
function changeToOverdue(book) {
	// Add code here
	const cardNumber = book.patron.cardNumber
	const patronsDisplayed = patronEntries.querySelectorAll('.patron')
	const table = patronsDisplayed[cardNumber].getElementsByTagName('tbody')[0]
	const rows = table.querySelectorAll('tr')
	for (var i = 1; i < rows.length; i++) {
		const row = rows[i].querySelectorAll('td')
		if (parseInt(row[0].innerText) == book.bookId) {
			const status = document.createElement('span')
			status.className = 'red'
			status.appendChild(document.createTextNode('Overdue'))
			row[2].replaceChild(status, row[2].firstElementChild)
		}
	}


}

function changeBookLoanCard(bookId, cardNumber) {
	const table = bookTable.getElementsByTagName('tbody')[0]
	const row = table.querySelectorAll('tr')[bookId+1]
	const cell = row.querySelectorAll('td')[2]
	// replace current card number with new card number
	cell.replaceChild(document.createTextNode(cardNumber), cell.childNodes[0])
}

