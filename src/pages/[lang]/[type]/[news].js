import ReactHtmlParser from "react-html-parser";
import Layout from "../../../../components/Layout";
import { wrapper } from "@/utils/withRedux";
import { fetchData } from "@/redux/slices/newsSlice";
import Head from "next/head";
import Image from "next/image";
import { ogMetaTags } from "../../../../components/commonOgMetatags";
import { ogErrorMetaTags } from "../../../../components/commonErrorMetatags";
import styles from "./singleNews.module.css";
import headingStyle from "../../../styles/Home.module.css";
import { fetchSearchData } from "@/redux/slices/searchSlice";
import { allConst } from "@/constant/common_constants";
import PushNotification from "../../../../components/pushNotification/PushNotification";
import { useSelector } from "react-redux";

const News = ({ data, errorData }) => {
  const { isAdmin } = useSelector((state) => state.oneTapLogin);
  const { textConst } = allConst;
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
        <div className="newsSection" style={headingStyle.newsSection}>
          <p>{errorData}</p>
        </div>
      </Layout>
    );
  }
  return (
    <Layout>
      <Head>
        {ogMetaTags(data ? data : "Welcome to world breaking News", "Single")}
      </Head>
      <div>
        {data.image_url && (
          <div className={styles.tumbNail}>
            <Image
              src={data.image_url}
              width={640}
              height={480}
              alt={data.title}
              blurDataURL={data.image_url}
              priority={true}
              placeholder="blur"
              sizes="100vw"
            />
          </div>
        )}
        <div className={styles.newsContent}>
          <h1>{data.title}</h1>
          <div className={styles.publish}>Published at : {data.pubDate}</div>
          <div className={styles.description}>
            {ReactHtmlParser(data.description)}
          </div>
        </div>
      </div>
      {isAdmin && data && <PushNotification notificationDetail={data} />}
    </Layout>
  );
};
export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    try {
      const options = { lang: ctx.query.lang, category: ctx.query.type };
      const serverData = await store.dispatch(
        ctx.query.from
          ? fetchSearchData({ lang: ctx.query.lang, q: ctx.query.from })
          : fetchData(options)
      );
      const data = serverData.payload ? serverData.payload : null;
      const errorData = serverData.error ? serverData?.error?.message : null;
      const singleNews =
        data &&
        data.find((item) => {
          return item.article_id == ctx.query.news;
        });
      return {
        props: {
          data: singleNews,
          errorData,
        },
      };
    } catch (error) {
      console.error("API Error:", error);
    }
  }
);
export default News;
