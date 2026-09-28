package com.hrflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
 interface BaseRepo<T, ID> extends JpaRepository<T, ID> {
}