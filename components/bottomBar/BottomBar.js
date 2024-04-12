import React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  faMagnifyingGlass,
  faHouse,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import FontAwesomeIcon from "../FontAwesomeIcon";
import styles from "./BottomBar.module.css";
import { showLangSec, showSearchSec } from "@/redux/slices/searchSlice";
import Button from "../Button";

const ShareBTN = dynamic(() => import("../shareBtn/ShareBTN"));
const PushNotification = dynamic(() =>
  import("../pushNotification/PushNotification")
);

const BottomBar = () => {
  const { isAdmin } = useSelector((state) => state.oneTapLogin);
  const { showSearch } = useSelector((state) => state.searchSlice);
  const { notificationData } = useSelector((state) => state.notification) || {};

  const router = useRouter();
  const dispatch = useDispatch();

  const toggleSearchBar = () => {
    showSearch ? dispatch(showSearchSec(false)) : dispatch(showSearchSec(true));
    dispatch(showLangSec(false));
  };

  return (
    <ul className={styles.bottomBaar}>
      <li>
        <Link href="/" className={router.asPath == "/" ? "active" : ""}>
          <FontAwesomeIcon icon={faHouse} />
          <span>Home</span>
        </Link>
      </li>
      <li>
        <Button
          onClick={toggleSearchBar}
          type="button"
          title="Search"
          ariaLabel="Search"
          id="bottomSearch"
          classes={styles.bottomBaarSearch}
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          <span>Search</span>
        </Button>
      </li>
      <li>
        <Link
          href="/profile"
          className={router.asPath == "/profile" ? "active" : ""}
        >
          <FontAwesomeIcon icon={faUser} />
          <span>Profile</span>
        </Link>
      </li>
      <li>
        <ShareBTN />
      </li>
      {isAdmin &&
        notificationData &&
        Object.keys(notificationData).length > 0 && (
          <li>
            <PushNotification />
          </li>
        )}
    </ul>
  );
};
export default BottomBar;
