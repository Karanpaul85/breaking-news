// pages/index.js
import Layout from "../../components/Layout";
import { fetchSearchData } from "../redux/slices/searchSlice";
import { wrapper } from "../utils/withRedux";
import styles from "../styles/Home.module.css";
import { allConst } from "@/constant/common_constants";
import Head from "next/head";
import { ogMetaTags } from "../../components/commonOgMetatags";
import { ogErrorMetaTags } from "../../components/commonErrorMetatags";
import SingleNews from "../../components/singleNews/SingleNews";
import { useEffect } from "react";

const SearchNews = ({ data, errorData, category, lang, queryString }) => {
  const { textConst } = allConst;
  useEffect(() => {}, []);
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
        <div className={styles.mainHeading}>
          <h1>{textConst.API_ERROR}</h1>
        </div>
        <div className={styles.newsSection}>
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
          "Search"
        )}
      </Head>
      {/* <div style={{ height: 200 }}>Slider</div> */}
      <div className={styles.mainHeading}>
        <h1>{textConst.LATEST_NEWS}</h1>
      </div>
      <div className={styles.newsSection}>
        {data && data.length > 0
          ? data.map((item, index) => {
              return (
                <SingleNews
                  key={item.article_id}
                  newsdata={item}
                  index={index}
                  lang={lang}
                  category={category}
                  isSearch={true}
                  queryString={queryString}
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
      const options = { lang: ctx.query.lang, q: ctx.query.q };
      const serverData = await store.dispatch(fetchSearchData(options));
      const data = serverData.payload ? serverData.payload : null;
      const errorData = serverData.error ? serverData?.error?.message : null;
      return {
        props: {
          data,
          errorData,
          category: "top",
          lang: ctx.query.lang,
          queryString: ctx.query.q,
        },
      };
    } catch (error) {
      console.error("API Error:", error);
    }
  }
);
export default SearchNews;
