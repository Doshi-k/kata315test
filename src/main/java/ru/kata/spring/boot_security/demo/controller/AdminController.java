package ru.kata.spring.boot_security.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repository.RoleRepository;
import ru.kata.spring.boot_security.demo.service.UserService;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;
    private final RoleRepository roleRepository;

    public AdminController(UserService userService, RoleRepository roleRepository) {
        this.userService = userService;
        this.roleRepository = roleRepository;
    }

    @GetMapping
    public String userList(Model model) {
        model.addAttribute("allUsers", userService.getAllUsers());
        return "admin";
    }

    @GetMapping("/registration")
    public String registration(ModelMap model) {
        model.addAttribute("userForm", new User());
        model.addAttribute("roles", roleRepository.findAll());
        return "registration";
    }

    @PostMapping("/registration")
    public String addUser(@ModelAttribute User userForm) {
        if (!userService.saveUser(userForm)) {
            return "userExistsError";
        }
        return "redirect:/admin";
    }

    @GetMapping("/{id}")
    public String showOneUser(@PathVariable Long id, Model model) {
        model.addAttribute("user", userService.getUserById(id));
        return "userPage";
    }

    @GetMapping("/{id}/edit")
    public String edit(Model model, @PathVariable Long id) {
        model.addAttribute("user", userService.getUserById(id));
        return "edit";
    }

    @PatchMapping("/{id}")
    public String edit(@ModelAttribute User user) {
        userService.updateUser(user);
        return "redirect:/admin";
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        userService.deleteUser(id);
        return "redirect:/admin";
    }

}
