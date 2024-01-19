import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import Tabbar from "../../../components/tabbar/TabBar";
import { wrapper } from "@/utils/withRedux";
import { fetchData } from "@/redux/slices/newsSlice";
import Head from "next/head";
import { ogErrorMetaTags } from "../../../components/commonErrorMetatags";
import { ogMetaTags } from "../../../components/commonOgMetatags";
import headingStyle from "../../styles/Home.module.css";
import { allConst } from "@/constant/common_constants";
import SingleNews from "../../../components/singleNews/SingleNews";
import PushNotification from "../../../components/pushNotification/PushNotification";
import { useSelector } from "react-redux";

const Types = ({ data, errorData, category }) => {
  const { isAdmin } = useSelector((state) => state.oneTapLogin);
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
      {isAdmin && data && data.length && (
        <PushNotification notificationDetail={data?.[0]} />
      )}
    </Layout>
  );
};
export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    try {
      const options = { lang: ctx.query.lang, category: ctx.query.type };
      const serverData = await store.dispatch(fetchData(options));
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
