package com.co.mybatis.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import com.co.mybatis.model.User;

@Mapper
public interface UserMapper {
    List<User> findAll();
    User findById(Long id);
    int insert(User user);
    int update(User user);
    int delete(Long id);
}
