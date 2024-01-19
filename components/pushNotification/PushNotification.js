import FontAwesomeIcon from "../FontAwesomeIcon";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import Button from "../Button";
import styles from "./pushNotification.module.css";
import { SwipeableDrawer } from "@mui/material";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

const PushNotification = ({ notificationDetail }) => {
  const [showNotifationDrawer, setShowNotifationDrawer] = useState(false);
  const [disabledBtn, setDisabledBtn] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const openNotificationSec = () => {
    setShowNotifationDrawer(!showNotifationDrawer);
  };
  const sendNotification = async () => {
    setDisabledBtn(true);
    const notification = {
      title: notificationDetail.title,
      body: notificationDetail.title,
      icon: notificationDetail.image_url,
      image: notificationDetail.image_url,
      click_action: currentUrl,
      data: {
        customData1: "",
      },
    };
    const resp = await axios.post(
      "/api/notificationToken/sendNotification",
      notification
    );
    if (resp) {
      setShowNotifationDrawer(false);
      setDisabledBtn(false);
    }
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);
  return (
    <>
      <Button
        classes={styles.notificationBtn}
        title="Push Notification"
        ariaLabel="Push Notification"
        id="pushNotification"
        onClick={openNotificationSec}
      >
        <FontAwesomeIcon icon={faBell} /> <span>Push Now</span>
      </Button>
      <SwipeableDrawer
        anchor="bottom"
        open={showNotifationDrawer}
        onClose={openNotificationSec}
        onOpen={openNotificationSec}
      >
        <div className={styles.notificationDrawer}>
          <div className={styles.notificationTitle}>
            {notificationDetail.title}
          </div>
          <div className={styles.notificationImage}>
            <Image
              src={notificationDetail.image_url}
              width={80}
              height={80}
              alt={notificationDetail.title}
              loading="lazy"
              blurDataURL={notificationDetail.image_url}
              placeholder="blur"
              sizes="100vw"
            />
          </div>
          <div className={styles.notificationDrawerBtnSec}>
            <Button
              classes={styles.notificationDrawerBtn}
              title="Push Notification"
              ariaLabel="Push Notification"
              id="pushNotification"
              onClick={sendNotification}
              disabled={disabledBtn}
            >
              <span
                className={`${styles.loading} ${disabledBtn && styles.show}`}
              ></span>
              Send Now
            </Button>
          </div>
        </div>
      </SwipeableDrawer>
    </>
  );
};
export default PushNotification;
