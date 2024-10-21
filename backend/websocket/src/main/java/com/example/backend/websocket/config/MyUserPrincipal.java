package com.example.backend.websocket.config;

import java.io.Serializable;
import java.security.Principal;

import lombok.Data;

@Data
public class MyUserPrincipal implements Principal, Serializable {
    private static final long serialVersionUID = 1L;
    private final String name; // the userId / wsId
    private String userEmail = "";

    public MyUserPrincipal(String name) {
        if (name == null) {
            throw new NullPointerException("null name is illegal");
        }
        this.name = name;
    }

    @Override
    public String getName() {
        return this.name;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj instanceof MyUserPrincipal) {
            MyUserPrincipal other = (MyUserPrincipal) obj;
            return this.name.equals(other.getName());
        }
        return false;
    }

    @Override
    public int hashCode() {
        return this.name.hashCode();
    }

    @Override
    public String toString() {
        return "MyUserPrincipal{name='" + this.name + "'}";
    }
}
