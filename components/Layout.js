import dynamic from "next/dynamic";
import Head from "next/head";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { firBaseApp, messaging } from "../src/firebase";
import { getMessaging, getToken } from "firebase/messaging";
import axios from "axios";
import Header from "./header/Header";
import { useEffect } from "react";

const BottomBar = dynamic(() => import("./bottomBar/BottomBar"));

const Layout = ({ topright = true, children, showBottomBar = true }) => {
  //user notification
  async function requestPermission() {
    if (Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        // gernrate token
        const messaging = getMessaging(firBaseApp);
        const token = await getToken(messaging, {
          vapidKey:
            "BEWVewYC3Vja2sC3qQ12-JYZubW9p0797eHaiHLZUQixgCQQ_N-oKLnAbHmcuHIpdgwUc_FAY-d5EtwP7QvmVHg",
        });
        const resp = await axios.post("/api/notificationToken", { token });
        console.log(resp.data, "resp", token);
      }
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      requestPermission(messaging);
    }
  }, []);
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <Head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="shortcut  icon" href="/favicon.ico" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta
          name="google-adsense-account"
          content="ca-pub-4175301977598959"
        ></meta>
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Breaking News" />
        <meta name="twitter:card" content="summary" />
        <meta property="og:image:width" content="1500" />
        <meta property="og:image:height" content="786" />
        <link rel="icon" type="image/png" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <meta name="theme-color" content="#07007a" />
        <meta
          name="keywords"
          content="Hindi news, हिंदी न्यूज़ , Hindi Samachar, हिंदी समाचार, Latest News in Hindi, Breaking News in Hindi, ताजा ख़बरें, KP News"
        />

        <meta
          name="google-site-verification"
          content="XoxCEAtWRxogq-mb14a365YYn-1HEUUVRxclvZ_f7J0"
        />
      </Head>
      <Header topright={topright} />
      <main>
        <div className="container">{children}</div>
      </main>
      {showBottomBar && <BottomBar />}
    </GoogleOAuthProvider>
  );
};

export default Layout;
