package com.LibraryManagementSystem.library.service;

import com.LibraryManagementSystem.library.bookrepo.BookRepository;
import com.LibraryManagementSystem.library.bookrepo.IssueRecordRepository;
import com.LibraryManagementSystem.library.bookrepo.MemberRepository;
import com.LibraryManagementSystem.library.model.Book;
import com.LibraryManagementSystem.library.model.IssueRecord;
import com.LibraryManagementSystem.library.model.Member;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class LibraryService {

    private final BookRepository bookRepository;
    private final MemberRepository memberRepository;
    private final IssueRecordRepository issueRecordRepository;

    public LibraryService(
            BookRepository bookRepository,
            MemberRepository memberRepository,
            IssueRecordRepository issueRecordRepository
    ) {
        this.bookRepository = bookRepository;
        this.memberRepository = memberRepository;
        this.issueRecordRepository = issueRecordRepository;
    }

    // Add book
    public Book addBook(Book book) {
        book.setAvailableCopies(book.getTotalCopies());
        return bookRepository.save(book);
    }

    // List all books
    public Iterable<Book> listBooks() {
        return bookRepository.findAll();
    }

    // Register member
    public Member registerMember(Member member) {
        return memberRepository.save(member);
    }

    // List all members
    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }

    // Issue book
    public IssueRecord issueBook(String isbn, Long memberId) {

        Book book = bookRepository.findById(isbn)
                .orElseThrow(() ->
                        new RuntimeException("Book not found")
                );

        memberRepository.findById(memberId)
                .orElseThrow(() ->
                        new RuntimeException("Member not found")
                );

        if (book.getAvailableCopies() <= 0) {
            throw new RuntimeException("Book is not available");
        }

        IssueRecord issueRecord = new IssueRecord(
                isbn,
                memberId,
                LocalDate.now()
        );

        book.setAvailableCopies(
                book.getAvailableCopies() - 1
        );

        bookRepository.save(book);

        return issueRecordRepository.save(issueRecord);
    }

    // Return book
    public void returnBook(String isbn, Long memberId) {

        Book book = bookRepository.findById(isbn)
                .orElseThrow(() ->
                        new RuntimeException("Book not found")
                );

        IssueRecord issueRecord =
                issueRecordRepository
                        .findByIsbnAndMemberIdAndReturnDateIsNull(
                                isbn,
                                memberId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Active issue record not found"
                                )
                        );

        issueRecord.setReturnDate(LocalDate.now());

        if (book.getAvailableCopies() < book.getTotalCopies()) {
            book.setAvailableCopies(
                    book.getAvailableCopies() + 1
            );
        }

        issueRecordRepository.save(issueRecord);
        bookRepository.save(book);
    }
}