package com.LibraryManagementSystem.library.bookrepo;

//package com.example.library.repository;

import com.LibraryManagementSystem.library.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long> {
}
