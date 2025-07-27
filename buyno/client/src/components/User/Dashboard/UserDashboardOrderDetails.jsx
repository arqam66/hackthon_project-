import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { RxCross1 } from "react-icons/rx";
import { BsFillBagFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { getUserOrders } from "../../../redux/actions/order";
import { AiFillStar, AiOutlineMessage, AiOutlineStar } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../../General/Loader";

const UserDashboardOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const { user } = useSelector((state) => state.user);
  const { isLoading, orders } = useSelector((state) => state.order);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  useEffect(() => {
    dispatch(getUserOrders(user._id));
  }, [dispatch, user._id]);

  const data = orders && orders.find((item) => item._id === id);

  const refundHandler = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/orders/user/order-refund/${id}`,
        { status: "Processing refund" },
        { withCredentials: true }
      );
      toast.success("Your refund request has been sent successfully!");
      dispatch(getUserOrders(user._id));
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error while order refunding!"
      );
    }
  };

  const reviewHandler = async (e) => {
    await axios
      .put(
        `${process.env.REACT_APP_BACKEND_URL}/products/review/add`,
        {
          user,
          rating,
          comment,
          productId: selectedItem?._id,
          orderId: id,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success(res.data.message);
        dispatch(getUserOrders(user._id));
        setComment("");
        setRating(null);
        setOpen(false);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleMessageSubmit = async () => {
    if (isAuthenticated) {
      const userId = user._id;
      const sellerId = data?.cart[0]?.seller?._id;
      const groupTitle = [userId, sellerId].sort().join("_");

      await axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/conversations/new-conversation`,
          {
            groupTitle,
            userId,
            sellerId,
          }
        )
        .then((res) => {
          navigate(`/user/inbox?${res.data.conversation._id}`);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    } else {
      toast.error("Please login to send a message!");
      navigate("/user/login");
    }
  };

  return isLoading ? (
    <div className="flex items-center justify-center min-h-screen">
      <Loader />
    </div>
  ) : (
    <div className="w-11/12 mx-auto flex flex-col py-10 min-h-screen px-4 md:px-8">
      <div className="bg-white rounded-sm shadow-md p-6 md:p-10 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between text-orange-500">
          <div className="flex items-center space-x-2">
            <BsFillBagFill size={30} />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Order Details
            </h1>
          </div>
        </div>

        <div className="w-full flex flex-col md:flex-row items-center justify-between border-b pb-4">
          <h5 className="text-gray-600 text-base md:text-lg">
            Order ID:{" "}
            <span className="font-semibold text-gray-800">
              #{data?._id?.slice(0, 8)}
            </span>
          </h5>
          <h5 className="text-gray-600 text-base md:text-lg">
            Placed on:{" "}
            <span className="font-semibold text-gray-800">
              {data?.createdAt?.slice(0, 10)}
            </span>
          </h5>
        </div>

        <div className="mt-8 space-y-6">
          {data?.cart.map((item, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row md:items-center gap-4 border-b pb-4 last:border-b-0 bg-gray-50 rounded-sm px-4 py-3"
            >
              <img
                src={item?.images && item.images[0]?.url}
                alt=""
                className="w-20 h-20 object-cover rounded-sm border shadow-sm"
              />
              <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <h5 className="text-lg font-semibold text-gray-800">
                    {item.name}
                  </h5>
                  <p className="text-gray-600">
                    US${item.discountPrice} × {item.qty}
                  </p>
                </div>
                {!item.isReviewed && data?.status === "Delivered" ? (
                  <button
                    className="mt-2 md:mt-0 ml-0 md:ml-4 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold rounded-sm px-5 py-2 text-base transition border border-gray-200 shadow-sm"
                    onClick={() => setOpen(true) || setSelectedItem(item)}
                  >
                    Write a review
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        {open && (
          <div className="fixed w-full h-screen bg-[#0000004b] top-0 left-0 flex items-center justify-center z-50">
            <div className="w-full max-w-[35rem] bg-white py-8 px-4 shadow sm:rounded-sm sm:px-10 relative overflow-y-scroll max-h-[90vh]">
              <div className="w-full flex justify-end p-3">
                <RxCross1
                  size={30}
                  onClick={() => setOpen(false)}
                  className="cursor-pointer text-gray-500 hover:text-orange-500"
                />
              </div>
              <h2 className="text-2xl font-extrabold text-center text-gray-800 mb-6">
                Give a Review
              </h2>
              <div className="w-full flex items-center mb-6">
                <img
                  src={selectedItem?.images && selectedItem.images[0]?.url}
                  alt=""
                  className="w-20 h-20 object-cover rounded-sm border"
                />
                <div className="pl-4">
                  <div className="text-lg font-semibold text-gray-800">
                    {selectedItem?.name}
                  </div>
                  <div className="text-base text-gray-600">
                    US${selectedItem?.discountPrice} x {selectedItem?.qty}
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-lg font-semibold text-gray-800 mb-2">
                  Give a Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((i) =>
                    rating >= i ? (
                      <AiFillStar
                        key={i}
                        className="mr-1 cursor-pointer"
                        color="rgb(246,186,0)"
                        size={25}
                        onClick={() => setRating(i)}
                      />
                    ) : (
                      <AiOutlineStar
                        key={i}
                        className="mr-1 cursor-pointer"
                        color="rgb(246,186,0)"
                        size={25}
                        onClick={() => setRating(i)}
                      />
                    )
                  )}
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-lg font-semibold text-gray-800 mb-2">
                  Write a comment
                  <span className="ml-1 font-normal text-base text-gray-400">
                    (optional)
                  </span>
                </label>
                <textarea
                  name="comment"
                  cols="20"
                  rows="5"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="How was your product? Write your expression about it!"
                  className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-lg"
                ></textarea>
              </div>
              <button
                className={`w-full py-3 bg-orange-500 hover:bg-gray-800 text-white rounded-sm font-semibold text-lg transition`}
                onClick={rating > 1 ? reviewHandler : null}
              >
                Submit
              </button>
            </div>
          </div>
        )}

        <div className="text-right pt-4 mt-4 border-t">
          <h5 className="text-lg md:text-xl font-semibold text-gray-800">
            Total Price:{" "}
            <span className="text-orange-600">US${data?.totalPrice}</span>
          </h5>
        </div>

        <div className="w-full flex flex-col md:flex-row gap-8 mt-8">
          <div className="w-full md:w-3/5">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              Shipping Address:
            </h4>
            <p className="text-gray-700 mb-1">
              {data?.shippingAddress.address1 +
                " " +
                data?.shippingAddress.address2}
            </p>
            <p className="text-gray-700 mb-1">
              {data?.shippingAddress.country}
            </p>
            <p className="text-gray-700 mb-1">{data?.shippingAddress.city}</p>
            <p className="text-gray-700">{data?.user?.phoneNumber}</p>
          </div>
          <div className="w-full md:w-2/5">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              Payment Info:
            </h4>
            <p className="text-gray-700">
              Status:{" "}
              <span className="font-semibold text-orange-600">
                {data?.paymentInfo?.status
                  ? data.paymentInfo.status.charAt(0).toUpperCase() +
                    data.paymentInfo.status.slice(1)
                  : "Not Paid"}
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mt-6">
          {data?.status === "Delivered" && (
            <button
              onClick={refundHandler}
              className="w-full md:w-auto bg-orange-500 hover:bg-gray-800 text-white rounded-sm font-semibold h-11 text-lg px-8 transition"
            >
              Give a Refund
            </button>
          )}
          <button
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-orange-500 hover:bg-gray-300 hover:text-black text-white font-semibold rounded-sm py-3 px-4 shadow-sm transition"
            onClick={handleMessageSubmit}
          >
            Send Message <AiOutlineMessage size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardOrderDetails;
