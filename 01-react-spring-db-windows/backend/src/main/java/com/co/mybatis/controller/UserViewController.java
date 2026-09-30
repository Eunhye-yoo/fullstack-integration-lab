package com.co.mybatis.controller;

import com.co.mybatis.model.User;
import com.co.mybatis.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class UserViewController {

    private final UserService userService;

    public UserViewController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/user-list")
    public String list(Model model) {
        model.addAttribute("users", userService.getAllUsers());
        return "user-list";
    }

    @PostMapping("/user-add")
    public String add(@RequestParam String name, @RequestParam String email) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        userService.createUser(user);
        return "redirect:/user-list";
    }

    @GetMapping("/user-delete/{id}")
    public String delete(@PathVariable Long id) {
        userService.deleteUser(id);
        return "redirect:/user-list";
    }
    
    @GetMapping("/user-edit/{id}")
    public String editForm(@PathVariable Long id, Model model) {
        model.addAttribute("user", userService.getUser(id));
        return "user-edit";
    }

    @PostMapping("/user-update")
    public String update(@RequestParam Long id, @RequestParam String name, @RequestParam String email) {
        User user = new User();
        user.setId(id);
        user.setName(name);
        user.setEmail(email);
        userService.updateUser(user);
        return "redirect:/user-list";
    }

}
