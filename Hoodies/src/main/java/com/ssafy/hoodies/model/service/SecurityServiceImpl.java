package com.ssafy.hoodies.model.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class SecurityServiceImpl implements  SecurityService{
    public String findEmail(){
        SecurityContext context = SecurityContextHolder.getContext();
        Authentication authentication = context.getAuthentication();
        return ((org.springframework.security.core.userdetails.User) authentication.getPrincipal()).getUsername();
    }
}
