package com.example.backend.websocketchat.config;

import java.io.Serializable;
import java.security.Principal;

import lombok.Data;

@Data
public class ChatUserPrincipal implements Principal, Serializable {
    private final String userID; 

    public ChatUserPrincipal(String userID) {
        if (userID == null) {
            throw new NullPointerException("null name is illegal");
        }
        this.userID = userID;
    }

    @Override
    public String getName() {
        return this.userID;
    }

    // @Override
    // public boolean equals(Object obj) {
    //     if (this == obj) {
    //         return true;
    //     }
    //     if (obj instanceof ChatUserPrincipal) {
    //         ChatUserPrincipal other = (ChatUserPrincipal) obj;
    //         return this.userWSID.equals(other.getName());
    //     }
    //     return false;
    // }

    // @Override
    // public int hashCode() {
    //     return this.userWSID.hashCode();
    // }

    @Override
    public String toString() {
        return "ChatUserPrincipal{UserID='" + this.userID + "'}";
    }
}
