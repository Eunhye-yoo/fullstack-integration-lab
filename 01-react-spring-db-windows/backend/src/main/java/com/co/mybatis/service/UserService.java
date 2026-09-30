package com.co.mybatis.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.co.mybatis.mapper.UserMapper;
import com.co.mybatis.model.User;

@Service
public class UserService {
    private final UserMapper userMapper;

    public UserService(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public List<User> getAllUsers() {
        return userMapper.findAll();
    }

    public User getUser(Long id) {
        return userMapper.findById(id);
    }

    public int createUser(User user) {
        return userMapper.insert(user);
    }

    public int updateUser(User user) {
        return userMapper.update(user);
    }

    public int deleteUser(Long id) {
        return userMapper.delete(id);
    }
}
