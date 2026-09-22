import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8080/api/library";

function App() {
  // ---------------- LOGIN STATES ----------------
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("libraryLoggedIn") === "true"
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ---------------- DATA STATES ----------------
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);

  // ---------------- FORM STATES ----------------
  const [isbn, setIsbn] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [totalCopies, setTotalCopies] = useState("");

  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");

  const [issueIsbn, setIssueIsbn] = useState("");
  const [issueMemberId, setIssueMemberId] = useState("");

  const [returnIsbn, setReturnIsbn] = useState("");
  const [returnMemberId, setReturnMemberId] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // ---------------- FETCH BOOKS ----------------
  useEffect(() => {
    if (isLoggedIn) {
      fetchBooks();
      fetchMembers();
    }
  }, [isLoggedIn]);

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${API_URL}/books`);

      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }

      const data = await response.json();
      setBooks(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load books. Is Spring Boot running?");
    }
  };

  // ---------------- FETCH MEMBERS ----------------
  const fetchMembers = async () => {
    try {
      const response = await fetch(`${API_URL}/members`);

      if (!response.ok) {
        throw new Error("Failed to fetch members");
      }

      const data = await response.json();
      setMembers(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load members");
    }
  };

  // ---------------- LOGIN ----------------
  const handleLogin = (e) => {
    e.preventDefault();

    if (email === "admin@gmail.com" && password === "admin123") {
      localStorage.setItem("libraryLoggedIn", "true");
      setIsLoggedIn(true);
      setError("");
    } else {
      setError("Invalid email or password");
    }
  };

  // ---------------- LOGOUT ----------------
  const handleLogout = () => {
    localStorage.removeItem("libraryLoggedIn");
    setIsLoggedIn(false);
    setBooks([]);
    setMembers([]);
  };

  // ---------------- ADD BOOK ----------------
  const handleAddBook = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isbn: isbn.trim(),
          title: title.trim(),
          author: author.trim(),
          totalCopies: Number(totalCopies),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(errorText);
        throw new Error("Failed to add book");
      }

      setMessage("Book added successfully");

      setIsbn("");
      setTitle("");
      setAuthor("");
      setTotalCopies("");

      fetchBooks();
    } catch (err) {
      console.error(err);
      setError("Failed to add book");
    }
  };

  // ---------------- REGISTER MEMBER ----------------
  const handleAddMember = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: memberName.trim(),
          email: memberEmail.trim(),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(errorText);
        throw new Error("Failed to register member");
      }

      setMessage("Member registered successfully");

      setMemberName("");
      setMemberEmail("");

      fetchMembers();
    } catch (err) {
      console.error(err);
      setError("Failed to register member");
    }
  };

  // ---------------- ISSUE BOOK ----------------
  const handleIssueBook = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/books/${issueIsbn}/issue?memberId=${issueMemberId}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(errorText);
        throw new Error("Failed to issue book");
      }

      setMessage("Book issued successfully");

      setIssueIsbn("");
      setIssueMemberId("");

      fetchBooks();
    } catch (err) {
      console.error(err);
      setError("Failed to issue book. Check availability and member ID.");
    }
  };

  // ---------------- RETURN BOOK ----------------
  const handleReturnBook = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/books/${returnIsbn}/return?memberId=${returnMemberId}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(errorText);
        throw new Error("Failed to return book");
      }

      setMessage("Book returned successfully");

      setReturnIsbn("");
      setReturnMemberId("");

      fetchBooks();
    } catch (err) {
      console.error(err);
      setError("Failed to return book. Check ISBN and member ID.");
    }
  };

  // ---------------- SEARCH BOOKS ----------------
  const filteredBooks = books.filter((book) => {
    const search = searchTerm.toLowerCase();

    return (
      book.title?.toLowerCase().includes(search) ||
      book.author?.toLowerCase().includes(search) ||
      book.isbn?.toLowerCase().includes(search)
    );
  });

  // ---------------- DASHBOARD VALUES ----------------
  const totalBooks = books.reduce(
    (sum, book) => sum + Number(book.totalCopies || 0),
    0
  );

  const availableBooks = books.reduce(
    (sum, book) => sum + Number(book.availableCopies || 0),
    0
  );

  const issuedBooks = totalBooks - availableBooks;

  // ---------------- LOGIN PAGE ----------------
  if (!isLoggedIn) {
    return (
      <div className="login-page">
        <form className="login-card" onSubmit={handleLogin}>
          <h1>Library Management</h1>
          <p>Admin Login</p>

          <input
            type="email"
            placeholder="Enter admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>

          {error && <p className="error">{error}</p>}

          <small>Demo email: admin@gmail.com</small>
          <small>Demo password: admin123</small>
        </form>
      </div>
    );
  }

  // ---------------- MAIN DASHBOARD ----------------
  return (
    <div className="app">
      <header className="navbar">
        <div>
          <h1>Library Management System</h1>
          <p>Manage books, members and issue records</p>
        </div>

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="container">
        {message && <div className="success">{message}</div>}
        {error && <div className="error">{error}</div>}

        {/* DASHBOARD CARDS */}
        <section className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Total Books</h3>
            <strong>{totalBooks}</strong>
          </div>

          <div className="dashboard-card">
            <h3>Available Books</h3>
            <strong>{availableBooks}</strong>
          </div>

          <div className="dashboard-card">
            <h3>Issued Books</h3>
            <strong>{issuedBooks}</strong>
          </div>

          <div className="dashboard-card">
            <h3>Total Members</h3>
            <strong>{members.length}</strong>
          </div>
        </section>

        {/* ADD BOOK */}
        <section className="card">
          <h2>Add New Book</h2>

          <form className="form-grid" onSubmit={handleAddBook}>
            <input
              type="text"
              placeholder="ISBN"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Book Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Total Copies"
              min="1"
              value={totalCopies}
              onChange={(e) => setTotalCopies(e.target.value)}
              required
            />

            <button type="submit">Add Book</button>
          </form>
        </section>

        {/* REGISTER MEMBER */}
        <section className="card">
          <h2>Register New Member</h2>

          <form className="form-grid" onSubmit={handleAddMember}>
            <input
              type="text"
              placeholder="Member Name"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Member Email"
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.target.value)}
              required
            />

            <button type="submit">Register Member</button>
          </form>
        </section>

        {/* ISSUE BOOK */}
        <section className="card">
          <h2>Issue Book</h2>

          <form className="form-grid" onSubmit={handleIssueBook}>
            <select
              value={issueIsbn}
              onChange={(e) => setIssueIsbn(e.target.value)}
              required
            >
              <option value="">Select Book</option>

              {books
                .filter((book) => book.availableCopies > 0)
                .map((book) => (
                  <option key={book.isbn} value={book.isbn}>
                    {book.title} - {book.isbn}
                  </option>
                ))}
            </select>

            <select
              value={issueMemberId}
              onChange={(e) => setIssueMemberId(e.target.value)}
              required
            >
              <option value="">Select Member</option>

              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} - ID {member.id}
                </option>
              ))}
            </select>

            <button type="submit">Issue Book</button>
          </form>
        </section>

        {/* RETURN BOOK */}
        <section className="card">
          <h2>Return Book</h2>

          <form className="form-grid" onSubmit={handleReturnBook}>
            <select
              value={returnIsbn}
              onChange={(e) => setReturnIsbn(e.target.value)}
              required
            >
              <option value="">Select Book</option>

              {books.map((book) => (
                <option key={book.isbn} value={book.isbn}>
                  {book.title} - {book.isbn}
                </option>
              ))}
            </select>

            <select
              value={returnMemberId}
              onChange={(e) => setReturnMemberId(e.target.value)}
              required
            >
              <option value="">Select Member</option>

              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} - ID {member.id}
                </option>
              ))}
            </select>

            <button type="submit">Return Book</button>
          </form>
        </section>

        {/* BOOK LIST */}
        <section className="card">
          <div className="section-header">
            <h2>Book List</h2>

            <input
              className="search-input"
              type="text"
              placeholder="Search by title, author or ISBN"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ISBN</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Total Copies</th>
                  <th>Available Copies</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredBooks.length > 0 ? (
                  filteredBooks.map((book) => (
                    <tr key={book.isbn}>
                      <td>{book.isbn}</td>
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.totalCopies}</td>
                      <td>{book.availableCopies}</td>
                      <td>
                        {book.availableCopies > 0 ? (
                          <span className="available">Available</span>
                        ) : (
                          <span className="unavailable">Issued</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No books found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* MEMBER LIST */}
        <section className="card">
          <h2>Registered Members</h2>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Member ID</th>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>

              <tbody>
                {members.length > 0 ? (
                  members.map((member) => (
                    <tr key={member.id}>
                      <td>{member.id}</td>
                      <td>{member.name}</td>
                      <td>{member.email}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No members registered</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;