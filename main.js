/**
 * [
 *    {
 *      id: <int>
 *      title: <string>
 *      author: <string>
 *      year: <int>
 *      isCompleted: <boolean>
 *    }
 * ]
 */
let books = [];
const STORAGE_KEY = "BOOK_DATA";
const RENDER_EVENT = "render-book";

/**
 * Fungsi ini digunakan untuk memeriksa localStorage
 * @returns boolean
 */
function checkStorage() {
  return typeof Storage !== "undefined";
}

/**
 * elemet submit / search
 */
const bookForm = document.getElementById("bookForm");
const searchBook = document.getElementById("searchBook");

/**
 * Fungsi ini digunakan untuk menambahkan buku dari submit "bookForm"
 *
 * @returns books and localStorage("BOOK_DATA")
 */
function addBook() {
  const generateId = () => +new Date();
  const bookFormTitle = document.getElementById("bookFormTitle").value;
  const bookFormAuthor = document.getElementById("bookFormAuthor").value;
  const bookFormYear = Number(document.getElementById("bookFormYear").value);
  const bookFormIsComplete =
    document.getElementById("bookFormIsComplete").checked;

  const dataBook = {
    id: generateId(),
    title: bookFormTitle,
    author: bookFormAuthor,
    year: bookFormYear,
    isComplete: bookFormIsComplete,
  };

  books.push(dataBook);
  saveBookStorage();
  document.dispatchEvent(new Event(RENDER_EVENT));
}

/**
 * Fungsi ini digunakan untuk pencarian buku
 * @returns books.title
 */
function searchBookData(title) {
  for (const bookItem of books) {
    // Template Search Book
    const bookElementSearch = document.getElementById("bookElementSearch");

    const bookTitle = document.createElement("h3");
    bookTitle.setAttribute("data-testid", "bookItemTitle");
    bookTitle.innerText = bookItem.title;

    const bookAuthor = document.createElement("p");
    bookAuthor.setAttribute("data-testid", "bookItemAuthor");
    bookAuthor.innerText = bookItem.author;

    const bookYear = document.createElement("p");
    bookYear.setAttribute("data-testid", "bookItemYear");
    bookYear.innerText = bookItem.year;

    let keterangan = bookItem.isComplete ? "Selesai dibaca" : "Belum dibaca";

    const bookIsComplete = document.createElement("p");
    bookIsComplete.setAttribute("data-testid", "bookItemIsComplete");
    bookIsComplete.innerText = keterangan;

    const divBookID = document.createElement("div");
    divBookID.append(bookTitle, bookAuthor, bookYear, bookIsComplete);
    divBookID.setAttribute("data-bookid", `${bookItem.id}`);

    if (bookItem.title.toLowerCase().includes(title.toLowerCase())) {
      bookElementSearch.append(divBookID);
    }
  }
}

/**
 * Fungsi ini digunakan untuk save data books[] ke localStorage("BOOK_DATA")
 *
 * @returns books => localStorage
 */
function saveBookStorage() {
  if (checkStorage()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }
}

/**
 * Fungsi ini digunakan untuk get data localStorage("BOOK_DATA") dan push ke books[]
 *
 * @returns localStorage => books
 */
function loadBookFromStorage() {
  const bookFromStorage = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(bookFromStorage);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

/**
 * Fungsi ini digunakan untuk pencarian objek buku
 *
 * @returns books
 */
function findBook(todoId) {
  for (const bookItem of books) {
    if (bookItem.id === todoId) {
      return bookItem;
    }
  }
  return null;
}

/**
 * Fungsi ini digunakan untuk pencarian index buku
 *
 * @returns books[]
 */
function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

/**
 * Fungsi ini digunakan untuk hapus buku
 */
function removeBook(bookId) {
  let bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveBookStorage();
}

/**
 * Fungsi ini digunakan untuk mengulang baca buku
 */
function recycleBook(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;

  saveBookStorage();
  document.dispatchEvent(new Event(RENDER_EVENT));
}

/**
 * Fungsi ini digunakan untuk menyelesaikan baca buku
 */
function doneBook(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  saveBookStorage();
  document.dispatchEvent(new Event(RENDER_EVENT));
}

/**
 * Fungsi ini digunakan untuk edit buku
 * {
 *    title
 *    author
 *    year
 * }
 */
function editBook(bookId) {
  const bookTarget = findBook(bookId);

  const editBook = document.getElementById("editBook");
  editBook.hidden = false;

  document.getElementById("editbookFormTitle").value = bookTarget.title;
  document.getElementById("editbookFormAuthor").value = bookTarget.author;
  document.getElementById("editbookFormYear").value = bookTarget.year;

  const editbookForm = document.getElementById("editbookForm");
  editbookForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const updatedTitle = document.getElementById("editbookFormTitle").value;
    const updatedAuthor = document.getElementById("editbookFormAuthor").value;
    const updatedYear = document.getElementById("editbookFormYear").value;

    // Perbarui data buku
    bookTarget.title = updatedTitle;
    bookTarget.author = updatedAuthor;
    bookTarget.year = Number(updatedYear);

    saveBookStorage();
    document.dispatchEvent(new Event(RENDER_EVENT));

    editBook.hidden = true;
  });
}

/**
 * Fungsi ini digunakan untuk membuat cetakan elemen buku
 */
function templateBookElement(bookItem) {
  const { id, title, author, year, isComplete } = bookItem;

  const bookTitle = document.createElement("h3");
  bookTitle.setAttribute("data-testid", "bookItemTitle");
  bookTitle.innerText = title;

  const bookAuthor = document.createElement("p");
  bookAuthor.setAttribute("data-testid", "bookItemAuthor");
  bookAuthor.innerText = author;

  const bookYear = document.createElement("p");
  bookYear.setAttribute("data-testid", "bookItemYear");
  bookYear.innerText = year;

  const divBookID = document.createElement("div");
  divBookID.setAttribute("id", `limit`);
  divBookID.setAttribute("data-testid", `bookItem`);
  divBookID.setAttribute("data-bookid", `${id}`);

  //Img Button
  imgDone = document.createElement("img");
  imgDone.setAttribute("src", "asset/bx-check.png");

  imgRemove = document.createElement("img");
  imgRemove.setAttribute("src", "asset/bx-trash.png");

  imgRecycle = document.createElement("img");
  imgRecycle.setAttribute("src", "asset/bx-revision.png");

  imgEdit = document.createElement("img");
  imgEdit.setAttribute("src", "asset/bx-edit-alt.png");

  //Button render books
  const buttonDone = document.createElement("button");
  buttonDone.setAttribute("data-testid", "bookItemIsCompleteButton");
  buttonDone.append(imgDone);

  const buttonRecyle = document.createElement("button");
  buttonRecyle.setAttribute("data-testid", "bookItemIsNotCompleteButton");
  buttonRecyle.append(imgRecycle);

  const buttonRemove = document.createElement("button");
  buttonRemove.setAttribute("data-testid", "bookItemDeleteButton");
  buttonRemove.append(imgRemove);

  const buttonEdit = document.createElement("button");
  buttonEdit.setAttribute("data-testid", "bookItemEditButton");
  buttonEdit.append(imgEdit);

  if (isComplete === true) {
    buttonRecyle.addEventListener("click", function () {
      recycleBook(id);
    });
    buttonRemove.addEventListener("click", function () {
      removeBook(id);
    });
    buttonEdit.addEventListener("click", function () {
      editBook(id);
    });
    divBookID.append(
      bookTitle,
      bookAuthor,
      bookYear,
      buttonRecyle,
      buttonRemove,
      buttonEdit
    );
  } else {
    buttonDone.addEventListener("click", function () {
      doneBook(id);
    });
    buttonRemove.addEventListener("click", function () {
      removeBook(id);
    });
    buttonEdit.addEventListener("click", function () {
      editBook(id);
    });
    divBookID.append(
      bookTitle,
      bookAuthor,
      bookYear,
      buttonDone,
      buttonRemove,
      buttonEdit
    );
  }
  return divBookID;
}

/**
 * Event Search
 */
searchBook.addEventListener("submit", function (event) {
  event.preventDefault();
  const title = document.getElementById("searchBookTitle").value;
  searchBookData(title);
});

/**
 * Custom Event "RENDER_EVENT"
 */
document.addEventListener(RENDER_EVENT, function () {
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = templateBookElement(bookItem);
    if (bookItem.isComplete === true) {
      completeBookList.append(bookElement);
    } else {
      incompleteBookList.append(bookElement);
    }
  }
});

/**
 * Event content load and parse browser
 */
document.addEventListener("DOMContentLoaded", function () {
  /**
   * Event submit data
   */
  bookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
    document.dispatchEvent(new Event(RENDER_EVENT));
  });

  if (checkStorage()) {
    loadBookFromStorage();
  }
});
