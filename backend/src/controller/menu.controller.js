import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { requredField } from "../utils/helper.js";
import Menu from "../models/menu.models.js";
import ApiError from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../services/cloudinary.service.js";

const addNewMenu = asyncHandler(async (req, res) => {
  const { itemsName, itemDescription, priceOfItem, itemCategory } = req.body;

  requredField([itemsName, priceOfItem, itemCategory]);

  let itemImageUrl = "";

  if (req.file) {
    const menuImageData = await uploadOnCloudinary(
      req.file.path,
      "restaurant/menu",
    );
    itemImageUrl = menuImageData.secure_url;
  } else {
    itemImageUrl = req.body.itemImage || "";
  }

  if (!itemImageUrl) {
    throw new ApiError(400, "Menu item image is required");
  }

  const menu = await Menu.create({
    itemsName,
    itemDescription: itemDescription || "",
    itemImage: itemImageUrl,
    itemCategory,
    priceOfItem,
    isAvailable: true,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        menu,
        `${menu.itemsName} added to menu successfully`,
      ),
    );
});

const fetchMenuFullMenu = asyncHandler(async (req, res) => {
  const items = await Menu.find();

  return res
    .status(200)
    .json(new ApiResponse(200, items, "all items fetch successfully"));
});

const deleteItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;

  await Menu.findByIdAndDelete(itemId);

  return res
    .status(204)
    .json(new ApiResponse(204, {}, "Item delete sucessfully"));
});

const changePrice = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const { newPrice } = req.body;

  requredField([newPrice]);

  await Menu.findByIdAndUpdate(
    itemId,
    {
      $set: {
        priceOfItem: newPrice,
      },
    },
    { save: false },
  );

  return res
    .status(201)
    .json(new ApiResponse(201, {}, "item update successfully"));
});

export { addNewMenu, fetchMenuFullMenu, deleteItem, changePrice };
