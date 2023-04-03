import { Image } from "react-native";
import { getUser } from "../lib/user";
import { useState, useEffect } from "react";
import { useUserContext } from "../context/UserContext";

function Avatar({source, size, style}){
    
    const {user} = useUserContext();

    useEffect(() => {
        getUser(user.id).then(user);
    }, [ user]);

    return (
        <Image
            source={source || require('../assets/images/user.png')}
            resizeMode="cover"
            style={[
                style,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                },
            ]}
        />
    );
}

Avatar.defaultProps = {
    size : 32,
};

export default Avatar;