import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Loader,
  Header,
  Footer,
  Breadcrumb,
  ProductCard,
} from "../../components";

const BestSellingProductsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { allProducts, isLoading } = useSelector((state) => state.products);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (isLoading) {
      setLoading(true);
      return;
    }

    if (Array.isArray(allProducts) && allProducts.length > 0) {
      const sortedData = [...allProducts].sort((a, b) => b.soldOut - a.soldOut);
      setData(sortedData);
    } else {
      setData([]);
    }

    setLoading(false);
    window.scrollTo(0, 0);
  }, [allProducts, isLoading]);

  return (
    <>
      <Header />
      <Breadcrumb mainTitle="Best Selling Products" page="Products" />

      {loading ? (
        <div className="w-full min-h-[60vh] flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className="w-11/12 mx-auto mt-10">
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
            {data && data.length > 0 ? (
              data.map((item, index) => <ProductCard data={item} key={index} />)
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-center text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-16 h-16 mb-4 text-orange-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354l2.123 4.3 4.747.691-3.435 3.347.811 4.726L12 15.896l-4.246 2.222.811-4.726-3.435-3.347 4.747-.691L12 4.354z"
                  />
                </svg>
                <p className="text-lg font-medium">
                  No best selling products yet
                </p>
                <p className="text-sm mt-1 text-gray-400">
                  Top-selling items will appear here once available.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default BestSellingProductsPage;
