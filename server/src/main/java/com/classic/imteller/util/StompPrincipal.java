package com.classic.imteller.util;

import java.security.Principal;

public class StompPrincipal implements Principal {
    private String name;

    // 생성자
    public StompPrincipal(String name) { this.name = name; }

    @Override
    public String getName() { return name;}
}