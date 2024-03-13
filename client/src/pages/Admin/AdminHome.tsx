import React from "react";
import RedemptionNotification from "../../components/RedemptionNotification/RedemptionNotification";
const Home: React.FC = () => {
  return (
    <div>
      <RedemptionNotification />
      <h1>Welcome to the admin landing page</h1>
      <p>Admin needs to be authenticated in order to enter this page</p>
    </div>
  );
};

export default Home;
