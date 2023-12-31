import Image from "next/image";
import Link from "next/link";
import styles from "./singleNews.module.css";

const SingleNews = ({
  newsdata,
  index,
  lang,
  category,
  isSearch,
  queryString,
}) => {
  const searchParm = isSearch ? `?from=${queryString}` : "";
  return (
    <Link
      href={`/${lang}/${category}/${newsdata.article_id}${searchParm}`}
      className={styles.newsCard}
    >
      {newsdata.image_url && (
        <div className={styles.tumbNail}>
          {index > 1 ? (
            <Image
              src={newsdata.image_url}
              width={300}
              height={300}
              alt={newsdata.title}
              loading="lazy"
              blurDataURL={newsdata.image_url}
              placeholder="blur"
              sizes="100vw"
            />
          ) : (
            <Image
              src={newsdata.image_url}
              width={300}
              height={300}
              alt={newsdata.title}
              blurDataURL={newsdata.image_url}
              priority={true}
              placeholder="blur"
              sizes="100vw"
            />
          )}
        </div>
      )}
      <div className={styles.newsContent}>
        <h2 className={styles.h2Hdeading}>{newsdata.title}</h2>
        <p className={styles.published}>Published at : {newsdata.pubDate}</p>
      </div>
    </Link>
  );
};
export default SingleNews;
