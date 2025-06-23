// pages/UserProfile.jsx or inside Home.jsx
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { saveUserToBackend } from "../api/userAPI"; // 👈 You'll create this

const UserProfile = () => {
    const { user } = useUser();

    useEffect(() => {
        // console.log(user);
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
            // console.log("userData :", userData);
            saveUserToBackend(userData); // Send to backend
        }
    }, [user]);

    return (
        <></>
    );
};

export default UserProfile;
