import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { saveUserToBackend } from "../api/userAPI"; 

const UserProfile = () => {
    const { user } = useUser();

    useEffect(() => {
        if (user) {
            const userData = {
                userId: user.id,
                username: user.username,
                fullName: user.fullName,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.emailAddresses[0]?.emailAddress,
                emailId: user.emailAddresses[0]?.id,
                passwordEnabled: user.passwordEnabled,
                twoFactorEnabled: user.twoFactorEnabled,
                hasVerifiedEmailAddress: user.hasVerifiedEmailAddress,
                imageUrl: user.imageUrl,
                createdAtClerk: user.createdAt,
                lastSignInAt: user.lastSignInAt,
            };
            saveUserToBackend(userData); 
        }
    }, [user]);

    return (
        <></>
    );
};

export default UserProfile;
