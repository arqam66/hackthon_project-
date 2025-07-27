/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { categoriesData } from "../../../static/data";
import { AiOutlinePlusCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../../../redux/actions/product";

const SellerDashboardAddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [tags, setTags] = useState("");
  const [stock, setStock] = useState(0);
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const { seller } = useSelector((state) => state.seller);
  const { success, error } = useSelector((state) => state.products);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success("Product added successfully.");
      navigate("/seller/dashboard-products");
      window.location.reload();
    }
  }, [dispatch, error, success]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([]);
    files.forEach((file) => {
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only PNG, JPG, or JPEG files are allowed.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImages((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!seller || !seller._id) {
      toast.error("Seller not found. Please login again.");
      return;
    }

    if (!stock || Number(stock) <= 0) {
      toast.error("Stock must be greater than 0.");
      return;
    }
    if (!discountPrice || Number(discountPrice) < 3) {
      toast.error("Price (With Discount) must be at least 3.");
      return;
    }
    if (originalPrice && Number(originalPrice) < Number(discountPrice)) {
      toast.error(
        "Original Price must be greater than or equal to Discount Price."
      );
      return;
    }
    if (images.length === 0) {
      toast.error("Please upload at least one image.");
      return;
    }

    let imagesBase64 = images;
    if (images.length && typeof images[0] !== "string") {
      imagesBase64 = await Promise.all(
        Array.from(images).map(
          (file) =>
            new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(file);
            })
        )
      );
    }

    const payload = {
      name,
      description,
      category,
      tags,
      originalPrice,
      discountPrice,
      stock,
      sellerId: seller._id,
      images: imagesBase64,
    };

    dispatch(addProduct(payload));
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-[35rem]">
        <div
          className="bg-white py-8 px-4 shadow sm:rounded-sm sm:px-10"
          style={{ maxHeight: "calc(140vh - 100px)", overflowY: "auto" }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-base font-semibold text-gray-800 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={name}
                className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-lg"
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your product name..."
                required
              />
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-800 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                cols="30"
                rows="5"
                name="description"
                value={description}
                className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-lg"
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter your product description..."
                required
              ></textarea>
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-800 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-lg"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Choose a category</option>
                {categoriesData &&
                  categoriesData.map((i) => (
                    <option value={i.title} key={i.title}>
                      {i.title}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-800 mb-1">
                Tags
              </label>
              <input
                type="text"
                name="tags"
                value={tags}
                className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-lg"
                onChange={(e) => setTags(e.target.value)}
                placeholder="Enter your product tags..."
              />
            </div>
            <div className="flex gap-4">
              <div className="w-full">
                <label className="block text-base font-semibold text-gray-800 mb-1">
                  Original Price
                </label>
                <input
                  type="number"
                  name="originalPrice"
                  value={originalPrice}
                  min={1}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-lg"
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="Enter your product price..."
                />
              </div>
              <div className="w-full">
                <label className="block text-base font-semibold text-gray-800 mb-1">
                  Price (With Discount) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="discountPrice"
                  value={discountPrice}
                  min={1}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-lg"
                  onChange={(e) => setDiscountPrice(e.target.value)}
                  placeholder="Enter your product price with discount..."
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-800 mb-1">
                Product Stock <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="stock"
                value={stock}
                min={1}
                className="block w-full px-4 py-2 border border-gray-300 rounded-sm shadow-sm placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-lg"
                onChange={(e) => setStock(e.target.value)}
                placeholder="Enter your product stock..."
                required
              />
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-800 mb-1">
                Upload Images <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                id="upload"
                className="hidden"
                multiple
                onChange={handleImageChange}
              />
              <div className="flex items-center flex-wrap gap-3 mt-2">
                <label
                  htmlFor="upload"
                  className="cursor-pointer flex flex-col items-center justify-center w-28 h-28 border-2 border-dashed border-orange-400 bg-orange-50 rounded-sm hover:bg-orange-100 transition"
                >
                  <AiOutlinePlusCircle size={32} className="text-orange-500" />
                  <span className="text-xs text-gray-500 mt-1">Add Images</span>
                </label>
                {images &&
                  images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt=""
                        className="h-28 w-28 object-cover rounded-sm border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-white rounded-full p-1 text-gray-600 hover:text-orange-500 transition"
                        title="Remove"
                      >
                        <AiOutlineCloseCircle size={20} />
                      </button>
                    </div>
                  ))}
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-orange-500 hover:bg-gray-800 text-white rounded-sm font-semibold tracking-wide transition mt-4 flex items-center justify-center"
            >
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboardAddProduct;
