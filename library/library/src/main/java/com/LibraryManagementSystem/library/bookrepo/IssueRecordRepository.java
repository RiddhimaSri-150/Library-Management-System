package com.LibraryManagementSystem.library.bookrepo;

//package com.example.library.repository;

import com.LibraryManagementSystem.library.model.IssueRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IssueRecordRepository extends JpaRepository<IssueRecord, Long> {

    // Spring Data JPA builds the query from this method name:
    // WHERE isbn = ? AND member_id = ? AND return_date IS NULL
    Optional<IssueRecord> findByIsbnAndMemberIdAndReturnDateIsNull(String isbn, Long memberId);
}
