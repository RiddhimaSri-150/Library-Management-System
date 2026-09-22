package com.LibraryManagementSystem.library.controller;

import com.LibraryManagementSystem.library.model.Book;
import com.LibraryManagementSystem.library.model.IssueRecord;
import com.LibraryManagementSystem.library.model.Member;
import com.LibraryManagementSystem.library.service.LibraryService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174"
})
@RequestMapping("/api/library")
public class LibraryController {

    @Autowired
    private LibraryService libraryService;

    // Add book
    @PostMapping("/books")
    public ResponseEntity<Book> addBook(
            @RequestBody Book book
    ) {
        return ResponseEntity.ok(
                libraryService.addBook(book)
        );
    }

    // List books
    @GetMapping("/books")
    public ResponseEntity<Iterable<Book>> listBooks() {
        return ResponseEntity.ok(
                libraryService.listBooks()
        );
    }

    // Register member
    @PostMapping("/members")
    public ResponseEntity<Member> registerMember(
            @RequestBody Member member
    ) {
        return ResponseEntity.ok(
                libraryService.registerMember(member)
        );
    }

    // List members
    @GetMapping("/members")
    public ResponseEntity<List<Member>> getAllMembers() {
        return ResponseEntity.ok(
                libraryService.getAllMembers()
        );
    }

    // Issue book
    @PostMapping("/books/{isbn}/issue")
    public ResponseEntity<IssueRecord> issueBook(
            @PathVariable String isbn,
            @RequestParam Long memberId
    ) {
        return ResponseEntity.ok(
                libraryService.issueBook(isbn, memberId)
        );
    }

    // Return book
    @PostMapping("/books/{isbn}/return")
    public ResponseEntity<Void> returnBook(
            @PathVariable String isbn,
            @RequestParam Long memberId
    ) {
        libraryService.returnBook(isbn, memberId);

        return ResponseEntity.ok().build();
    }
}
