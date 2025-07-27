import { useEffect } from "react";
import {
  Header,
  Breadcrumb,
  UserDashboardInbox,
  Footer,
} from "../../../components";

const UserDashboardInboxPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header />
      <Breadcrumb mainTitle={"Your Chats"} page={"Inbox"} />
      <UserDashboardInbox />
      <br />
      <br />
      <Footer />
    </>
  );
};

export default UserDashboardInboxPage;
