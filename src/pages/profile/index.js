import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import UserTopIcon from "../../../components/userDetails/UserTopIcon";
const Profile = () => {
  const router = useRouter();
  const { email, email_verified, name, picture } = useSelector(
    (state) => state.oneTapLogin
  );
  if (!email && !email_verified) {
    router.push("/login");
  }
  return (
    <Layout topright={false} showBottomBar={false}>
      <div className="container">
        <div className="style.profileContainer">
          <UserTopIcon
            email={email}
            name={name}
            picture={picture}
            emailVerifie={email_verified}
          />
        </div>
      </div>
    </Layout>
  );
};
export default Profile;
