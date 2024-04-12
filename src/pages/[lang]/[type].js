import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import Tabbar from "../../../components/tabbar/TabBar";
import { wrapper } from "@/utils/withRedux";
import {
  fetchData,
  fetchDataFromMDB,
  getApiCallTime,
  sendDataFromMDB,
  setApiCallTime,
} from "@/redux/slices/newsSlice";
import Head from "next/head";
import { ogErrorMetaTags } from "../../../components/commonErrorMetatags";
import { ogMetaTags } from "../../../components/commonOgMetatags";
import headingStyle from "../../styles/Home.module.css";
import { allConst } from "@/constant/common_constants";
import SingleNews from "../../../components/singleNews/SingleNews";
import { setNewsData } from "@/redux/slices/searchSlice";
import { setNotificationData } from "@/redux/slices/notificationSlice";
import { checkTimeisOver } from "@/utils/common";

const Types = ({ data, errorData, category }) => {
  const dispatch = useDispatch();
  dispatch(setNewsData(data));
  data && data.length > 0 && dispatch(setNotificationData(data[0]));
  const router = useRouter();
  const { textConst } = allConst;
  const { lang, type } = router.query;
  if (errorData) {
    return (
      <Layout>
        <Head>
          {errorData
            ? ogErrorMetaTags(errorData)
            : ogMetaTags(
                data && data.length
                  ? data?.[0]
                  : "Welcome to world breaking News"
              )}
        </Head>
        <div className={headingStyle.mainHeading}>
          <h1>{textConst.API_ERROR}</h1>
        </div>
        <div className={headingStyle.newsSection}>
          <p>{errorData}</p>
        </div>
      </Layout>
    );
  }
  return (
    <Layout>
      <Head>
        {ogMetaTags(
          data && data.length ? data?.[0] : "Welcome to world breaking News",
          type
        )}
      </Head>
      <Tabbar lang={lang} />
      <div className={headingStyle.mainHeading}>
        <h1>{textConst.LATEST_NEWS}</h1>
      </div>
      <div className={headingStyle.newsSection}>
        {data && data.length > 0
          ? data.map((item, index) => {
              return (
                <SingleNews
                  key={item.article_id}
                  newsdata={item}
                  index={index}
                  lang={lang}
                  category={category}
                />
              );
            })
          : "We can not find any results for this query"}
      </div>
    </Layout>
  );
};
export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    try {
      let serverData;
      const options = { lang: ctx.query.lang, category: ctx.query.type };
      const apiTimeTocall = await store.dispatch(getApiCallTime(options));
      const isTimeOver = await checkTimeisOver(
        apiTimeTocall?.payload?.timestamp
      );

      if (isTimeOver) {
        await store.dispatch(setApiCallTime(options));
        serverData = await store.dispatch(fetchData(options));
        if (!serverData.payload) {
          serverData = await store.dispatch(fetchDataFromMDB(options));
        } else {
          await store.dispatch(sendDataFromMDB(serverData.payload));
        }
      } else {
        serverData = await store.dispatch(fetchDataFromMDB(options));
        if (serverData.payload.length === 0) {
          await store.dispatch(setApiCallTime(options));
          serverData = await store.dispatch(fetchData(options));
          await store.dispatch(sendDataFromMDB(serverData.payload));
        }
      }

      const data = serverData.payload ? serverData.payload : null;
      const errorData = serverData.error ? serverData?.error?.message : null;
      return {
        props: {
          data,
          errorData,
          category: options.category,
          lang: options.lang,
        },
      };
    } catch (error) {
      console.error("API Error:", error);
    }
  }
);
export default Types;
